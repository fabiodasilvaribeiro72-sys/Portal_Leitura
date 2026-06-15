package com.Les.Portal_Leitura.service;


import com.Les.Portal_Leitura.domain.cliente.Cupom;
import org.springframework.stereotype.Service;

@Service
public class Troca {

    public boolean podeTrocar(Cupom cupom) {

        if (cupom == null) return false;

        return cupom.isPermiteTroca();
    }

}
