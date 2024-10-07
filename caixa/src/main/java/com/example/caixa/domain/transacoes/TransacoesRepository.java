package com.example.caixa.domain.transacoes;

import com.example.caixa.domain.contas.Contas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacoesRepository extends JpaRepository<Transacoes, Long> {
    List<Transacoes> findByContaOrigem(Long contaOrigem);
    List<Transacoes> findByContaDestino(Long contaDestino);
}

