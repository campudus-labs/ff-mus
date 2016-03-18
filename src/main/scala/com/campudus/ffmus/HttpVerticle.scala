package com.campudus.ffmus

import io.vertx.core.http.{HttpServer, HttpServerRequest}
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler
import io.vertx.ext.web.handler.sockjs.{BridgeEvent, PermittedOptions, BridgeOptions, SockJSHandler}
import io.vertx.scala.ScalaVerticle
import io.vertx.scala.FunctionConverters._

import scala.concurrent.Promise
import scala.util.{Try, Failure, Success}

object HttpVerticle {
  val HTTP_PORT = "http_port"
  val HTTP_HOST = "http_host"
}

class HttpVerticle extends ScalaVerticle {

  override final def start(p: Promise[Unit]): Unit = {

    val router = Router.router(vertx)
    router.route("/out/*").handler(StaticHandler.create.setFilesReadOnly(false).setCacheEntryTimeout(1).setMaxAgeSeconds(2))
    router.route("/eventbus/*").handler(createSockJSBridge)

    val port = config.getInteger(HttpVerticle.HTTP_PORT, 8080)
    val host = config.getString(HttpVerticle.HTTP_HOST, "localhost")

    vertx.createHttpServer.requestHandler(router.accept(_: HttpServerRequest)).listen(port, host, {
      case Success(server) =>
        logger.info(s"Server successfully started on port: $port")
        p.success(server)
      case Failure(x) => p.failure(x)
    }: Try[HttpServer] => Unit)

  }

  override final def stop(p: Promise[Unit]) = {
    logger.info("HttpVerticle stopped")
    p.success(())
  }

  private def createSockJSBridge: SockJSHandler = {
    val sockJSHandler = SockJSHandler.create(vertx)
    val options = new BridgeOptions()
      .addOutboundPermitted(new PermittedOptions().setAddressRegex("mus\\..*"))
      .addInboundPermitted(new PermittedOptions().setAddressRegex("mus\\..*"))

    sockJSHandler.bridge(options)
  }

}
