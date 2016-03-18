package cam.campudus.ffmus

import com.campudus.ffmus.GameVerticle
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
        /* TODO login */
        async.complete()
      case Failure(ex) =>
        context.fail(ex)
    }: Try[String] => Unit)

  }

  @Test
  def testLogin(c: TestContext): Unit = {
    c.assertTrue(true)
  }

  @Test
  def sendingClickResultsInMessage(context: TestContext): Unit = {
    val async = context.async()
    val eventBus = vertx.eventBus()

    eventBus.consumer("mus.game", { message: Message[JsonObject] =>
      async.complete()
    })

    eventBus.send("mus.game", new JsonObject(
      """
        |{
        |  "type" : "USER_CLICKED",
        |  "payload" : {
        |    "x" : 1,
        |    "y" : 1
        |  }
        |}
      """.stripMargin))
  }

}
