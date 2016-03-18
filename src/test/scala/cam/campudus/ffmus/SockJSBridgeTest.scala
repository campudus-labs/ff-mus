package cam.campudus.ffmus

import com.campudus.ffmus.{EventTypes, GameVerticle, HttpVerticle, Starter}
import com.typesafe.scalalogging.LazyLogging
import io.vertx.core.Vertx
import io.vertx.core.eventbus.Message
import io.vertx.core.http.{HttpClientOptions, WebSocket}
import io.vertx.core.json.JsonObject
import io.vertx.ext.unit.TestContext
import io.vertx.ext.unit.junit.{Timeout, VertxUnitRunner}
import io.vertx.scala.FunctionConverters._
import org.junit.runner.RunWith
import org.junit.{After, Before, Rule, Test}

import scala.util.{Failure, Success, Try}

@RunWith(classOf[VertxUnitRunner])
class SockJSBridgeTest extends LazyLogging {

  val vertx: Vertx = Vertx.vertx()
  var deploymentId: String = null

  @Rule
  def rule = Timeout.seconds(2)

  @Before
  def setUp(context: TestContext): Unit = {
    val async = context.async()

    vertx.deployVerticle(new Starter, {
      case Success(id) =>
        deploymentId = id
        async.complete()
      case Failure(ex) => context.fail(ex)
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
  def eventOnSocketClose(context: TestContext): Unit = {
    val async = context.async()
    val client = vertx.createHttpClient(new HttpClientOptions())
    val eventBus = vertx.eventBus()

    eventBus.consumer(GameVerticle.OUTGOING_ADDRESS, { message: Message[JsonObject] =>
      val actualBody = message.body()
      val actualType = actualBody.getString("type")
      val actualPayload = actualBody.getJsonObject("payload")
      if (actualType == EventTypes.USER_LEAVE) {
        context.assertEquals(context.get("userId"), actualPayload.getString("id"))
        async.complete()
      } else if (actualType == EventTypes.USER_JOIN) {
        context.put("userId", actualPayload.getString("id"))
      }
    })

    client.websocket(HttpVerticle.DEFAULT_HTTP_PORT, HttpVerticle.DEFAULT_HTTP_HOST, "/eventbus/websocket", { socket: WebSocket =>

      val msgReg = new JsonObject().put("type", "register").put("address", GameVerticle.INCOMING_ADDRESS)
      socket.writeFrame(io.vertx.core.http.WebSocketFrame.textFrame(msgReg.encode(), true))

      val msg = new JsonObject().put("type", "send").put("address", GameVerticle.INCOMING_ADDRESS).put("body", new JsonObject().put("type", EventTypes.LOGIN))
      socket.writeFrame(io.vertx.core.http.WebSocketFrame.textFrame(msg.encode(), true))

      vertx.setTimer(100L, { l: java.lang.Long =>
        socket.close()
        client.close()
      })
    })
  }

}
