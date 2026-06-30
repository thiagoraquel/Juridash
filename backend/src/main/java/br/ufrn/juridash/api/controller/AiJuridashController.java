package br.ufrn.juridash.api.controller;

import br.ufrn.juridash.service.AnaliseRiscoJuridicoTask;
import br.ufrn.academix.framework.core.files.DocumentProcessor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AiJuridashController {

    private final AnaliseRiscoJuridicoTask analiseTask;
    private final DocumentProcessor documentProcessor;

    public AiJuridashController(AnaliseRiscoJuridicoTask analiseTask, DocumentProcessor documentProcessor) {
        this.analiseTask = analiseTask;
        this.documentProcessor = documentProcessor;
    }

    // Botão de Auditoria/Análise Rápida de Impacto
    @PostMapping("/auditoria/rapida/{accountId}")
    public ResponseEntity<String> auditoriaRapida(
            @PathVariable UUID accountId,
            @RequestBody Map<String, String> payload) {
        try {
            String mensagem = payload.get("mensagem");
            String parecerIA = analiseTask.executeTask(accountId, null, mensagem);
            return ResponseEntity.ok(parecerIA);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro no assistente paralegal: " + e.getMessage());
        }
    }

    // Chat interativo para subir novos textos de leis ou ementas de tribunais
    @PostMapping("/conselho/{accountId}")
    public ResponseEntity<String> analisarDocumentoLegal(
            @PathVariable UUID accountId,
            @RequestParam("mensagem") String mensagem,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            String ementaOuLeiTexto = "";
            if (file != null && !file.isEmpty()) {
                ementaOuLeiTexto = documentProcessor.processFile(file);
            }
            
            String parecerIA = analiseTask.executeTask(accountId, ementaOuLeiTexto, mensagem);
            return ResponseEntity.ok(parecerIA);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao auditar documento legal: " + e.getMessage());
        }
    }
}