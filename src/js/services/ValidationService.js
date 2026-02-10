/**
 * Serviço de Validação
 * Responsável por validar dados do cliente
 */
export class ValidationService {
  /**
   * Valida dados de um cliente
   * @param {Object} dados Dados do cliente
   * @returns {Object} Erros encontrados
   */
  static validarCliente(dados) {
    const errors = {};

    // Nome
    if (!dados.nome || dados.nome.trim() === '') {
      errors.nome = 'Nome é obrigatório';
    } else if (dados.nome.trim().length < 2) {
      errors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Endereço
    if (!dados.endereco || dados.endereco.trim() === '') {
      errors.endereco = 'Endereço é obrigatório';
    } else if (dados.endereco.trim().length < 5) {
      errors.endereco = 'Endereço deve ter pelo menos 5 caracteres';
    }

    // Telefone
    if (!dados.telefone || dados.telefone.trim() === '') {
      errors.telefone = 'Telefone é obrigatório';
    } else {
      const telefoneLimpo = dados.telefone.replace(/\D/g, '');
      if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        errors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
      }
    }

    // CPF (opcional)
    if (dados.cpf && dados.cpf.trim() !== '') {
      const cpfLimpo = dados.cpf.replace(/\D/g, '');
      if (cpfLimpo.length !== 11) {
        errors.cpf = 'CPF deve ter 11 dígitos';
      } else if (!this.validarCPF(cpfLimpo)) {
        errors.cpf = 'CPF inválido';
      }
    }

    return errors;
  }

  /**
   * Valida um CPF usando algoritmo oficial
   * @param {string} cpf CPF a ser validado
   * @returns {boolean} True se CPF é válido
   */
  static validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  /**
   * Formata um CPF para exibição
   * @param {string} cpf CPF a ser formatado
   * @returns {string} CPF formatado
   */
  static formatarCPF(cpf) {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6, 9)}-${numbers.substring(9)}`;
    }
    return cpf;
  }

  /**
   * Formata um telefone para exibição
   * @param {string} telefone Telefone a ser formatado
   * @returns {string} Telefone formatado
   */
  static formatarTelefone(telefone) {
    const numbers = telefone.replace(/\D/g, '');
    if (numbers.length === 10) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
    } else if (numbers.length === 11) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
    }
    return telefone;
  }
}