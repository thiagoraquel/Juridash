package br.ufrn.juridash.service;

import br.ufrn.juridash.domain.model.JuridashProfile;
import br.ufrn.juridash.domain.repository.JuridashProfileRepository;
import br.ufrn.academix.framework.core.auth.BusinessIdentifierProvider;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class JuridashIdentifierProvider implements BusinessIdentifierProvider {

    private final JuridashProfileRepository repository;

    public JuridashIdentifierProvider(JuridashProfileRepository repository) {
        this.repository = repository;
    }

    @Override
    public String getIdentifierForAccount(UUID accountId) {
        return repository.findByAccountId(accountId)
                .map(JuridashProfile::getOabNumber)
                .orElseThrow(() -> new RuntimeException("Perfil jurídico não encontrado para esta conta."));
    }
}