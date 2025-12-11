/**
 * Configuração da API
 * 
 * Para desenvolvimento local: http://localhost:3000/api
 * Para testar no celular físico: http://SEU_IP_LOCAL:3000/api (ex: http://192.168.1.100:3000/api)
 * Para produção: https://sua-api.com/api
 * 
 * Troque a URL conforme necessário ou use variáveis de ambiente (.env)
 */

const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://127.0.0.1:4040/api';

export default API_URL;

// Token key para localStorage
export const TOKEN_KEY = 'bnotas_token';
export const USER_KEY = 'bnotas_user';