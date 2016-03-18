package com.campudus.ffmus

import io.vertx.core.json.JsonObject

sealed abstract class Event(eventType: String) {
  private def wrapperJson: JsonObject = {
    new JsonObject(
      s"""
         | {
         |   "type" : "$eventType"
         | }
       """.stripMargin)
  }

  protected def payloadJson: JsonObject

  final def toJson: JsonObject = {
    wrapperJson.put("payload", payloadJson)
  }
}

object EventTypes {
  val USER_JOIN = "USER_JOIN"
  val LOGIN = "LOGIN"
  val LOGIN_REPLY = "LOGIN_REPLY"
}

case class UserJoinEvent(id: String, name: String, color: String) extends Event(EventTypes.USER_JOIN) {
  override protected def payloadJson: JsonObject = {
    new JsonObject(
      s"""
         |{
         |  "id" : "$id",
         |  "name" : "$name",
         |  "color" : "$color"
         |}
       """.stripMargin)
  }
}