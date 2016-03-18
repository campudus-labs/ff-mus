package com.campudus.ffmus

import io.vertx.core.DeploymentOptions
import io.vertx.scala.ScalaVerticle

import scala.concurrent.Promise
import scala.util.{Try, Failure, Success}

import io.vertx.scala.FunctionConverters._

class Starter extends ScalaVerticle {

  override final def start(p: Promise[Unit]): Unit = {
    logger.info(s"test: $vertx")

    vertx.deployVerticle(new HttpVerticle, new DeploymentOptions(), {
      case Success(deploymentId) => p.success()
      case Failure(x) => p.failure(x)
    }: Try[String] => Unit)

    logger.info("test2")
  }

  override final def stop(p: Promise[Unit]) = {
    logger.info("Starter stopped")
    p.success(())
  }

}