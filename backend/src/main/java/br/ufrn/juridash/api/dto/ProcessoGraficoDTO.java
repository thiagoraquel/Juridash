package br.ufrn.juridash.api.dto;

import lombok.Builder;

@Builder
public record ProcessoGraficoDTO(
    String statusOuRisco,
    Double quantidade
) {}