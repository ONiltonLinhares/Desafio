package com.example.caixa.domain.contas;

import java.math.BigDecimal;
import java.util.Optional;

public record RequestContasDTO(
        long id,
        String nome,
        BigDecimal saldo,
        String tipo,
        boolean ativo
) { }
