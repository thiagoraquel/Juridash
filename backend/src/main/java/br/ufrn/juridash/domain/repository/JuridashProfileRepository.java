package br.ufrn.juridash.domain.repository;

import br.ufrn.juridash.domain.model.JuridashProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JuridashProfileRepository extends JpaRepository<JuridashProfile, UUID> {
    
    // Usado pelo motor de IA e operações internas
    Optional<JuridashProfile> findByAccountId(UUID accountId);

    // Usado para autenticação
    Optional<JuridashProfile> findByAccountEmail(String email);
}