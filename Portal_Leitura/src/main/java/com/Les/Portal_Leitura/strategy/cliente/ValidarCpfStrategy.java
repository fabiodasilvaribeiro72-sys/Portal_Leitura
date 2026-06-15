package com.Les.Portal_Leitura.strategy.cliente;

import com.Les.Portal_Leitura.domain.cliente.Cliente;

public class ValidarCpfStrategy implements Strategy<Cliente>{
    @Override
    public void executar(Cliente cliente) {

        if(cliente.getCpf() == null){
            throw new RuntimeException("CPF é obrigatório");
        }

        if(!isCpfValido(cliente.getCpf())){
            throw new RuntimeException("CPF inválido");
        }
    }

    private boolean isCpfValido(String cpf) {

        cpf = cpf.replaceAll("\\D", "");

        if (cpf.length() != 11) return false;

        if (cpf.matches("(\\d)\\1{10}")) return false;

        int soma = 0;
        int peso = 10;

        for (int i = 0; i < 9; i++) {
            soma += (cpf.charAt(i) - '0') * peso--;
        }

        int dig1 = 11 - (soma % 11);
        if (dig1 >= 10) dig1 = 0;

        soma = 0;
        peso = 11;

        for (int i = 0; i < 10; i++) {
            soma += (cpf.charAt(i) - '0') * peso--;
        }

        int dig2 = 11 - (soma % 11);
        if (dig2 >= 10) dig2 = 0;

        return dig1 == (cpf.charAt(9) - '0') &&
                dig2 == (cpf.charAt(10) - '0');
    }
}







