'use client';

import { useState, useEffect } from 'react';

export default function ProcessoManager() {
  const [usuario, setUsuario] = useState(null);
  const [arquivo, setArquivo] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('usuarioLogado');
    if (dadosSalvos) {
      setUsuario(JSON.parse(dadosSalvos));
    }
  }, []);

  const lidarComMudancaDeArquivo = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
      setMensagem({ tipo: '', texto: '' });
    }
  };

  const executarUpload = async (e) => {
    e.preventDefault();
    if (!arquivo) {
      setMensagem({ tipo: 'erro', texto: 'Por favor, selecione um arquivo judicial (PDF ou planilha) para enviar.' });
      return;
    }

    if (!usuario || !usuario.id) {
      setMensagem({ tipo: 'erro', texto: 'Sessão do advogado não identificada. Faça login novamente.' });
      return;
    }

    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    const formData = new FormData();
    formData.append('file', arquivo);

    try {
      const resposta = await fetch(`http://localhost:8080/api/profiles/${usuario.id}/upload-processos`, {
        method: 'POST',
        body: formData, // O Fetch API configura o Content-Type como multipart/form-data automaticamente aqui
      });

      if (resposta.ok) {
        const textoSucesso = await resposta.text();
        setMensagem({ tipo: 'sucesso', texto: textoSucesso || 'Base de processos atualizada e auditada com sucesso!' });
        setArquivo(null);
        // Limpa o input file visualmente
        e.target.reset();
      } else {
        const textoErro = await resposta.text();
        setMensagem({ tipo: 'erro', texto: textoErro || 'Falha ao processar o arquivo no servidor.' });
      }
    } catch (erro) {
      console.error('Erro no upload:', erro);
      setMensagem({ tipo: 'erro', texto: 'Serviço de auditoria indisponível no momento. Tente mais tarde.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ color: '#000000' }}>
      {/* ================= CABEÇALHO DA PÁGINA ================= */}
      <h1 style={{ fontSize: '28px', fontWeight: 'extrabold', color: '#000000', marginBottom: '5px' }}>
        Painel de Gestão Processual
      </h1>
      <p style={{ color: '#1f2937', marginBottom: '30px', fontWeight: '500' }}>
        Sincronize arquivos extraídos de tribunais (PJe, Projudi, e-SAJ) para alimentar a base de dados do escritório.
      </p>

      {/* ================= GRID DE DETALHES DA BANCA ================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        
        {/* CARD CENTRAL DE REQUISITOS / UPLOAD */}
        <div style={{ padding: '30px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50', fontSize: '20px', fontWeight: 'bold' }}>
            Atualizar Acervo de Processos
          </h3>
          
          <form onSubmit={executarUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ 
              border: '2px dashed #cbd5e1', 
              padding: '30px', 
              borderRadius: '6px', 
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              cursor: 'pointer'
            }}>
              <input 
                type="file" 
                accept=".pdf,.csv,.xlsx"
                onChange={lidarComMudancaDeArquivo}
                style={{ display: 'block', margin: '0 auto', color: '#000000', fontWeight: '500' }}
              />
              <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
                Formatos aceitos: Extrato de Julgamento em PDF ou Planilha de Volumetria.
              </p>
            </div>

            {arquivo && (
              <div style={{ fontSize: '14px', color: '#2c3e50', fontWeight: 'bold', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '4px' }}>
                📎 Arquivo selecionado: {arquivo.name} ({(arquivo.size / 1024).toFixed(1)} KB)
              </div>
            )}

            <button 
              type="submit" 
              disabled={carregando}
              style={{ 
                padding: '12px 20px', 
                background: carregando ? '#94a3b8' : '#2c3e50', 
                color: '#dfb15b', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: carregando ? 'not-allowed' : 'pointer', 
                fontWeight: 'bold', 
                fontSize: '16px',
                transition: 'background 0.2s',
                textAlign: 'center'
              }}
            >
              {carregando ? 'Processando e Extraindo Dados...' : 'Enviar para Auditoria Legal'}
            </button>
          </form>

          {/* MENSAGENS DE FEEDBACK */}
          {mensagem.texto && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              borderRadius: '4px', 
              fontWeight: 'bold',
              fontSize: '14px',
              border: '1px solid',
              backgroundColor: mensagem.tipo === 'sucesso' ? '#ecfdf5' : '#fef2f2',
              borderColor: mensagem.tipo === 'sucesso' ? '#10b981' : '#ef4444',
              color: mensagem.tipo === 'sucesso' ? '#065f46' : '#991b1b'
            }}>
              {mensagem.tipo === 'sucesso' ? '✅ ' : '❌ '} {mensagem.texto}
            </div>
          )}
        </div>

        {/* CARD LATERAL COM CREDENCIAIS DA BANCA */}
        <div style={{ padding: '25px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', height: 'fit-content' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#000000', fontWeight: 'extrabold', fontSize: '18px', borderBottom: '2px solid #f3f4f6', paddingBottom: '10px' }}>
            Titular Responsável
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4b5563', fontWeight: 'bold', display: 'block' }}>Nome / Razão Social</span>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold' }}>{usuario?.account?.name || "Carregando..."}</span>
            </div>

            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4b5563', fontWeight: 'bold', display: 'block' }}>Inscrição</span>
              <span style={{ fontSize: '16px', color: '#000000', fontWeight: 'bold' }}>OAB {usuario?.oabNumber || "Não informada"}</span>
            </div>

            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4b5563', fontWeight: 'bold', display: 'block' }}>E-mail de Contato</span>
              <span style={{ fontSize: '15px', color: '#000000', fontWeight: '600' }}>{usuario?.account?.email || "Carregando..."}</span>
            </div>

            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4b5563', fontWeight: 'bold', display: 'block' }}>Status do Sistema</span>
              <span style={{ 
                fontSize: '12px', 
                color: '#065f46', 
                backgroundColor: '#d1fae5', 
                padding: '3px 8px', 
                borderRadius: '12px', 
                fontWeight: 'bold',
                display: 'inline-block',
                marginTop: '4px'
              }}>
                ● Conectado ao Core Framework
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}