package com.campudus.ffmus

import java.awt.Color
import java.util.UUID

import io.vertx.core.eventbus.Message
import io.vertx.core.json.JsonObject
import io.vertx.scala.ScalaVerticle

import scala.collection.mutable
import scala.concurrent.Promise
import io.vertx.scala.FunctionConverters._


object GameVerticle {
  val ADDRESS = "mus.game"
}

class GameVerticle extends ScalaVerticle {

  val events = mutable.MutableList[Event]()

  val nameGenerator = new NameGenerator
  val colorGenerator = new ColorGenerator

  override def start(p: Promise[Unit]): Unit = {
    logger.info("starting GameVerticle")
    val eventBus = vertx.eventBus()

    eventBus.consumer(GameVerticle.ADDRESS, { message: Message[JsonObject] =>
      val messageType = message.body().getString("type")

      messageType match {
        case EventTypes.LOGIN => handleLogin(message)
      }
    })

    p.success(())
  }

  def handleLogin(message: Message[JsonObject]) = {
    val eventBus = vertx.eventBus()
    val id = UUID.randomUUID.toString
    val name = nameGenerator.random()
    val color = colorGenerator.random()

    val event = UserJoinEvent(id, name, color)
    events += event

    message.reply(new JsonObject(
      s"""
         |{
         |  "type" : "${EventTypes.LOGIN_REPLY}",
         |  "payload" : {
         |    "id" : "$id",
         |    "name" : "$name",
         |    "color" : "$color"
         |  }
         |}
      """.stripMargin))

    eventBus.send(GameVerticle.ADDRESS, event.toJson)
  }

  override def stop(p: Promise[Unit]): Unit = {
    logger.info("stopped GameVerticle")
    p.success(())
  }
}
