package com.campudus.ffmus

import java.awt.Color

class ColorGenerator {

  def random(): String = {
    import scala.util.Random.{nextFloat, nextInt}
    val hue = nextFloat()
    // Saturation between 0.1 and 0.3
    val saturation = (nextInt(2000) + 1000) / 10000f
    val luminance = 0.9f
    val color = Color.getHSBColor(hue, saturation, luminance)
    "#%02X%02X%02X".format(color.getRed, color.getGreen, color.getBlue)
  }

}
