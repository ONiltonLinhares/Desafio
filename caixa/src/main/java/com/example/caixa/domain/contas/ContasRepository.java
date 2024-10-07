package com.example.caixa.domain.contas;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContasRepository extends JpaRepository<Contas, Long> {
    List<Contas> findByAtivo(boolean ativo);
}
