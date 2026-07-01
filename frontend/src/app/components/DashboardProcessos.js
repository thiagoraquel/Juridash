'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardProcessos() {
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [usuario, setUsuario] = useState(null);

  // Paleta de cores jurídica/corporativa para as fatias do gráfico
  const CORES = ['#2c3e50', '#dfb15b', '#e74c3c', '#34495e', '#16a085'];

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('usuarioLogado');
    if (dadosSalvos) {
      const user = JSON.parse(dadosSalvos);
      setUsuario(user);
      carregarDadosGrafico(user.id);
    }
  }, []);

  const carregarDadosGrafico = async (perfilId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/profiles/${perfilId}/grafico`);
      if (res.ok) {
        const dados = await res.json();
        // O backend retorna: [{ statusOuRisco: 'Em Andamento', quantidade: 14.0 }, ...]
        setDadosGrafico(dados);
      } else if (res.status === 204) {
        setDadosGrafico([]); // Sem conteúdo / Nenhuma base de processos subida ainda
      }
    } catch (error) {
      console.error("Erro ao buscar volumetria jurídica:", error);
    }
  };

  return (
    <div style={{ color: '#000000' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'extrabold', color: '#000000', marginBottom: '5px' }}>
        Indicadores Estratégicos de Performance
      </h1>
      <p style={{ color: '#1f2937', marginBottom: '30px', fontWeight: '500' }}>
        Visão consolidada da distribuição, volumetria e classificação de riscos da carteira judicial da banca.
      </p>

      {/* ================= RESUMO DO PERFIL DA BANCA ================= */}
      <div style={{ 
        padding: '20px', 
        background: '#fff', 
        borderRadius: '8px', 
        marginBottom: '35px', 
        borderLeft: '5px solid #dfb15b', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontWeight: 'bold', fontSize: '19px' }}>
          Inscrição Ativa: {usuario?.oabNumber || "OAB não identificada"}
        </h3>
        <p style={{ color: '#1f2937', fontWeight: '600', margin: 0 }}>
          Área de Atuação Principal: <span style={{ color: '#dfb15b' }}>{usuario?.specialtyArea || "Geral"}</span>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', alignItems: 'start' }}>
         
         {/* ================= CARD INFORMATIVO DE RISK MITIGATION ================= */}
         <div style={{ padding: '25px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>
            <h4 style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '10px', marginTop: 0, color: '#000000', fontWeight: 'extrabold', fontSize: '18px' }}>
              Mitigação de Perdas Contratuais
            </h4>
            <p style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500', marginBottom: '15px', lineHeight: '1.6' }}>
              Este gráfico reflete a segmentação em tempo real dos seus processos de acordo com os dados extraídos do tribunal e armazenados na sua conta do framework.
            </p>
            <p style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500', margin: 0, lineHeight: '1.6' }}>
              Utilize o <strong>Assistente Paralegal IA</strong> no menu lateral para cruzar esses dados com ementas de novas leis e calcular o impacto imediato nas suas taxas de ganho e êxito.
            </p>
         </div>

         {/* ================= CARD DO GRÁFICO DE PIZZA ================= */}
         <div style={{ padding: '25px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', minHeight: '380px' }}>
            <h4 style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '10px', marginTop: 0, color: '#000000', fontWeight: 'extrabold', fontSize: '18px' }}>
              Volumetria de Processos por Status / Classe
            </h4>
            
            {dadosGrafico.length > 0 ? (
              <div style={{ width: '100%', height: '320px', marginTop: '10px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={dadosGrafico}
                      dataKey="quantidade"
                      nameKey="statusOuRisco"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      style={{ color: '#000000', fontWeight: 'bold', fontSize: '13px' }}
                    >
                      {dadosGrafico.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Processo(s)`, 'Quantidade']} />
                    <Legend wrapperStyle={{ color: '#000000', fontWeight: 'bold', paddingTop: '15px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1f2937', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center', padding: '0 20px' }}>
                Nenhuma volumetria judicial encontrada. Faça o upload do arquivo de processos (PJe) na aba principal para gerar os indicadores visuais.
              </div>
            )}
         </div>

      </div>
    </div>
  );
}