package cam.campudus.ffmus

import com.campudus.ffmus.ColorGenerator
import org.junit.Test
import org.junit.Assert._

class ColorGeneratorTest {

  @Test
  def generatesRandomColor(): Unit = {
    val colorGenerator = new ColorGenerator()
    val color: String = colorGenerator.random()
    assertNotNull(color)
    assertTrue(color.startsWith("#"))
    assertTrue(color.matches("^#[0-9A-F]{6}$"))
  }

}
