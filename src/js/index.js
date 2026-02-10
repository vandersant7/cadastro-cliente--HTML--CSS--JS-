/**
 * Sistema de Cadastro e Busca de Clientes - JavaScript Puro
 * Simulação de Single Page Application (SPA)
 */

// ===========================================
// ESTADO GLOBAL E CONSTANTES
// ===========================================
const AppState = {
  clientes: [],
  currentScreen: 'home',
  currentSearch: '',
  searchFilter: 'todos'
};

// Elementos DOM principais
const DOM = {
  // Telas
  homeScreen: document.getElementById('homeScreen'),
  cadastroScreen: document.getElementById('cadastroScreen'),
  buscaScreen: document.getElementById('buscaScreen'),
  
  // Botões de navegação
  cadastrarBtn: document.getElementById('cadastrarBtn'),
  buscarBtn: document.getElementById('buscarBtn'),
  voltarCadastroBtn: document.getElementById('voltarCadastroBtn'),
  voltarBuscaBtn: document.getElementById('voltarBuscaBtn'),
  
  // Formulário de cadastro
  cadastroForm: document.getElementById('cadastroForm'),
  dataCriacao: document.getElementById('dataCriacao'),
  
  // Busca
  buscaInput: document.getElementById('buscaInput'),
  buscarClienteBtn: document.getElementById('buscarClienteBtn'),
  limparBuscaBtn: document.getElementById('limparBuscaBtn'),
  resultadosBusca: document.getElementById('resultadosBusca'),
  
  // Filtros de busca
  filtrosBusca: document.querySelectorAll('input[name="filtro"]'),
  
  // Modal
  successModal: document.getElementById('successModal'),
  fecharModalBtn: document.getElementById('fecharModalBtn'),
  okModalBtn: document.getElementById('okModalBtn'),
  
  // Contadores
  clientesCount: document.getElementById('clientesCount'),
  currentYear: document.getElementById('currentYear')
};

// ===========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ===========================================
/**
 * Inicializa a aplicação quando o DOM estiver pronto
 */
function initApp() {
  // Carrega clientes do localStorage
  loadClientes();
  
  // Atualiza contador e ano
  updateClientesCount();
  updateCurrentYear();
  
  // Configura eventos
  setupEventListeners();
  
  // Exibe tela inicial
  showScreen('home');
  
  // Configura data atual no formulário
  updateDataCriacao();
}

/**
 * Configura todos os event listeners da aplicação
 */
function setupEventListeners() {
  // Navegação entre telas
  DOM.cadastrarBtn.addEventListener('click', () => showScreen('cadastro'));
  DOM.buscarBtn.addEventListener('click', () => showScreen('busca'));
  DOM.voltarCadastroBtn.addEventListener('click', () => showScreen('home'));
  DOM.voltarBuscaBtn.addEventListener('click', () => showScreen('home'));
  
  // Formulário de cadastro
  DOM.cadastroForm.addEventListener('submit', handleCadastroSubmit);
  DOM.cadastroForm.addEventListener('reset', handleFormReset);
  
  // Busca de clientes
  DOM.buscarClienteBtn.addEventListener('click', handleSearch);
  DOM.buscaInput.addEventListener('input', handleSearchInput);
  DOM.limparBuscaBtn.addEventListener('click', clearSearch);
  
  // Filtros de busca
  DOM.filtrosBusca.forEach(filter => {
    filter.addEventListener('change', handleFilterChange);
  });
  
  // Modal
  DOM.fecharModalBtn.addEventListener('click', closeModal);
  DOM.okModalBtn.addEventListener('click', closeModal);
  
  // Fechar modal ao clicar fora
  DOM.successModal.addEventListener('click', (e) => {
    if (e.target === DOM.successModal) {
      closeModal();
    }
  });
}

// ===========================================
// NAVEGAÇÃO ENTRE TELAS (SPA)
// ===========================================
/**
 * Controla a exibição das telas da aplicação
 * @param {string} screenName - Nome da tela a ser exibida ('home', 'cadastro', 'busca')
 */
function showScreen(screenName) {
  // Esconde todas as telas
  DOM.homeScreen.style.display = 'none';
  DOM.cadastroScreen.style.display = 'none';
  DOM.buscaScreen.style.display = 'none';
  
  // Atualiza estado
  AppState.currentScreen = screenName;
  
  // Mostra a tela solicitada
  switch (screenName) {
    case 'home':
      DOM.homeScreen.style.display = 'block';
      break;
    case 'cadastro':
      DOM.cadastroScreen.style.display = 'block';
      // Atualiza data de criação
      updateDataCriacao();
      // Foca no primeiro campo
      document.getElementById('nome').focus();
      break;
    case 'busca':
      DOM.buscaScreen.style.display = 'block';
      // Limpa resultados anteriores
      clearSearchResults();
      // Foca no campo de busca
      DOM.buscaInput.focus();
      break;
  }
}

// ===========================================
// MANIPULAÇÃO DE DADOS (LOCALSTORAGE)
// ===========================================
/**
 * Carrega clientes do localStorage
 */
function loadClientes() {
  const clientesData = localStorage.getItem('clientesCadastrados');
  if (clientesData) {
    try {
      AppState.clientes = JSON.parse(clientesData);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      AppState.clientes = [];
    }
  }
}

/**
 * Salva clientes no localStorage
 */
function saveClientes() {
  try {
    localStorage.setItem('clientesCadastrados', JSON.stringify(AppState.clientes));
  } catch (error) {
    console.error('Erro ao salvar clientes:', error);
    showError('Erro ao salvar dados. Tente novamente.');
  }
}

/**
 * Adiciona um novo cliente
 * @param {Object} cliente - Objeto com dados do cliente
 */
function addCliente(cliente) {
  AppState.clientes.push(cliente);
  saveClientes();
  updateClientesCount();
}

// ===========================================
// FORMULÁRIO DE CADASTRO
// ===========================================
/**
 * Atualiza a data de criação no formulário
 */
function updateDataCriacao() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  DOM.dataCriacao.textContent = formattedDate;
}

/**
 * Manipula o envio do formulário de cadastro
 * @param {Event} event - Evento de submit
 */
function handleCadastroSubmit(event) {
  event.preventDefault();
  
  // Limpa erros anteriores
  clearFormErrors();
  
  // Coleta dados do formulário
  const formData = {
    nome: document.getElementById('nome').value.trim(),
    endereco: document.getElementById('endereco').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    cpf: document.getElementById('cpf').value.trim(),
    dataCriacao: new Date().toISOString()
  };
  
  // Valida dados
  const errors = validateClienteData(formData);
  
  if (Object.keys(errors).length > 0) {
    // Exibe erros
    displayFormErrors(errors);
    return;
  }
  
  // Formata dados
  const cliente = {
    id: generateId(),
    nome: formData.nome,
    endereco: formData.endereco,
    telefone: formatTelefone(formData.telefone),
    cpf: formData.cpf ? formatCPF(formData.cpf) : '',
    dataCriacao: formData.dataCriacao,
    dataFormatada: new Date().toLocaleDateString('pt-BR')
  };
  
  // Adiciona cliente
  addCliente(cliente);
  
  // Mostra modal de sucesso
  showModal();
  
  // Limpa formulário
  DOM.cadastroForm.reset();
  updateDataCriacao();
}

/**
 * Manipula o reset do formulário
 */
function handleFormReset() {
  clearFormErrors();
  updateDataCriacao();
}

// ===========================================
// VALIDAÇÃO DE DADOS
// ===========================================
/**
 * Valida os dados do cliente
 * @param {Object} data - Dados do cliente
 * @returns {Object} - Objeto com erros encontrados
 */
function validateClienteData(data) {
  const errors = {};
  
  // Nome (obrigatório)
  if (!data.nome) {
    errors.nome = 'Nome é obrigatório';
  } else if (data.nome.length < 2) {
    errors.nome = 'Nome deve ter pelo menos 2 caracteres';
  }
  
  // Endereço (obrigatório)
  if (!data.endereco) {
    errors.endereco = 'Endereço é obrigatório';
  } else if (data.endereco.length < 5) {
    errors.endereco = 'Endereço deve ter pelo menos 5 caracteres';
  }
  
  // Telefone (obrigatório)
  if (!data.telefone) {
    errors.telefone = 'Telefone é obrigatório';
  } else {
    const telefoneLimpo = data.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      errors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
    }
  }
  
  // CPF (opcional, mas se preenchido, deve ser válido)
  if (data.cpf) {
    const cpfLimpo = data.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      errors.cpf = 'CPF deve ter 11 dígitos';
    } else if (!validateCPF(cpfLimpo)) {
      errors.cpf = 'CPF inválido';
    }
  }
  
  return errors;
}

/**
 * Valida um CPF (algoritmo básico)
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - True se CPF é válido
 */
function validateCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos e não é sequência repetida
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  // Validação dos dígitos verificadores
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
 * Limpa todas as mensagens de erro do formulário
 */
function clearFormErrors() {
  const errorElements = document.querySelectorAll('.form__error');
  errorElements.forEach(element => {
    element.textContent = '';
    element.style.display = 'none';
  });
}

/**
 * Exibe erros no formulário
 * @param {Object} errors - Objeto com erros
 */
function displayFormErrors(errors) {
  for (const [field, message] of Object.entries(errors)) {
    const errorElement = document.getElementById(`${field}Error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }
}

// ===========================================
// FORMATAÇÃO DE DADOS
// ===========================================
/**
 * Formata um número de telefone
 * @param {string} telefone - Número de telefone
 * @returns {string} - Telefone formatado
 */
function formatTelefone(telefone) {
  const numbers = telefone.replace(/\D/g, '');
  if (numbers.length === 10) {
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
  } else if (numbers.length === 11) {
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
  }
  return telefone;
}

/**
 * Formata um CPF
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} - CPF formatado
 */
function formatCPF(cpf) {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length === 11) {
    return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6, 9)}-${numbers.substring(9)}`;
  }
  return cpf;
}

/**
 * Gera um ID único para o cliente
 * @returns {string} - ID único
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===========================================
// SISTEMA DE BUSCA
// ===========================================
/**
 * Manipula a entrada no campo de busca
 */
function handleSearchInput() {
  const query = DOM.buscaInput.value.trim();
  
  // Mostra/oculta botão de limpar
  if (query.length > 0) {
    DOM.limparBuscaBtn.style.display = 'block';
  } else {
    DOM.limparBuscaBtn.style.display = 'none';
    clearSearchResults();
  }
  
  // Busca em tempo real (debounce simples)
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(() => {
    if (query.length >= 2) {
      handleSearch();
    }
  }, 300);
}

/**
 * Manipula a mudança no filtro de busca
 * @param {Event} event - Evento de change
 */
function handleFilterChange(event) {
  AppState.searchFilter = event.target.value;
  if (DOM.buscaInput.value.trim().length >= 2) {
    handleSearch();
  }
}

/**
 * Executa a busca de clientes
 */
function handleSearch() {
  const query = DOM.buscaInput.value.trim().toLowerCase();
  
  if (query.length < 2) {
    showSearchPlaceholder('Digite pelo menos 2 caracteres para buscar.');
    return;
  }
  
  // Filtra clientes
  const resultados = AppState.clientes.filter(cliente => {
    const filter = AppState.searchFilter;
    
    // Busca em todos os campos se filtro for "todos"
    if (filter === 'todos') {
      return (
        cliente.nome.toLowerCase().includes(query) ||
        cliente.telefone.replace(/\D/g, '').includes(query) ||
        (cliente.cpf && cliente.cpf.replace(/\D/g, '').includes(query))
      );
    }
    
    // Busca específica por campo
    switch (filter) {
      case 'nome':
        return cliente.nome.toLowerCase().includes(query);
      case 'telefone':
        return cliente.telefone.replace(/\D/g, '').includes(query);
      case 'cpf':
        return cliente.cpf && cliente.cpf.replace(/\D/g, '').includes(query);
      default:
        return false;
    }
  });
  
  // Exibe resultados
  displaySearchResults(resultados, query);
}

/**
 * Limpa a busca
 */
function clearSearch() {
  DOM.buscaInput.value = '';
  DOM.limparBuscaBtn.style.display = 'none';
  clearSearchResults();
}

/**
 * Limpa os resultados da busca
 */
function clearSearchResults() {
  DOM.resultadosBusca.innerHTML = '';
  showSearchPlaceholder('Digite um termo de busca para encontrar clientes cadastrados.');
}

/**
 * Exibe um placeholder na área de resultados
 * @param {string} message - Mensagem a ser exibida
 */
function showSearchPlaceholder(message) {
  DOM.resultadosBusca.innerHTML = `
    <div class="results-placeholder">
      <i class="fas fa-search results-placeholder__icon"></i>
      <p class="results-placeholder__text">${message}</p>
    </div>
  `;
}

/**
 * Exibe os resultados da busca
 * @param {Array} resultados - Array de clientes encontrados
 * @param {string} query - Termo de busca
 */
function displaySearchResults(resultados, query) {
  if (resultados.length === 0) {
    showSearchPlaceholder(`Nenhum cliente encontrado para "${query}".`);
    return;
  }
  
  let html = `
    <div class="search-results">
      <div class="search-results__header">
        <h3 class="search-results__title">
          <i class="fas fa-search"></i>
          ${resultados.length} cliente(s) encontrado(s)
        </h3>
        <button class="button button--secondary search-results__clear" id="clearResultsBtn">
          <i class="fas fa-times"></i>
          Limpar resultados
        </button>
      </div>
      <div class="search-results__list">
  `;
  
  resultados.forEach(cliente => {
    html += createClienteCard(cliente, query);
  });
  
  html += `
      </div>
    </div>
  `;
  
  DOM.resultadosBusca.innerHTML = html;
  
  // Adiciona evento ao botão de limpar resultados
  document.getElementById('clearResultsBtn')?.addEventListener('click', clearSearchResults);
}

/**
 * Cria o HTML de um card de cliente
 * @param {Object} cliente - Dados do cliente
 * @param {string} highlightQuery - Termo para destacar
 * @returns {string} - HTML do card
 */
function createClienteCard(cliente, highlightQuery) {
  // Destaca o termo de busca no nome
  const highlightedName = highlightText(cliente.nome, highlightQuery);
  
  return `
    <div class="cliente-card" data-id="${cliente.id}">
      <div class="cliente-card__header">
        <div class="cliente-card__icon">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="cliente-card__info">
          <h4 class="cliente-card__name">${highlightedName}</h4>
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
          <span class="cliente-card__value">${cliente.telefone}</span>
        </div>
        
        ${cliente.cpf ? `
        <div class="cliente-card__field">
          <span class="cliente-card__label">
            <i class="fas fa-id-card"></i>
            CPF:
          </span>
          <span class="cliente-card__value">${cliente.cpf}</span>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Destaca um texto dentro de outro
 * @param {string} text - Texto completo
 * @param {string} query - Termo a destacar
 * @returns {string} - Texto com highlight
 */
function highlightText(text, query) {
  if (!query) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escapa caracteres especiais para regex
 * @param {string} string - String a ser escapada
 * @returns {string} - String escapada
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ===========================================
// MODAL E FEEDBACK
// ===========================================
/**
 * Exibe o modal de sucesso
 */
function showModal() {
  DOM.successModal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Previne scroll
}

/**
 * Fecha o modal
 */
function closeModal() {
  DOM.successModal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restaura scroll
  
  // Volta para a tela inicial
  showScreen('home');
}

/**
 * Exibe uma mensagem de erro (simples)
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
  // Em um sistema real, você poderia ter um sistema mais sofisticado de notificações
  console.error('Erro:', message);
}

// ===========================================
// UTILITÁRIOS
// ===========================================
/**
 * Atualiza o contador de clientes
 */
function updateClientesCount() {
  DOM.clientesCount.textContent = AppState.clientes.length;
}

/**
 * Atualiza o ano atual no rodapé
 */
function updateCurrentYear() {
  const currentYear = new Date().getFullYear();
  DOM.currentYear.textContent = currentYear;
}

// ===========================================
// INICIALIZAÇÃO
// ===========================================
// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', initApp);

// Adiciona estilos CSS dinâmicos para os componentes criados via JS
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  .search-results {
    animation: fadeIn 0.3s ease;
  }
  
  .search-results__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-bg-gray);
  }
  
  .search-results__title {
    font-size: 1.125rem;
    color: var(--color-primary-dark);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .search-results__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .cliente-card {
    background: var(--color-bg-light);
    border: 1px solid var(--color-bg-gray);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-light);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .cliente-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }
  
  .cliente-card__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
  
  .cliente-card__icon {
    font-size: 2rem;
    color: var(--color-primary);
  }
  
  .cliente-card__info {
    flex: 1;
  }
  
  .cliente-card__name {
    font-size: 1.25rem;
    color: var(--color-primary-dark);
    margin-bottom: 0.25rem;
  }
  
  .cliente-card__name mark {
    background-color: #fff9c4;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
  }
  
  .cliente-card__meta {
    font-size: 0.875rem;
    color: var(--color-text-light);
  }
  
  .cliente-card__date {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .cliente-card__close {
    background: none;
    border: none;
    color: var(--color-text-lighter);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: color 0.2s ease;
  }
  
  .cliente-card__close:hover {
    color: var(--color-error);
  }
  
  .cliente-card__body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .cliente-card__field {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .cliente-card__label {
    font-weight: 500;
    color: var(--color-text);
    min-width: 100px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .cliente-card__value {
    color: var(--color-text-light);
    flex: 1;
  }
  
  @media (max-width: 768px) {
    .search-results__header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    
    .search-results__clear {
      width: 100%;
    }
    
    .cliente-card__field {
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .cliente-card__label {
      min-width: auto;
    }
  }
`;
document.head.appendChild(dynamicStyles);