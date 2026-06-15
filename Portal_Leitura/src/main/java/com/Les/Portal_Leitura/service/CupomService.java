package com.Les.Portal_Leitura.service;

import com.Les.Portal_Leitura.strategy.cliente.CupomStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CupomService {

    @Autowired
    private Map<String, CupomStrategy> strategies;

    public double aplicar(String codigo, double valor) {

        if (codigo == null || codigo.isBlank()) {
            return valor;
        }

        CupomStrategy strategy = strategies.get(codigo);

        if (strategy == null) {
            return valor;
        }

        return strategy.aplicarDesconto(valor);
    }
}