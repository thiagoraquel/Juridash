'use client';

import { useState, useEffect } from 'react';

export default function AuditoriaIA() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(false);
  
  const [mensagem, setMensagem] = useState('');
  const [arquivoDocumento, setArquivoDocumento] = useState(null);
  
  const [historico, setHistorico] = useState([
    { 
      role: 'assistant', 
      content: 'Olá! Sou o Assistente Paralegal IA do JuriDash. Deseja realizar uma auditoria de risco rápida na sua carteira de processos ativos ou prefere me anexar o arquivo de uma nova lei ou jurisprudência para mapearmos os impactos burocráticos?' 
    }
  ]);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('usuarioLogado');
    if (dadosSalvos) {
      setUsuario(JSON.parse(dadosSalvos));
    }
  }, []);

  // Aciona o método de Auditoria Rápida (Template Method)
  const executarAuditoriaRapida = async () => {
    if (!usuario || !usuario.account?.id) return;
    
    setCarregando(true);
    const promptAuditoria = { 
      role: 'user', 
      content: 'Execute uma auditoria de risco automática na minha base de dados processuais. Identifique vulnerabilidades operacionais e classifique o nível de risco geral.' 
    };
    setHistorico(prev => [...prev, promptAuditoria]);

    try {
      const res = await fetch(`http://localhost:8080/api/ai/auditoria/rapida/${usuario.account.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: promptAuditoria.content }) 
      });
      
      const respostaTexto = await res.text();
      setHistorico(prev => [...prev, { role: 'assistant', content: respostaTexto }]);
    } catch (erro) {
      setHistorico(prev => [...prev, { role: 'assistant', content: "Falha na comunicação com o servidor de inteligência jurídica corporativa." }]);
    } finally {
      setCarregando(false);
    }
  };

  // Envia a mensagem padrão do chat ou processa o arquivo legal enviado (FormData)
  const enviarMensagemChat = async (e) => {
    e.preventDefault();
    if (!mensagem.trim() && !arquivoDocumento) return;

    setCarregando(true);
    
    const textoFormatado = arquivoDocumento 
      ? `[Documento Técnico Anexado: ${arquivoDocumento.name}] ${mensagem}` 
      : mensagem;

    const novaMensagemUsuario = { role: 'user', content: textoFormatado };
    setHistorico(prev => [...prev, novaMensagemUsuario]);
    
    const mensagemParaEnvio = mensagem;
    setMensagem('');

    try {
      const formData = new FormData();
      formData.append('mensagem', mensagemParaEnvio || "Analise o impacto do documento legal anexo frente à minha carteira.");
      if (arquivoDocumento) {
        formData.append('file', arquivoDocumento);
      }

      const res = await fetch(`http://localhost:8080/api/ai/conselho/${usuario.account.id}`, {
        method: 'POST',
        body: formData 
      });
      
      const respostaTexto = await res.text();
      setHistorico(prev => [...prev, { role: 'assistant', content: respostaTexto }]);
      setArquivoDocumento(null); 
    } catch (erro) {
      setHistorico(prev => [...prev, { role: 'assistant', content: "Erro crítico ao processar o parecer técnico do documento." }]);
    } finally {
      setCarregando(false);
    }
  };

  if (!usuario) {
    return <div style={{ color: '#000000', padding: '20px', fontWeight: 'bold' }}>Faça autenticação na OAB para acessar o assistente de auditoria.</div>;
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', height: '78vh', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      
      {/* ================= CABEÇALHO DO CHAT ================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0, fontWeight: 'extrabold', fontSize: '22px' }}>
          ⚖️ Auditoria Avançada & Compliance (IA)
        </h2>
        
        <button 
          onClick={executarAuditoriaRapida} 
          disabled={carregando}
          style={{
            padding: '10px 20px', 
            backgroundColor: carregando ? '#cbd5e1' : '#dfb15b', 
            color: '#1e2229',
            border: 'none', 
            borderRadius: '4px', 
            cursor: carregando ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(223, 177, 91, 0.2)'
          }}
        >
          ✨ Parecer de Risco Rápido
        </button>
      </div>

      {/* ================= CORPO DO HISTÓRICO DE DIÁLOGO ================= */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '6px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #f1f5f9' }}>
        {historico.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? '#2c3e50' : '#fff',
            color: msg.role === 'user' ? '#ffffff' : '#000000',
            padding: '15px 20px', 
            borderRadius: '8px', 
            maxWidth: '75%',
            boxShadow: '0 2px 5px rgba(0,0,0,0.04)', 
            whiteSpace: 'pre-wrap', 
            lineHeight: '1.6',
            fontWeight: msg.role === 'user' ? '500' : '600',
            border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0'
          }}>
            {msg.content}
          </div>
        ))}
        {carregando && (
          <div style={{ alignSelf: 'flex-start', color: '#1e2229', fontStyle: 'italic', fontWeight: 'bold' }}>
            O Assistente Paralegal está compilando a ementa e avaliando os riscos processuais...
          </div>
        )}
      </div>

      {/* ================= FORMULÁRIO DE ENVIO E DA LEI JURÍDICA ================= */}
      <form onSubmit={enviarMensagemChat} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        
        <label style={{ 
          cursor: 'pointer', 
          padding: '12px 18px', 
          backgroundColor: arquivoDocumento ? '#fef3c7' : '#f1f5f9', 
          borderRadius: '4px', 
          border: '1px solid #cbd5e1', 
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '14px',
          transition: 'background 0.2s'
        }}>
          📄 {arquivoDocumento ? `Jurisprudência: ${arquivoDocumento.name.substring(0, 15)}...` : 'Anexar Nova Lei / PDF'}
          <input 
            type="file" 
            accept=".pdf,.txt,.xml" 
            style={{ display: 'none' }} 
            onChange={(e) => setArquivoDocumento(e.target.files[0])} 
          />
        </label>

        <input 
          type="text" 
          value={mensagem} 
          onChange={(e) => setMensagem(e.target.value)} 
          placeholder="Consulte impacto de novos dispositivos legais ou digite sua dúvida jurídica..." 
          style={{ 
            flex: 1, 
            padding: '14px', 
            border: '1px solid #cbd5e1', 
            borderRadius: '4px', 
            outline: 'none', 
            color: '#000000', 
            backgroundColor: '#fff',
            fontWeight: '600',
            fontSize: '14px'
          }}
        />
        
        <button 
          type="submit" 
          disabled={carregando || (!mensagem.trim() && !arquivoDocumento)}
          style={{ 
            padding: '14px 28px', 
            backgroundColor: '#2c3e50', 
            color: '#dfb15b', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '15px'
          }}
        >
          Analisar
        </button>
      </form>

    </div>
  );
}