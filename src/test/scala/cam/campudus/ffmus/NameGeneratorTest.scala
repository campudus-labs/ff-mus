package cam.campudus.ffmus

import com.campudus.ffmus.NameGenerator
import org.junit.Assert._
import org.junit.Test

class NameGeneratorTest {

  @Test
  def generatesRandomNames(): Unit = {
    val nameGenerator = new NameGenerator()
    val name: String = nameGenerator.random()
    assertNotNull(name)
    assertTrue(!name.trim().isEmpty)
  }

}
