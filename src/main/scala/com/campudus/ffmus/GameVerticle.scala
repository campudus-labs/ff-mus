package com.campudus.ffmus

import java.util.UUID

import io.vertx.core.eventbus.Message
import io.vertx.core.json.{JsonArray, JsonObject}
import io.vertx.scala.ScalaVerticle

import scala.collection.mutable
import scala.concurrent.Promise
import io.vertx.scala.FunctionConverters._


object GameVerticle {
  val INCOMING_ADDRESS = "mus.game.in"
  val OUTGOING_ADDRESS = "mus.game.out"
}

class GameVerticle extends ScalaVerticle {

  val events = mutable.MutableList[Event]()
  val socketIdUserId = mutable.HashMap[String, String]()

  val nameGenerator = new NameGenerator
  val colorGenerator = new ColorGenerator

  override def start(p: Promise[Unit]): Unit = {
    logger.info("starting GameVerticle")
    val eventBus = vertx.eventBus()

    eventBus.consumer(GameVerticle.INCOMING_ADDRESS, { message: Message[JsonObject] =>
      val messageType = message.body().getString("type")
      logger.info(s"GameVerticle got message: $messageType")

      messageType match {
        case EventTypes.LOGIN => handleLogin(message)
        case EventTypes.LOGOUT => handleLogout(message)
        case EventTypes.USER_CLICK => handleClick(message)
      }
    })

    p.success(())
  }

  def handleLogin(message: Message[JsonObject]) = {
    val eventBus = vertx.eventBus()
    val id = UUID.randomUUID.toString
    val name = nameGenerator.random()
    val color = colorGenerator.random()

    val socketId = message.body().getString("socketId")
    socketIdUserId.put(socketId, id)

    val event = UserJoinEvent(id, name, color)
    val allEventsToReply = events.map(_.toJson.encode()).mkString("[", ",", "]")

    events += event

    message.reply(new JsonObject(
      s"""
         |{
         |  "type" : "${EventTypes.LOGIN_REPLY}",
         |  "payload" : {
         |    "id" : "$id",
         |    "name" : "$name",
         |    "color" : "$color",
         |    "events" : ${new JsonArray(allEventsToReply)}
         |  }
         |}
      """.stripMargin))

    eventBus.send(GameVerticle.OUTGOING_ADDRESS, event.toJson)
  }

  def handleLogout(message: Message[JsonObject]) = {
    val socketId = message.body().getString("socketId")
    val userIdOpt = socketIdUserId.remove(socketId)

    userIdOpt match {
      case Some(userId) =>
        val eventBus = vertx.eventBus()
        val event = UserLeaveEvent(userId)
        eventBus.send(GameVerticle.OUTGOING_ADDRESS, event.toJson)
      case None =>
    }
  }

  def handleClick(message: Message[JsonObject]) = {
    val eventBus = vertx.eventBus()

    val payload = message.body().getJsonObject("payload")

    val userId = payload.getString("userId")
    val x = payload.getInteger("x")
    val y = payload.getInteger("y")

    val event = UserClickedEvent(userId, x, y)
    events += event
    eventBus.send(GameVerticle.OUTGOING_ADDRESS, event.toJson)
  }

  override def stop(p: Promise[Unit]): Unit = {
    logger.info("stopped GameVerticle")
    p.success(())
  }
}
