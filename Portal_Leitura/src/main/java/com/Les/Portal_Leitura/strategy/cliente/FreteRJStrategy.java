package com.Les.Portal_Leitura.strategy.cliente;

import org.springframework.stereotype.Component;

@Component("RJ")
public class FreteRJStrategy implements FreteStrategy {

    @Override
    public double calcular(String cep){
        return 15.0;

    }

}
