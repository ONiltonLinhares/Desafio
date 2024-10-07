package com.example.caixa.domain.transacoes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RequestTransacoesDTO(
        Long id,
        Long contaOrigem,
        Long contaDestino,
        BigDecimal valor,
        String tipoTransacao,
        String observacao,
        LocalDateTime dataTransacao
) { }
