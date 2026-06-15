package com.Les.Portal_Leitura;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import java.time.Duration;

public class SeleniumTest {

    private WebDriver driver;

    @BeforeEach
    void setup() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    }

    @Test
    void deveRealizarCompraCompleta() throws InterruptedException {

        // 🔥 1. Acessa página inicial
        driver.get("http://localhost:8080/index.html");

        // 🔥 2. Clica em comprar (primeiro livro)
        driver.findElement(By.className("buy-button")).click();

        // 🔥 3. Abre carrinho (clicando no ícone)
        driver.findElement(By.className("cart")).click();

        // 🔥 4. Finaliza compra
        driver.findElement(By.id("btnFinalizar")).click();

        // 🔥 espera backend responder
        Thread.sleep(3000);

        // 🔥 5. Valida resultado
        WebElement status = driver.findElement(By.id("statusPedido"));
        String texto = status.getText();

        System.out.println("STATUS: " + texto);

        Assertions.assertTrue(
                texto.toLowerCase().contains("sucesso") ||
                        texto.toLowerCase().contains("finalizado")
        );
    }

    @AfterEach
    void tearDown() {
        driver.quit();
    }
}


