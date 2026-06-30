package br.ufrn.juridash.domain.model;

import br.ufrn.academix.framework.core.auth.FrameworkAccount;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "juridash_profiles")
@Getter
@Setter
public class JuridashProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Conexão obrigatória com o motor base do framework
    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "account_id", unique = true)
    private FrameworkAccount account;

    // Campos específicos do domínio jurídico
    private String oabNumber; // Ex: OAB/RN 12345
    private String specialtyArea; // Ex: Trabalhista, Tributário, Cível
    
    // Aqui armazenaremos a extração de dados do escritório (processos ativos, taxas de ganho)
    @Column(name = "base_processos_texto", columnDefinition = "TEXT")
    private String baseProcessosTexto;
}