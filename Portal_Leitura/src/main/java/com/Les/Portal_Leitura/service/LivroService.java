package com.Les.Portal_Leitura.service;

import com.Les.Portal_Leitura.domain.cliente.Livro;
import com.Les.Portal_Leitura.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    public Livro salvar(Livro livro){
        return livroRepository.save(livro);
    }

    public List<Livro> listar(){
        return livroRepository.findAll();

    }
}
