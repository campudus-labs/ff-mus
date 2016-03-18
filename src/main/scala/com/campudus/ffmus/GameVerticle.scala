package com.campudus.ffmus

import io.vertx.core.eventbus.Message
import io.vertx.core.json.JsonObject
import io.vertx.scala.ScalaVerticle

import scala.concurrent.Promise
import io.vertx.scala.FunctionConverters._


class GameVerticle extends ScalaVerticle {

  override def start(p: Promise[Unit]): Unit = {
    logger.info("starting GameVerticle")
    val eventBus = vertx.eventBus()
    //TODO address in variable
    eventBus.consumer("mus.game", { message: Message[JsonObject] =>
      message.reply(new JsonObject(
        """
          |{
          |  "type" : "test",
          |  "payload" : 5
          |}
        """.stripMargin))
    })

    p.success(())
  }

  override def stop(p: Promise[Unit]): Unit = {
    logger.info("stopped GameVerticle")
    p.success(())
  }
}
