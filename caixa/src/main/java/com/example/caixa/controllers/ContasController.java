package com.example.caixa.controllers;

import com.example.caixa.domain.contas.Contas;
import com.example.caixa.domain.contas.ContasRepository;
import com.example.caixa.domain.contas.RequestContasDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contas")
public class ContasController {

    @Autowired
    private ContasRepository repository;

    @GetMapping
    public ResponseEntity getContas(@RequestParam(defaultValue = "true") boolean ativo) {
        var contas = repository.findByAtivo(ativo);
        return ResponseEntity.ok(contas);
    }

    @PostMapping
    public ResponseEntity incluirConta(@RequestBody @Validated RequestContasDTO data){
        Contas NovaConta = new Contas(data);
        repository.save(NovaConta);

        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity alteraConta (@RequestBody @Validated RequestContasDTO data){
       Contas conta = repository.getReferenceById(data.id());
       conta.setNome(data.nome());
       conta.setTipo(data.tipo());

       repository.save(conta);

       return ResponseEntity.ok("conta");
    }

    @PutMapping("/alterar-status")
    public ResponseEntity excluirConta(@RequestBody @Validated RequestContasDTO data){
        Contas conta = repository.getReferenceById(data.id());
        conta.setAtivo(data.ativo());
        repository.save(conta);
        return ResponseEntity.ok("Conta desativada com sucesso");
    }
}
