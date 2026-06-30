package br.ufrn.juridash.service;

import br.ufrn.academix.framework.core.ai.AiTaskTemplate;
import br.ufrn.academix.framework.core.ai.LlmClient;
import br.ufrn.academix.framework.core.history.MilestoneService;
import br.ufrn.juridash.domain.model.JuridashProfile;
import br.ufrn.juridash.domain.repository.JuridashProfileRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AnaliseRiscoJuridicoTask extends AiTaskTemplate {

    private final JuridashProfileRepository profileRepository;

    // O Spring se encarrega de injetar o LlmClient padrão do framework automaticamente
    public AnaliseRiscoJuridicoTask(
            LlmClient llmClient, 
            MilestoneService milestoneService, 
            JuridashProfileRepository profileRepository) {
        super(llmClient, milestoneService);
        this.profileRepository = profileRepository;
    }

    @Override
    protected String getSystemPersona() {
        return "Você é um Assistente Paralegal Sênior, especialista em análise de risco processual " +
               "e auditoria jurídica interna de escritórios de advocacia. Seu tom deve ser puramente " +
               "técnico, formal, analítico e focado em mitigar perdas financeiras ou contratuais.";
    }

    @Override
    protected String extractProfileData(UUID accountId) {
        // Resgata a listagem de processos ativos do escritório armazenada no banco
        return profileRepository.findByAccountId(accountId)
                .map(JuridashProfile::getBaseProcessosTexto)
                .orElse("Nenhuma base de processos ativos ou dados do PJe foram importados para esta conta.");
    }

    @Override
    protected boolean shouldIncludeMilestones() {
        // Inclui a linha do tempo de andamentos burocráticos ou marcos internos do escritório (ex: prazos críticos batidos, liminares deferidas)
        return true;
    }

    @Override
    protected String getEvaluationCriteria() {
        return "Sua tarefa é cruzar os dados internos do escritório (Dados da Entidade e Marcos) com as novas atualizações legislativas ou jurisprudências fornecidas no documento de referência:\n\n" +
               "1. Identifique imediatamente quais processos ativos correm risco de sofrer impacto negativo devido à nova jurisprudência/lei.\n" +
               "2. Avalie se o tempo médio de resolução ou as taxas de ganho do advogado podem ser afetadas pelas novas regras burocráticas.\n" +
               "3. Classifique o nível de risco geral detectado em: BAIXO, MÉDIO ou ALTO.\n" +
               "4. Proponha uma ação preventiva imediata (ex: emenda à inicial, pedido de suspensão processual ou priorização de acordo) para mitigar a perda.";
    }
}