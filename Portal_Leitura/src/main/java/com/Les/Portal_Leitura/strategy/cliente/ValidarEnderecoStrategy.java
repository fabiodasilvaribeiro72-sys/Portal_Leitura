package com.Les.Portal_Leitura.strategy.cliente;


import com.Les.Portal_Leitura.domain.cliente.Cliente;
import com.Les.Portal_Leitura.domain.cliente.Endereco;
import org.springframework.stereotype.Component;

@Component
public class ValidarEnderecoStrategy implements Strategy<Cliente> {

    @Override
    public void executar(Cliente cliente) {

        if (cliente.getEnderecosEntrega() == null || cliente.getEnderecosEntrega().isEmpty()) {
            throw new RuntimeException("Cliente precisa de endereço de entrega");
        }

        if (cliente.getEnderecosCobranca() == null || cliente.getEnderecosCobranca().isEmpty()) {
            throw new RuntimeException("Cliente precisa de endereço de cobrança");
        }


        for (Endereco endereco : cliente.getEnderecosEntrega()) {
            validarEndereco(endereco);
        }


        for (Endereco endereco : cliente.getEnderecosCobranca()) {
            validarEndereco(endereco);
        }

    }
        private void validarEndereco (Endereco endereco){

            // 🔹 Logradouro
            if (endereco.getLogradouro() == null || endereco.getLogradouro().isBlank()) {
                throw new RuntimeException("Logradouro é obrigatório");
            }

            // 🔹 Número
            if (endereco.getNumero() == null || endereco.getNumero().isBlank()) {
                throw new RuntimeException("Número é obrigatório");
            }

            // 🔹 Cidade
            if (endereco.getCidade() == null || endereco.getCidade().isBlank()) {
                throw new RuntimeException("Cidade é obrigatória");
            }

            // 🔹 Bairro
            if (endereco.getBairro() == null || endereco.getBairro().isBlank()) {
                throw new RuntimeException("Bairro é obrigatório");
            }

            // 🔹 CEP (remove tudo que não for número)
            String cep = endereco.getCep() != null ? endereco.getCep().replaceAll("\\D", "") : "";

            if (!cep.matches("\\d{8}")) {
                throw new RuntimeException("CEP inválido. Deve conter exatamente 8 números.");
            }

            // 🔹 Estado (UF)
            String estado = endereco.getEstado();

            if (estado == null || !estado.matches("AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO")) {
                throw new RuntimeException("Estado inválido.");
            }
        }

    }


