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
    val name = generateName()
    val color = generateColor()

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

  def generateColor(): String = {
    import scala.util.Random.{nextFloat, nextInt}
    val hue = nextFloat()
    // Saturation between 0.1 and 0.3
    val saturation = (nextInt(2000) + 1000) / 10000f
    val luminance = 0.9f
    val color = Color.getHSBColor(hue, saturation, luminance)
    "#%02X%02X%02X".format(color.getRed, color.getGreen, color.getBlue)
  }

  def generateName(): String = {
    import scala.util.Random.nextInt
    val adjs = List("autumn", "hidden", "bitter", "misty", "silent",
      "reckless", "daunting", "short", "rising", "strong", "timber", "tumbling",
      "silver", "dusty", "celestial", "cosmic", "crescent", "double", "far",
      "terrestrial", "huge", "deep", "epic", "titanic", "mighty", "powerful")

    val nouns = List("waterfall", "river", "breeze", "moon", "rain",
      "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf",
      "sequoia", "cedar", "wrath", "blessing", "spirit", "nova", "storm", "burst",
      "giant", "elemental", "throne", "game", "weed", "stone", "apogee", "bang")

    def getRandElt[A](xs: List[A]): A = xs.apply(nextInt(xs.size))

    val xs = List(adjs, nouns).map(getRandElt)
    xs.mkString("-")
  }


  override def stop(p: Promise[Unit]): Unit = {
    logger.info("stopped GameVerticle")
    p.success(())
  }
}
