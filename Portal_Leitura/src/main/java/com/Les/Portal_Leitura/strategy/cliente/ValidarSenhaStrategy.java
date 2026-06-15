package com.Les.Portal_Leitura.strategy.cliente;


import com.Les.Portal_Leitura.domain.cliente.Cliente;
import org.springframework.stereotype.Component;

@Component
public class ValidarSenhaStrategy implements Strategy<Cliente>  {

    @Override
    public void executar(Cliente cliente){

        String senha = cliente.getSenha();

        if(senha == null || senha.length() < 8){
            throw new RuntimeException("Senha deve ter pelo menos 8 caracteres");
        }

        if(!senha.matches(".*[A-Z].*")){
            throw new RuntimeException("Senha precisa ter letra maiúscula");
        }

        if(!senha.matches(".*[a-z].*")){
            throw new RuntimeException("Senha precisa ter letra minúscula");
        }
    }
}



