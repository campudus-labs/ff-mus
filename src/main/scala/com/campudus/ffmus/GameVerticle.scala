package com.campudus.ffmus

import java.awt.Color
import java.util.UUID

import com.campudus.ffmus.models.Player
import io.vertx.core.eventbus.Message
import io.vertx.core.json.JsonObject
import io.vertx.scala.ScalaVerticle

import scala.concurrent.Promise
import io.vertx.scala.FunctionConverters._


object GameVerticle {
  val ADDRESS = "mus.game"
}

class GameVerticle extends ScalaVerticle {

  val players = List[Player]()

  val nameGenerator = new NameGenerator
  val colorGenerator = new ColorGenerator

  override def start(p: Promise[Unit]): Unit = {
    logger.info("starting GameVerticle")
    val eventBus = vertx.eventBus()

    eventBus.consumer(GameVerticle.ADDRESS, { message: Message[JsonObject] =>
      val messageType = message.body().getString("type")

      messageType match {
        case "Login" => handleLogin(message)
      }
    })

    p.success(())
  }

  def handleLogin(message: Message[JsonObject]) = {

    //TODO generate name, id and color

    val id = UUID.randomUUID.toString
    val name = nameGenerator.random()
    val color = colorGenerator.random()

    val newPlayer = Player(id, name, color)

    message.reply(new JsonObject(
      s"""
         |{
         |  "type" : "LoginReply",
         |  "payload" : {
         |    "id" : "${newPlayer.id}",
         |    "name" : "${newPlayer.name}",
         |    "color" : "${newPlayer.color}"
         |  }
         |}
      """.stripMargin))
  }

  override def stop(p: Promise[Unit]): Unit = {
    logger.info("stopped GameVerticle")
    p.success(())
  }
}
