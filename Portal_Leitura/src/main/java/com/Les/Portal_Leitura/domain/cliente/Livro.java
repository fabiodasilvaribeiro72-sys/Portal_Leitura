package com.Les.Portal_Leitura.domain.cliente;

import jakarta.persistence.*;
import lombok.Getter; // Import do Lombok

@Entity
@Getter // <<
@Table(name = "livro")

public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String autor;
    private String categoria;
    private String titulo;
    private int ano;
    private String editora;
    private int edicao;
    private int paginas;
    @Column(length = 1000)
    private String sinopse;

    private String dimensoes;
    private Double preco;
    private String isbn;

    private Integer quantidadeEstoque;

    // ... restante da classe
}