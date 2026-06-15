package com.Les.Portal_Leitura.repository;

import com.Les.Portal_Leitura.domain.cliente.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {
}
