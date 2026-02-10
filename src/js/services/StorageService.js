/**
 * Serviço de Armazenamento
 * Gerencia persistência no localStorage
 */
export class StorageService {
  static STORAGE_KEY = 'clientesCadastrados';

  /**
   * Salva lista de clientes no localStorage
   * @param {Array<ClienteModel>} clientes Lista de clientes
   * @throws {Error} Se houver erro na serialização
   */
  static salvarClientes(clientes) {
    try {
      const dados = clientes.map(cliente => cliente.toJSON());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dados));
    } catch (error) {
      throw new Error('Erro ao salvar clientes no armazenamento local');
    }
  }

  /**
   * Carrega clientes do localStorage
   * @returns {Array<ClienteModel>} Lista de clientes
   */
  static carregarClientes() {
    try {
      const dados = localStorage.getItem(this.STORAGE_KEY);
      if (!dados) return [];
      
      return JSON.parse(dados).map(dado => ClienteModel.fromJSON(dado));
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      return [];
    }
  }

  /**
   * Adiciona um novo cliente ao armazenamento
   * @param {ClienteModel} cliente Cliente a ser adicionado
   * @param {Array<ClienteModel>} clientesAtuais Lista atual de clientes
   * @returns {Array<ClienteModel>} Nova lista de clientes
   */
  static adicionarCliente(cliente, clientesAtuais) {
    const novaLista = [...clientesAtuais, cliente];
    this.salvarClientes(novaLista);
    return novaLista;
  }

  /**
   * Busca clientes por termo e filtro
   * @param {string} termo Termo de busca
   * @param {string} filtro Filtro ('todos', 'nome', 'telefone', 'cpf')
   * @param {Array<ClienteModel>} clientes Lista de clientes
   * @returns {Array<ClienteModel>} Clientes encontrados
   */
  static buscarClientes(termo, filtro, clientes) {
    if (!termo || termo.length < 2) return [];

    const termoLowerCase = termo.toLowerCase();

    return clientes.filter(cliente => {
      switch (filtro) {
        case 'nome':
          return cliente.nome.toLowerCase().includes(termoLowerCase);
        
        case 'telefone':
          return cliente.telefone.replace(/\D/g, '').includes(termoLowerCase);
        
        case 'cpf':
          return cliente.cpf && cliente.cpf.replace(/\D/g, '').includes(termoLowerCase);
        
        case 'todos':
        default:
          return (
            cliente.nome.toLowerCase().includes(termoLowerCase) ||
            cliente.telefone.replace(/\D/g, '').includes(termoLowerCase) ||
            (cliente.cpf && cliente.cpf.replace(/\D/g, '').includes(termoLowerCase))
          );
      }
    });
  }
}