package com.Les.Portal_Leitura;


import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.springframework.boot.webmvc.test.autoconfigure.WebDriverScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeleniumConfig {

    @Bean
    public WebDriver webDriver(){
        WebDriverManager.chromedriver().setup();
        return new ChromeDriver();


    }

}
