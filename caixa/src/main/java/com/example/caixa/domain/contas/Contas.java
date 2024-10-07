package com.example.caixa.domain.contas;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;

@Table(name = "contas")
@Entity(name = "contas")
@EqualsAndHashCode(of = "id")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Contas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private BigDecimal saldo;
    private String tipo;
    private boolean ativo;

    // Construtores
    public Contas(RequestContasDTO requestContasDTO) {
        this.nome = requestContasDTO.nome();
        this.tipo = requestContasDTO.tipo();
        this.ativo = true;

        if (requestContasDTO.saldo() != null){
            this.saldo = requestContasDTO.saldo();
        }
    }
}
