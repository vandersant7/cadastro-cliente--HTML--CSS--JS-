/**
 * View da Tela de Busca
 * Responsável por renderizar a interface de busca
 */
export class BuscaView {
  constructor() {
    this.element = null;
    this.callbacks = {
      onBack: () => {},
      onSearch: () => {},
      onFilterChange: () => {},
      onClearResults: () => {}
    };
  }

  /**
   * Renderiza a view
   * @returns {HTMLElement} Elemento da view
   */
  render() {
    const view = document.createElement('section');
    view.className = 'view busca-view';
    view.id = 'buscaView';
    view.innerHTML = this.getTemplate();
    
    this.element = view;
    this.setupEventListeners();
    
    return view;
  }

  /**
   * Retorna o template HTML da view
   * @returns {string} Template HTML
   */
  getTemplate() {
    return `
      <div class="view-container">
        <div class="card">
          <div class="card__header">
            <div class="card__icon-container">
              <i class="fas fa-search card__icon"></i>
            </div>
            <h2 class="card__title">Buscar Cliente</h2>
            <p class="card__subtitle">Localize clientes cadastrados utilizando os filtros abaixo</p>
          </div>
          
          <div class="card__content">
            <div class="busca-view__search-container">
              <div class="search-bar">
                <div class="search-bar__container">
                  <i class="fas fa-search"></i>
                  <input type="text" 
                         class="search-bar__input" 
                         id="buscaInput" 
                         placeholder="Digite nome, CPF ou telefone...">
                </div>
                <button class="button button--primary" id="buscarBtn">
                  <i class="fas fa-search"></i>
                  Buscar
                </button>
              </div>
              
              <div class="search-filters">
                <div class="search-filters__title">Filtrar por:</div>
                <div class="search-filters__options">
                  <label class="search-filters__option">
                    <input type="radio" name="filtro" value="todos" checked>
                    <span class="search-filters__label">Todos os campos</span>
                  </label>
                  <label class="search-filters__option">
                    <input type="radio" name="filtro" value="nome">
                    <span class="search-filters__label">Nome</span>
                  </label>
                  <label class="search-filters__option">
                    <input type="radio" name="filtro" value="cpf">
                    <span class="search-filters__label">CPF</span>
                  </label>
                  <label class="search-filters__option">
                    <input type="radio" name="filtro" value="telefone">
                    <span class="search-filters__label">Telefone</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="busca-view__results" id="resultadosBusca">
              <div class="results-placeholder">
                <i class="fas fa-search results-placeholder__icon"></i>
                <p class="results-placeholder__text">
                  Digite um termo de busca para encontrar clientes cadastrados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Configura os event listeners
   */
  setupEventListeners() {
    if (!this.element) return;

    // Botão buscar
    const buscarBtn = this.element.querySelector('#buscarBtn');
    if (buscarBtn) {
      buscarBtn.addEventListener('click', () => this.handleSearch());
    }

    // Input de busca (busca em tempo real)
    const buscaInput = this.element.querySelector('#buscaInput');
    if (buscaInput) {
      buscaInput.addEventListener('input', (e) => {
        const termo = e.target.value.trim();
        if (termo.length >= 2) {
          clearTimeout(this.searchTimeout);
          this.searchTimeout = setTimeout(() => this.handleSearch(), 300);
        } else if (termo.length === 0) {
          this.callbacks.onClearResults();
        }
      });

      // Permitir busca com Enter
      buscaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleSearch();
        }
      });
    }

    // Filtros
    const filtros = this.element.querySelectorAll('input[name="filtro"]');
    filtros.forEach(filtro => {
      filtro.addEventListener('change', (e) => {
        this.callbacks.onFilterChange(e.target.value);
        const buscaInput = this.element.querySelector('#buscaInput');
        if (buscaInput && buscaInput.value.trim().length >= 2) {
          this.handleSearch();
        }
      });
    });
  }

  /**
   * Manipula a busca
   */
  handleSearch() {
    const input = this.element.querySelector('#buscaInput');
    const termo = input?.value.trim() || '';
    const filtro = this.getFiltroAtivo();
    
    if (termo.length >= 2) {
      this.callbacks.onSearch(termo, filtro);
    } else {
      this.showPlaceholder('Digite pelo menos 2 caracteres para buscar.');
    }
  }

  /**
   * Obtém o filtro ativo
   * @returns {string} Filtro ativo
   */
  getFiltroAtivo() {
    const filtroAtivo = this.element?.querySelector('input[name="filtro"]:checked');
    return filtroAtivo?.value || 'todos';
  }

  /**
   * Exibe resultados da busca
   * @param {Array<ClienteModel>} clientes Lista de clientes encontrados
   * @param {string} termoBuscado Termo utilizado na busca
   */
  showResults(clientes, termoBuscado) {
    const resultadosContainer = this.element.querySelector('#resultadosBusca');
    if (!resultadosContainer) return;

    if (clientes.length === 0) {
      this.showPlaceholder(`Nenhum cliente encontrado para "${termoBuscado}".`);
      return;
    }

    resultadosContainer.innerHTML = this.getResultsTemplate(clientes, termoBuscado);
    
    // Configurar evento para botão de limpar resultados
    const clearBtn = resultadosContainer.querySelector('#clearResultsBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.callbacks.onClearResults());
    }
  }

  /**
   * Retorna template para resultados
   * @param {Array<ClienteModel>} clientes Clientes encontrados
   * @param {string} termoBuscado Termo da busca
   * @returns {string} Template HTML
   */
  getResultsTemplate(clientes, termoBuscado) {
    const clientesHTML = clientes.map(cliente => this.getClienteCardTemplate(cliente, termoBuscado)).join('');
    
    return `
      <div class="search-results">
        <div class="search-results__header">
          <h3 class="search-results__title">
            <i class="fas fa-search"></i>
            ${clientes.length} cliente(s) encontrado(s)
          </h3>
          <button class="button button--secondary" id="clearResultsBtn">
            <i class="fas fa-times"></i>
            Limpar resultados
          </button>
        </div>
        <div class="search-results__list">
          ${clientesHTML}
        </div>
      </div>
    `;
  }

  /**
   * Retorna template para card de cliente
   * @param {ClienteModel} cliente Cliente
   * @param {string} termoBuscado Termo para destacar
   * @returns {string} Template HTML
   */
  getClienteCardTemplate(cliente, termoBuscado) {
    const nomeDestacado = this.highlightText(cliente.nome, termoBuscado);
    
    return `
      <div class="cliente-card" data-id="${cliente.id}">
        <div class="cliente-card__header">
          <div class="cliente-card__icon">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="cliente-card__info">
            <h4 class="cliente-card__name">${nomeDestacado}</h4>
            <div class="cliente-card__meta">
              <span class="cliente-card__date">
                <i class="fas fa-calendar-alt"></i>
                Cadastrado em: ${cliente.dataFormatada}
              </span>
            </div>
          </div>
          <button class="cliente-card__close" onclick="this.closest('.cliente-card').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="cliente-card__body">
          <div class="cliente-card__field">
            <span class="cliente-card__label">
              <i class="fas fa-map-marker-alt"></i>
              Endereço:
            </span>
            <span class="cliente-card__value">${cliente.endereco}</span>
          </div>
          
          <div class="cliente-card__field">
            <span class="cliente-card__label">
              <i class="fas fa-phone"></i>
              Telefone:
            </span>
            <span class="cliente-card__value">${cliente.getTelefoneFormatado()}</span>
          </div>
          
          ${cliente.cpf ? `
          <div class="cliente-card__field">
            <span class="cliente-card__label">
              <i class="fas fa-id-card"></i>
              CPF:
            </span>
            <span class="cliente-card__value">${cliente.getCPFFormatado()}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Destaca texto dentro de outro
   * @param {string} text Texto completo
   * @param {string} query Termo a destacar
   * @returns {string} Texto com highlight
   */
  highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Escapa caracteres especiais para regex
   * @param {string} string String a ser escapada
   * @returns {string} String escapada
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Exibe placeholder na área de resultados
   * @param {string} message Mensagem do placeholder
   */
  showPlaceholder(message) {
    const resultadosContainer = this.element.querySelector('#resultadosBusca');
    if (!resultadosContainer) return;

    resultadosContainer.innerHTML = `
      <div class="results-placeholder">
        <i class="fas fa-search results-placeholder__icon"></i>
        <p class="results-placeholder__text">${message}</p>
      </div>
    `;
  }

  /**
   * Limpa os resultados
   */
  clearResults() {
    this.showPlaceholder('Digite um termo de busca para encontrar clientes cadastrados.');
    const input = this.element.querySelector('#buscaInput');
    if (input) input.value = '';
  }

  /**
   * Configura callbacks da view
   * @param {Object} callbacks Callbacks para eventos
   */
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}