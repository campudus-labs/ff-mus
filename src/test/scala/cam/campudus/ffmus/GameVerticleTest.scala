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
class GameVerticleTest extends LazyLogging {

  val vertx: Vertx = Vertx.vertx()
  val eventBus = vertx.eventBus()

  @Rule
  def rule = Timeout.seconds(1)

  @Before
  def setUp(context: TestContext): Unit = {
    val async = context.async()

    vertx.deployVerticle(new GameVerticle, new DeploymentOptions(), {
      case Success(id) =>
        async.complete()
      case Failure(ex) => {
        context.fail(ex)
      }
    }: Try[String] => Unit)

  }

  @Test
  def test(context: TestContext): Unit = {
    val async = context.async()
    eventBus.send("mus.game", new JsonObject(
      """
        |{}
      """.stripMargin), {
      case Success(message) =>
        logger.info(s"got message: ${message.body().encode()}")
        async.complete()
      case Failure(ex) => context.fail(ex)
    }: Try[Message[JsonObject]] => Unit)

    context.assertTrue(true)
  }

}
