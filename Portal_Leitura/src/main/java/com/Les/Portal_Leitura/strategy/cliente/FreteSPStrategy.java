package com.Les.Portal_Leitura.strategy.cliente;


import org.springframework.stereotype.Component;

@Component("SP")

public class FreteSPStrategy implements FreteStrategy {

    @Override
    public double calcular(String cep){
        return 10.0;

    }
}
