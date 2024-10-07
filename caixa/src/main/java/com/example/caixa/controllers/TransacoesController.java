package com.example.caixa.controllers;

import com.example.caixa.domain.contas.Contas;
import com.example.caixa.domain.contas.ContasRepository;
import com.example.caixa.domain.transacoes.RequestTransacoesDTO;
import com.example.caixa.domain.transacoes.Transacoes;
import com.example.caixa.domain.transacoes.TransacoesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/transacoes")
public class TransacoesController {

    @Autowired
    private TransacoesRepository transacoesRepository;

    @Autowired
    private ContasRepository contasRepository;

    @GetMapping
    public ResponseEntity getTransacoes() {
        var transacoes = transacoesRepository.findAll();
        return ResponseEntity.ok(transacoes);
    }

    // Método para criar transações
    @PostMapping
    public ResponseEntity criarTransacao(@RequestBody RequestTransacoesDTO request) {
        System.out.println("Rescebendo chamada de transação");

        // Verificar conta de origem
        if (request.contaOrigem() != null) {
            System.out.println("tem conta de origem");

            // Encontrar a conta de origem
            var contaOrigem = contasRepository.findById(request.contaOrigem());
            if (contaOrigem.isEmpty()) {
                System.out.println("Conta de origem não encontrada");
                return ResponseEntity.badRequest().body("Conta de origem não encontrada.");
            }
            // Verificar se a conta de origem tem saldo suficiente
            if (contaOrigem.get().getSaldo().compareTo(request.valor()) < 0) {
                System.out.println("Saldo insuficiente na conta de origem.");
                return ResponseEntity.badRequest().body("Saldo insuficiente na conta de origem.");
            }
            // Subtrair o valor da conta de origem
            contaOrigem.get().setSaldo(contaOrigem.get().getSaldo().subtract(request.valor()));
            contasRepository.save(contaOrigem.get());
            System.out.println("Operação na conta de origem finalizada");
        }

        // Verificar conta de destino
        if (request.contaDestino() != null) {
            System.out.println("tem conta de destino");

            // Encontrar a conta de destino
            var contaDestino = contasRepository.findById(request.contaDestino());
            if (contaDestino.isEmpty()) {
                System.out.println("Conta de destino não encontrada");
                return ResponseEntity.badRequest().body("Conta de destino não encontrada.");
            }
            // Adicionar o valor à conta de destino
            contaDestino.get().setSaldo(contaDestino.get().getSaldo().add(request.valor()));
            contasRepository.save(contaDestino.get());
            System.out.println("Operação na conta de destino finalizada");
        }

        // Criar a transação
        Transacoes novaTransacao = new Transacoes();
        novaTransacao.setContaOrigem(request.contaOrigem());
        novaTransacao.setContaDestino(request.contaDestino());
        novaTransacao.setValor(request.valor());
        novaTransacao.setTipoTransacao(request.tipoTransacao());
        novaTransacao.setObservacao(request.observacao());
        novaTransacao.setDataTransacao(request.dataTransacao() != null ? request.dataTransacao() : LocalDateTime.now());

        transacoesRepository.save(novaTransacao);
        System.out.println("Transação criada com sucesso.");

        return ResponseEntity.ok("Transação criada com sucesso.");
    }

    @GetMapping("/extrato/{id}")
    public ResponseEntity getExtrato(@PathVariable Long id) {
        // Buscar conta pelo ID
        var contaOpt = contasRepository.findById(id);
        if (contaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Conta não encontrada.");
        }

        // Conta encontrada
        Contas conta = contaOpt.get();

        // Buscar transações onde a conta é origem ou destino
        List<Transacoes> transacoesOrigem = transacoesRepository.findByContaOrigem(id);
        List<Transacoes> transacoesDestino = transacoesRepository.findByContaDestino(id);

        // Combinar as duas listas e ordenar por data
        List<Transacoes> transacoesCombinadas = new ArrayList<>();
        transacoesCombinadas.addAll(transacoesOrigem);
        transacoesCombinadas.addAll(transacoesDestino);
        transacoesCombinadas.sort(Comparator.comparing(Transacoes::getDataTransacao));

        // Preparar a resposta
        Map<String, Object> resposta = new HashMap<>();
        resposta.put("conta", conta);  // Informações da conta
        resposta.put("transacoes", transacoesCombinadas);  // Transações combinadas e ordenadas

        return ResponseEntity.ok(resposta);
    }
}
