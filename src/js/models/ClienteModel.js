/**
 * Modelo de Cliente
 * Responsável pela estrutura de dados e regras de negócio
 */
export class ClienteModel {
  constructor({ id, nome, endereco, telefone, cpf = '', dataCriacao }) {
    this.id = id || this.generateId();
    this.nome = nome;
    this.endereco = endereco;
    this.telefone = telefone;
    this.cpf = cpf;
    this.dataCriacao = dataCriacao || new Date().toISOString();
    this.dataFormatada = new Date(this.dataCriacao).toLocaleDateString('pt-BR');
  }

  /**
   * Gera um ID único para o cliente
   * @returns {string} ID único
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Formata o telefone para exibição
   * @returns {string} Telefone formatado
   */
  getTelefoneFormatado() {
    const numbers = this.telefone.replace(/\D/g, '');
    if (numbers.length === 10) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
    } else if (numbers.length === 11) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
    }
    return this.telefone;
  }

  /**
   * Formata o CPF para exibição
   * @returns {string} CPF formatado ou string vazia
   */
  getCPFFormatado() {
    if (!this.cpf) return '';
    const numbers = this.cpf.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6, 9)}-${numbers.substring(9)}`;
    }
    return this.cpf;
  }

  /**
   * Converte para objeto simples (para serialização)
   * @returns {Object} Objeto serializável
   */
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      endereco: this.endereco,
      telefone: this.telefone,
      cpf: this.cpf,
      dataCriacao: this.dataCriacao
    };
  }

  /**
   * Cria instância de ClienteModel a partir de objeto JSON
   * @param {Object} data Dados do cliente
   * @returns {ClienteModel} Nova instância
   */
  static fromJSON(data) {
    return new ClienteModel(data);
  }
}