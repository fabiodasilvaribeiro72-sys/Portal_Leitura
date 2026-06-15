package com.Les.Portal_Leitura.strategy.cliente;


import org.springframework.stereotype.Component;

@Component("DEFAULT")
public class FreteDefaultStrategy implements FreteStrategy {
    @Override
    public double calcular(String cep) {
        return 20.0;
    }
}
