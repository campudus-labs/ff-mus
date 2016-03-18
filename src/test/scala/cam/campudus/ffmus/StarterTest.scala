package cam.campudus.ffmus

import com.campudus.ffmus.{HttpVerticle, Starter}
import com.typesafe.scalalogging.LazyLogging
import io.vertx.core.Vertx
import io.vertx.core.http.HttpClientResponse
import io.vertx.ext.unit.TestContext
import io.vertx.ext.unit.junit.{Timeout, VertxUnitRunner}
import io.vertx.scala.FunctionConverters._
import org.junit.{Rule, Before, Test}
import org.junit.runner.RunWith

import scala.util.{Failure, Success, Try}

@RunWith(classOf[VertxUnitRunner])
class StarterTest extends LazyLogging {

  val vertx: Vertx = Vertx.vertx()

  @Rule
  def rule = Timeout.seconds(1)

  @Before
  def setUp(context: TestContext): Unit = {
    val async = context.async()

    vertx.deployVerticle(new Starter, {
      case Success(_) => async.complete()
      case Failure(ex) => context.fail(ex)
    }: Try[String] => Unit)
  }

  @Test
  def startingUpResultsInRunningHttpServer(context: TestContext): Unit = {
    val async = context.async()
    val request = vertx.createHttpClient().get(HttpVerticle.DEFAULT_HTTP_PORT, HttpVerticle.DEFAULT_HTTP_HOST, "/", { resp: HttpClientResponse =>
      async.complete()
    })
    request.end()
  }

}
