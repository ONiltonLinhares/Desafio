package com.example.caixa.domain.transacoes;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table(name = "transacoes")
@Entity(name = "transacoes")
@EqualsAndHashCode(of = "id")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Transacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long contaOrigem;
    private Long contaDestino;
    private BigDecimal valor;
    private String tipoTransacao;
    private String observacao;
    private LocalDateTime dataTransacao;

}
