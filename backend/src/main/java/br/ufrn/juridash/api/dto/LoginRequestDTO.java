package br.ufrn.juridash.api.dto;

public record LoginRequestDTO(
    String email,
    String senha
) {}