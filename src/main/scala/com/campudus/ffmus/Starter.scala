import com.campudus.ffmus.HttpVerticle
import io.vertx.scala.ScalaVerticle

import scala.concurrent.Promise
import scala.util.{Try, Failure, Success}

import io.vertx.scala.FunctionConverters._

class Starter extends ScalaVerticle {

  override final def start(p: Promise[Unit]): Unit = {

    vertx.deployVerticle(classOf[HttpVerticle].getName, {
      case Success(deploymentId) => p.success(deploymentId)
      case Failure(x) => p.failure(x)
    }: Try[String] => Unit)
  }

  override final def stop(p: Promise[Unit]) = {
    logger.info("Starter stopped")
    p.success(())
  }

}