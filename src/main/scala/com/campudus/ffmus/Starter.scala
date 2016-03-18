package com.campudus.ffmus

import io.vertx.core.DeploymentOptions
import io.vertx.scala.ScalaVerticle

import scala.concurrent.{Future, Promise}
import scala.util.{Try, Failure, Success}

import io.vertx.scala.FunctionConverters._

class Starter extends ScalaVerticle {

  override final def start(p: Promise[Unit]): Unit = {
    val p1 = Promise[Unit]()
    val p2 = Promise[Unit]()

    vertx.deployVerticle(new HttpVerticle, new DeploymentOptions(), {
      case Success(deploymentId) => p1.success()
      case Failure(x) => p1.failure(x)
    }: Try[String] => Unit)

    vertx.deployVerticle(new GameVerticle, new DeploymentOptions(), {
      case Success(deploymentId) => p2.success()
      case Failure(x) => p2.failure(x)
    }: Try[String] => Unit)

    Future.sequence(List(p1.future, p2.future)).map { x =>
      p.success()
    }
  }

  override final def stop(p: Promise[Unit]) = {
    logger.info("Starter stopped")
    p.success(())
  }

}