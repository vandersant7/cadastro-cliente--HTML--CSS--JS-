/**
 * Controller de Cliente
 * Gerencia a lógica de negócio e comunicação entre Model e View
 */
import { ClienteModel } from '../models/ClienteModel.js';
import { StorageService } from '../services/StorageService.js';
import { ValidationService } from '../services/ValidationService.js';

export class ClienteController {
  constructor() {
    this.clientes = StorageService.carregarClientes();
  }

  /**
   * Cadastra um novo cliente
   * @param {Object} dados Dados do cliente
   * @returns {Object} Resultado da operação
   */
  cadastrarCliente(dados) {
    try {
      // Valida dados
      const errors = ValidationService.validarCliente(dados);
      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      // Formata dados
      const dadosFormatados = {
        ...dados,
        telefone: ValidationService.formatarTelefone(dados.telefone),
        cpf: dados.cpf ? ValidationService.formatarCPF(dados.cpf) : ''
      };

      // Cria modelo
      const cliente = new ClienteModel(dadosFormatados);

      // Salva no storage
      this.clientes = StorageService.adicionarCliente(cliente, this.clientes);

      return { success: true, cliente };
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      return { 
        success: false, 
        errors: { geral: 'Erro ao cadastrar cliente. Tente novamente.' } 
      };
    }
  }

  /**
   * Busca clientes
   * @param {string} termo Termo de busca
   * @param {string} filtro Filtro de busca
   * @returns {Array<ClienteModel>} Clientes encontrados
   */
  buscarClientes(termo, filtro) {
    return StorageService.buscarClientes(termo, filtro, this.clientes);
  }

  /**
   * Retorna todos os clientes
   * @returns {Array<ClienteModel>} Todos os clientes
   */
  obterTodosClientes() {
    return [...this.clientes];
  }

  /**
   * Retorna contagem de clientes
   * @returns {number} Número total de clientes
   */
  obterContagemClientes() {
    return this.clientes.length;
  }

  /**
   * Remove um cliente
   * @param {string} id ID do cliente
   * @returns {boolean} True se removido com sucesso
   */
  removerCliente(id) {
    const index = this.clientes.findIndex(cliente => cliente.id === id);
    if (index !== -1) {
      this.clientes.splice(index, 1);
      StorageService.salvarClientes(this.clientes);
      return true;
    }
    return false;
  }
}