/**
 * Calcula o tempo restante até uma data específica e retorna uma string formatada
 * @param dataExpiracao - Data de expiração para calcular o tempo restante
 * @returns Objeto com informações sobre o tempo restante e status
 */
export function calcularTempoRestante(dataExpiracao: Date | string | null) {
  if (!dataExpiracao) return { texto: 'Sem data de expiração', status: 'indefinido', diasRestantes: null };
  
  const dataExp = typeof dataExpiracao === 'string' ? new Date(dataExpiracao) : dataExpiracao;
  const hoje = new Date();
  
  // Se a data já expirou
  if (dataExp < hoje) {
    const diasPassados = Math.floor((hoje.getTime() - dataExp.getTime()) / (1000 * 60 * 60 * 24));
    return { 
      texto: `Expirou há ${diasPassados} ${diasPassados === 1 ? 'dia' : 'dias'}`,
      status: 'expirado',
      diasRestantes: -diasPassados
    };
  }
  
  // Calcula a diferença em milissegundos
  const diferenca = dataExp.getTime() - hoje.getTime();
  
  // Converte para dias, horas, minutos
  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
  
  // Formata o texto com base no tempo restante
  let texto = '';
  let status = '';
  
  if (dias > 30) {
    const meses = Math.floor(dias / 30);
    texto = `${meses} ${meses === 1 ? 'mês' : 'meses'} restantes`;
    status = 'seguro';
  } else if (dias > 0) {
    if (dias < 7) {
      texto = `${dias} ${dias === 1 ? 'dia' : 'dias'} e ${horas}h restantes`;
      status = dias < 3 ? 'crítico' : 'alerta';
    } else {
      texto = `${dias} ${dias === 1 ? 'dia' : 'dias'} restantes`;
      status = dias < 15 ? 'alerta' : 'ok';
    }
  } else if (horas > 0) {
    texto = `${horas}h e ${minutos}min restantes`;
    status = 'crítico';
  } else {
    texto = `${minutos} minutos restantes`;
    status = 'crítico';
  }
  
  return { texto, status, diasRestantes: dias };
}

/**
 * Retorna uma classe CSS para o status do tempo restante
 * @param status - Status do tempo restante
 * @returns Classe CSS para o texto
 */
export function getTempoRestanteClasse(status: string): string {
  switch (status) {
    case 'expirado':
      return 'text-red-600 font-medium';
    case 'crítico':
      return 'text-red-500 font-medium';
    case 'alerta':
      return 'text-amber-500 font-medium';
    case 'ok':
      return 'text-blue-500';
    case 'seguro':
      return 'text-green-600';
    default:
      return 'text-gray-500';
  }
}

/**
 * Formata uma data para exibição em português
 * @param data - Data a ser formatada 
 * @param formato - Formato da data (curto, completo)
 * @returns Data formatada
 */
export function formatarData(data: Date | string | null, formato: 'curto' | 'completo' = 'curto'): string {
  if (!data) return 'Data não disponível';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  if (formato === 'curto') {
    return dataObj.toLocaleDateString('pt-BR');
  }
  
  // Formato completo com dia da semana
  const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  
  const diaSemana = diasSemana[dataObj.getDay()];
  const dia = dataObj.getDate();
  const mes = meses[dataObj.getMonth()];
  const ano = dataObj.getFullYear();
  
  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
}
