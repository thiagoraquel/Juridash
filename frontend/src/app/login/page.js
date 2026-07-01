'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  
  // Dados do FrameworkAccount (Ponto Fixo)
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  
  // Dados do JuridashProfile (Ponto Variável / Terceira Aplicação)
  const [oabNumber, setOabNumber] = useState('');
  const [specialtyArea, setSpecialtyArea] = useState('Direito Civil');

  const handleAutenticacao = async (e) => {
    e.preventDefault();
    
    const url = isLogin 
        ? 'http://localhost:8080/api/profiles/login' 
        : 'http://localhost:8080/api/profiles/registro';
    
    // Payload em total sintonia com o RegistroJuridashDTO e LoginRequestDTO do seu Back
    const payload = isLogin 
        ? { email, senha } 
        : { nome, email, senha, oabNumber, specialtyArea };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const dadosAdvogado = await response.json();
        // Armazena o perfil jurídico completo no localStorage
        localStorage.setItem('usuarioLogado', JSON.stringify(dadosAdvogado));
        alert(isLogin ? "Painel Jurídico autenticado com sucesso!" : "Inscrição realizada com sucesso!");
        router.push('/'); 
      } else {
        const erroMsg = await response.text();
        alert(`Falha na Auditoria: ${erroMsg || "Credenciais incorretas ou OAB/E-mail já registrado."}`);
      }
    } catch (error) {
      console.error("Erro na conexão com os serviços do JuriDash:", error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <div style={{ padding: '45px 40px', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px', borderTop: '5px solid #2c3e50' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e2229', fontWeight: '600', letterSpacing: '0.5px' }}>
          {isLogin ? 'Acesso ao JuriDash' : 'Cadastrar Escritório'}
        </h2>
        
        <form onSubmit={handleAutenticacao} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {!isLogin && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: '600', color: '#4a5568', fontSize: '13px' }}>Nome do Titular / Razão Social</label>
                <input 
                  type="text" 
                  placeholder="Ex: Dr. Thiago de Medeiros" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                  style={estiloInput}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: '600', color: '#4a5568', fontSize: '13px' }}>Inscrição na OAB (Nº e UF)</label>
                <input 
                  type="text" 
                  placeholder="Ex: 12345-RN" 
                  value={oabNumber} 
                  onChange={(e) => setOabNumber(e.target.value)} 
                  required 
                  style={estiloInput}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontWeight: '600', color: '#4a5568', fontSize: '13px' }}>Especialidade Principal</label>
                <select 
                  value={specialtyArea} 
                  onChange={(e) => setSpecialtyArea(e.target.value)}
                  style={estiloInput}
                >
                  <option value="Direito Civil">Direito Civil / Contratos</option>
                  <option value="Direito do Trabalho">Direito do Trabalho</option>
                  <option value="Direito Tributário">Direito Tributário</option>
                  <option value="Direito Penal / Criminal">Direito Penal / Criminal</option>
                  <option value="Direito Previdenciário">Direito Previdenciário</option>
                </select>
              </div>
            </>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: '600', color: '#4a5568', fontSize: '13px' }}>E-mail Corporativo</label>
            <input 
              type="email" 
              placeholder="advogado@escritorio.com.br" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={estiloInput}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: '600', color: '#4a5568', fontSize: '13px' }}>Senha de Segurança</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
              style={estiloInput}
            />
          </div>
          
          <button type="submit" style={{ marginTop: '12px', padding: '12px', background: '#2c3e50', color: '#dfb15b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', letterSpacing: '0.5px', transition: 'background 0.2s' }}>
            {isLogin ? 'Autenticar' : 'Finalizar Registro'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#2c3e50', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px', fontWeight: '500' }}>
            {isLogin ? 'Novo escritório? Registre a banca aqui' : 'Já possui cadastro? Ir para Autenticação'}
          </button>
        </div>

      </div>
    </div>
  );
}

const estiloInput = {
  padding: '11px 12px', 
  borderRadius: '4px', 
  border: '1px solid #cbd5e1', 
  color: '#1e2229', 
  backgroundColor: '#fff',
  fontSize: '14px',
  outline: 'none'
};