package br.ufrn.juridash.api.dto;

import lombok.Builder;

@Builder
public record RegistroJuridashDTO(
    String nome,
    String email,
    String senha,
    String oabNumber,
    String specialtyArea
) {}