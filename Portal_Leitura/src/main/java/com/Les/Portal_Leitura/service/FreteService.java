package com.Les.Portal_Leitura.service;


import com.Les.Portal_Leitura.strategy.cliente.FreteStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class FreteService {
    private final Map<String, FreteStrategy> strategies;

    public double calcularFrete(String cep) {

        if (cep == null || cep.length() < 2) {
            throw new RuntimeException("CEP inválido");
        }

        // 🔥 extrai estado baseado no CEP
        String estado;

        if (cep.startsWith("01") || cep.startsWith("02")) {
            estado = "SP";
        } else if (cep.startsWith("20")) {
            estado = "RJ";
        } else {
            estado = "DEFAULT";
        }

        FreteStrategy strategy = strategies.get(estado);

        if (strategy == null) {
            throw new RuntimeException("Strategy não encontrada: " + estado);
        }

        return strategy.calcular(cep);
    }
}
