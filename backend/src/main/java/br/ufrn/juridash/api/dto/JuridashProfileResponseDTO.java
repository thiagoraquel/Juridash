package br.ufrn.juridash.api.dto;

import java.util.UUID;

public record JuridashProfileResponseDTO(
    UUID id,
    String oabNumber,
    String specialtyArea,
    AccountResponseDTO account
) {}