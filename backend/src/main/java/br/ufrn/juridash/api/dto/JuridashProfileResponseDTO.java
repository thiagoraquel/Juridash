package br.ufrn.juridash.api.dto;

import java.util.UUID;

public record JuridashProfileResponseDTO(
    UUID id,
    String oabNumber,
    String specialtyArea,
    AccountResponseDTO account
) {}

// Apenas para alinhar com o core (pode reaproveitar o mesmo record se já existir no pacote de DTOs comuns)
record AccountResponseDTO(UUID id, String name, String email) {}