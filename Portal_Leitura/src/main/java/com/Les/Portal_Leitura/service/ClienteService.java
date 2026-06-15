package com.Les.Portal_Leitura.service;

import com.Les.Portal_Leitura.domain.cliente.Cliente;
import com.Les.Portal_Leitura.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;





@Service
public class ClienteService {

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private ClienteRepository clienteRepository;

    public Cliente cadastrarCliente(Cliente cliente) {

        cliente.setEmail(cliente.getEmail().trim());
        cliente.setSenha(encoder.encode(cliente.getSenha().trim()));
        cliente.setAtivo(true);
        cliente.setRanking(0);

        return clienteRepository.save(cliente);
    }
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente atualizar(Long id, Map<String, Object> dados) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        if (dados.get("nome") != null)
            cliente.setNome(dados.get("nome").toString());

        if (dados.get("email") != null)
            cliente.setEmail(dados.get("email").toString());

        if (dados.get("telefone") != null)
            cliente.setTelefone(dados.get("telefone").toString());

        return clienteRepository.save(cliente);
    }

    public void inativar(Long id) {
        Cliente cliente = clienteRepository.findById(id).orElseThrow();
        cliente.setAtivo(false);
        clienteRepository.save(cliente);
    }

    public List<Cliente> buscar(String nome, String email) {
        return clienteRepository.findAll().stream()
                .filter(c -> nome == null || c.getNome().contains(nome))
                .filter(c -> email == null || c.getEmail().contains(email))
                .toList();
    }

    public void alterarSenha(Long id, String senha) {
        Cliente cliente = clienteRepository.findById(id).orElseThrow();

        // 🔥 SEM BCrypt
        cliente.setSenha(senha);

        clienteRepository.save(cliente);
    }
}