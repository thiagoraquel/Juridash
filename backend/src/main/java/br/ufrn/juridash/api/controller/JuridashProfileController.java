package br.ufrn.juridash.api.controller;

import br.ufrn.juridash.api.dto.*;
import br.ufrn.juridash.domain.model.JuridashProfile;
import br.ufrn.juridash.service.JuridashProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000")
public class JuridashProfileController {

    private final JuridashProfileService profileService;

    public JuridashProfileController(JuridashProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping("/registro")
    public ResponseEntity<JuridashProfileResponseDTO> registrar(@RequestBody RegistroJuridashDTO dto) {
        JuridashProfile profile = profileService.registrar(dto);
        return ResponseEntity.ok(mapearParaDTO(profile));
    }

    @PostMapping("/login")
    public ResponseEntity<JuridashProfileResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        return profileService.autenticar(dto.email(), dto.senha())
                .map(profile -> ResponseEntity.ok(mapearParaDTO(profile)))
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/{id}/upload-processos")
    public ResponseEntity<String> uploadProcessos(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        try {
            profileService.salvarBaseProcessos(id, file);
            return ResponseEntity.ok("Base de processos internos atualizada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao processar arquivo judicial: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/grafico")
    public ResponseEntity<List<ProcessoGraficoDTO>> obterDadosGrafico(@PathVariable UUID id) {
        List<ProcessoGraficoDTO> dados = profileService.obterDadosParaGrafico(id);
        if (dados.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(dados);
    }

    private JuridashProfileResponseDTO mapearParaDTO(JuridashProfile profile) {
        AccountResponseDTO accountDTO = new AccountResponseDTO(
                profile.getAccount().getId(),
                profile.getAccount().getName(),
                profile.getAccount().getEmail()
        );
        return new JuridashProfileResponseDTO(
                profile.getId(),
                profile.getOabNumber(),
                profile.getSpecialtyArea(),
                accountDTO
        );
    }
}