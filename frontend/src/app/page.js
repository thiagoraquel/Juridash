'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import ProcessoManager from './components/ProcessoManager';
import DashboardProcessos from './components/DashboardProcessos';
import AuditoriaIA from './components/AuditoriaIA';

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState('processos');

  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'processos':
        return <ProcessoManager />;
      case 'graficos':
        return <DashboardProcessos />;
      case 'ia':
        return <AuditoriaIA />;
      default:
        return <ProcessoManager />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* ================= BARRA LATERAL JURÍDICA (SIDEBAR) ================= */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: '#1e2229', 
        color: '#fff', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '2px 0 5px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          padding: '25px 20px', 
          fontSize: '20px', 
          fontWeight: 'bold', 
          borderBottom: '1px solid #2d323e', 
          textAlign: 'center',
          color: '#dfb15b', // Tom Ouro/Dourado Jurídico
          letterSpacing: '1px'
        }}>
          ⚖️ JuriDash
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
          
          <button 
            onClick={() => setAbaAtiva('processos')}
            style={estiloBotaoSidebar(abaAtiva === 'processos')}
          >
            📂 Meus Processos (PJe)
          </button>
          
          <button 
            onClick={() => setAbaAtiva('graficos')}
            style={estiloBotaoSidebar(abaAtiva === 'graficos')}
          >
            📊 Volumetria & Riscos
          </button>
          
          <button 
            onClick={() => setAbaAtiva('ia')}
            style={estiloBotaoSidebar(abaAtiva === 'ia')}
          >
            🤖 Assistente Paralegal IA
          </button>

        </nav>
      </aside>

      {/* ================= ÁREA DE CONTEÚDO PRINCIPAL ================= */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <Navbar /> 
        
        <div style={{ padding: '35px', overflowY: 'auto' }}>
          {renderizarConteudo()}
        </div>
        
      </main>
    </div>
  );
}

const estiloBotaoSidebar = (ativo) => ({
  padding: '16px 25px',
  backgroundColor: ativo ? '#2c3e50' : 'transparent', // Azul-marinho corporativo discreto
  color: ativo ? '#dfb15b' : '#b8c1cd',
  border: 'none',
  textAlign: 'left',
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  borderLeft: ativo ? '4px solid #dfb15b' : '4px solid transparent',
  marginBottom: '4px',
  fontWeight: ativo ? 'bold' : 'normal'
});