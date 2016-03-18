package cam.campudus.ffmus

import com.campudus.ffmus.{EventTypes, GameVerticle}
import com.typesafe.scalalogging.LazyLogging
import io.vertx.core.eventbus.Message
import io.vertx.core.json.JsonObject
import io.vertx.core.{DeploymentOptions, Vertx}
import io.vertx.ext.unit.TestContext
import io.vertx.ext.unit.junit.{Timeout, VertxUnitRunner}
import io.vertx.scala.FunctionConverters._
import org.junit.runner.RunWith
import org.junit.{Before, Rule, Test}

import scala.util.{Failure, Success, Try}

@RunWith(classOf[VertxUnitRunner])
class LoggedInGameVerticleTest extends LazyLogging {

  val vertx: Vertx = Vertx.vertx()
  val eventBus = vertx.eventBus()

  @Rule
  def rule = Timeout.seconds(1)

  @Before
  def setUp(context: TestContext): Unit = {
    val async = context.async()

    vertx.deployVerticle(new GameVerticle, new DeploymentOptions(), {
      case Success(id) =>
        vertx.eventBus().send(GameVerticle.INCOMING_ADDRESS, new JsonObject(
          s"""
             |{
             |  "type" : "${EventTypes.LOGIN}"
             |}
          """.stripMargin), {
          case Success(message) =>
            val actualBody = message.body()
            val actualType = actualBody.getString("type")
            val expectedType = EventTypes.LOGIN_REPLY

            val actualPayload = actualBody.getJsonObject("payload")

            context.assertEquals(expectedType, actualType)
            context.assertNotNull(actualPayload.getString("id"))
            context.assertNotNull(actualPayload.getString("color"))
            context.assertNotNull(actualPayload.getString("name"))
            context.put("userId", actualPayload.getString("id"))
            async.complete()
          case Failure(ex) => context.fail(ex)
        }: Try[Message[JsonObject]] => Unit)
      case Failure(ex) =>
        context.fail(ex)
    }: Try[String] => Unit)

  }

  @Test
  def testLogin(c: TestContext): Unit = {
    c.assertTrue(true)
  }

  @Test
  def userJoinEvent(context: TestContext): Unit = {
    val async = context.async()

    eventBus.consumer(GameVerticle.OUTGOING_ADDRESS, { message: Message[JsonObject] =>
      context.assertNotNull(message.body())
      val json = message.body()
      context.assertTrue(json.containsKey("type"))
      context.assertEquals(EventTypes.USER_JOIN, json.getString("type"))
      context.assertTrue(json.containsKey("payload"))
      context.assertTrue(json.getJsonObject("payload").containsKey("id"))
      context.assertTrue(json.getJsonObject("payload").containsKey("name"))
      context.assertTrue(json.getJsonObject("payload").containsKey("color"))
      async.complete()
    })

    eventBus.send(GameVerticle.INCOMING_ADDRESS, new JsonObject(
      s"""
         |{
         |  "type" : "${EventTypes.LOGIN}"
         |}
      """.stripMargin))
  }

  @Test
  def sendingClickResultsInMessage(context: TestContext): Unit = {
    val async = context.async()
    val eventBus = vertx.eventBus()
    val x = 1
    val y = 1

    eventBus.consumer(GameVerticle.OUTGOING_ADDRESS, { message: Message[JsonObject] =>
      val json = message.body()
      context.assertTrue(json.containsKey("type"))
      context.assertEquals(EventTypes.USER_CLICKED, json.getString("type"))
      context.assertTrue(json.containsKey("payload"))
      context.assertTrue(json.getJsonObject("payload").containsKey("userId"))
      context.assertTrue(json.getJsonObject("payload").containsKey("x"))
      context.assertTrue(json.getJsonObject("payload").containsKey("y"))

      context.assertEquals(context.get("userId"), json.getJsonObject("payload").getString("userId"))
      context.assertEquals(x, json.getJsonObject("payload").getInteger("x"))
      context.assertEquals(y, json.getJsonObject("payload").getInteger("y"))

      async.complete()
    })

    eventBus.send(GameVerticle.INCOMING_ADDRESS, new JsonObject(
      s"""
         |{
         |  "type" : "${EventTypes.USER_CLICK}",
         |  "payload" : {
         |    "userId" : "${context.get("userId")}",
         |    "x" : $x,
         |    "y" : $y
         |  }
         |}
      """.stripMargin))
  }
}
