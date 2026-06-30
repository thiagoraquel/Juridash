package br.ufrn.juridash.service;

import br.ufrn.academix.framework.core.auth.FrameworkAccount;
import br.ufrn.academix.framework.core.auth.FrameworkAccountRepository;
import br.ufrn.academix.framework.core.files.DocumentProcessor;
import br.ufrn.juridash.api.dto.ProcessoGraficoDTO;
import br.ufrn.juridash.api.dto.RegistroJuridashDTO;
import br.ufrn.juridash.domain.model.JuridashProfile;
import br.ufrn.juridash.domain.repository.JuridashProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JuridashProfileService {

    private final JuridashProfileRepository profileRepository;
    private final FrameworkAccountRepository accountRepository;
    private final DocumentProcessor documentProcessor;

    public JuridashProfileService(JuridashProfileRepository profileRepository, 
                                  FrameworkAccountRepository accountRepository, 
                                  DocumentProcessor documentProcessor) {
        this.profileRepository = profileRepository;
        this.accountRepository = accountRepository;
        this.documentProcessor = documentProcessor;
    }

    public JuridashProfile registrar(RegistroJuridashDTO dto) {
        if (accountRepository.findAll().stream().anyMatch(a -> a.getEmail().equals(dto.email()))) {
            throw new RuntimeException("E-mail já cadastrado no sistema!");
        }

        // 1. Cria a conta no ponto fixo do Framework
        FrameworkAccount account = new FrameworkAccount();
        account.setName(dto.nome());
        account.setEmail(dto.email());
        account.setPassword(dto.senha());

        // 2. Cria o perfil na aplicação Juridash
        JuridashProfile profile = new JuridashProfile();
        profile.setAccount(account);
        profile.setOabNumber(dto.oabNumber());
        profile.setSpecialtyArea(dto.specialtyArea());

        return profileRepository.save(profile);
    }

    public Optional<JuridashProfile> autenticar(String email, String senha) {
        return profileRepository.findByAccountEmail(email)
                .filter(p -> p.getAccount().getPassword().equals(senha));
    }

    // Salva o texto extraído da lista de processos usando o DocumentProcessor do core
    public void salvarBaseProcessos(UUID profileId, MultipartFile arquivo) {
        JuridashProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Perfil jurídico não encontrado."));

        // O Core vai descobrir a extensão do arquivo e tratá-lo
        String conteudoExtraido = documentProcessor.processFile(arquivo);
        
        profile.setBaseProcessosTexto(conteudoExtraido);
        profileRepository.save(profile);
    }

    // Lê os processos salvos e conta quantos existem por Status/Classe para gerar o gráfico
    public List<ProcessoGraficoDTO> obterDadosParaGrafico(UUID profileId) {
        JuridashProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Perfil jurídico não encontrado."));

        String textoBanco = profile.getBaseProcessosTexto();
        if (textoBanco == null || textoBanco.isBlank()) {
            return List.of();
        }

        Map<String, Double> contagemPorStatus = new HashMap<>();
        String[] linhas = textoBanco.split("\n");

        // Assume um formato simples de arquivo CSV extraído: Processo,Status,Risco
        // Ignora a linha 0 se for cabeçalho
        for (int i = 1; i < linhas.length; i++) {
            String linha = linhas[i];
            if (linha.isBlank()) continue;

            String[] colunas = linha.split(",");
            if (colunas.length >= 2) {
                String status = colunas[1].trim(); // Pega a coluna do Status do processo
                contagemPorStatus.put(status, contagemPorStatus.getOrDefault(status, 0.0) + 1.0);
            }
        }

        return contagemPorStatus.entrySet().stream()
                .map(entry -> ProcessoGraficoDTO.builder()
                        .statusOuRisco(entry.getKey())
                        .quantidade(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }
}