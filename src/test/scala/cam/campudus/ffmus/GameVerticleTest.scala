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
import org.junit.{After, Before, Rule, Test}

import scala.util.{Failure, Success, Try}

@RunWith(classOf[VertxUnitRunner])
class GameVerticleTest extends LazyLogging {

  val vertx: Vertx = Vertx.vertx()
  val eventBus = vertx.eventBus()

  var deploymentId:String = null

  @Rule
  def rule = Timeout.seconds(1)

  @Before
  def setUp(context: TestContext): Unit = {
    val async = context.async()

    vertx.deployVerticle(new GameVerticle, new DeploymentOptions(), {
      case Success(id) =>
        deploymentId = id
        async.complete()
      case Failure(ex) => {
        context.fail(ex)
      }
    }: Try[String] => Unit)

  }

  @After
  def tearDown(context: TestContext): Unit = {
    if (deploymentId != null) {
      val async = context.async()
      vertx.undeploy(deploymentId, {
        case Success(_) =>
          logger.info("Verticle undeployed!")
          vertx.close({
            case Success(_) =>
              logger.info("Vertx closed!")
              async.complete()
            case Failure(e) =>
              logger.error("Vertx couldn't be closed!", e)
              context.fail(e)
              async.complete()
          }: Try[Void] => Unit)
        case Failure(e) =>
          logger.error("Verticle couldn't be undeployed!", e)
          context.fail(e)
          async.complete()
      }: Try[Void] => Unit)
    }
  }

  @Test
  def testLogin(context: TestContext): Unit = {
    val async = context.async()
    eventBus.send(GameVerticle.INCOMING_ADDRESS, new JsonObject(
      s"""
         |{
         |  "type" : "${EventTypes.LOGIN}"
         |}
      """.stripMargin), {
      case Success(message) =>
        logger.info(s"got message: ${message.body().encode()}")
        val actualBody = message.body()
        val actualType = actualBody.getString("type")
        val expectedType = EventTypes.LOGIN_REPLY

        val actualPayload = actualBody.getJsonObject("payload")

        context.assertEquals(expectedType, actualType)
        context.assertNotNull(actualPayload.getString("id"))
        context.assertNotNull(actualPayload.getString("color"))
        context.assertNotNull(actualPayload.getString("name"))

        async.complete()
      case Failure(ex) => context.fail(ex)
    }: Try[Message[JsonObject]] => Unit)
  }

}
