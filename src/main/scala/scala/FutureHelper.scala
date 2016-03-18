package io.vertx.scala

import io.vertx.core.{AsyncResult, Handler}
import io.vertx.scala.FunctionConverters._

import scala.concurrent.{Future, Promise}
import scala.util.{Failure, Success, Try}

object FutureHelper {

  def futurify[A](x: Promise[A] => _): Future[A] = {
    val p = Promise[A]()
    x(p)
    p.future
  }

  def asyncResultToFuture[T](fn: Handler[AsyncResult[T]] => _): Future[T] = futurify { p: Promise[T] =>
    val t = {
      case Success(result) => p.success(result)
      case Failure(ex) => p.failure(ex)
    }: Try[T] => Unit
    fn(t)
  }
}
