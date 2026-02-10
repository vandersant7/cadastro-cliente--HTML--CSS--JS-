/**
 * Aplicação Principal
 * Ponto de entrada e configuração da arquitetura MVC
 */
import { HeaderView } from './views/HeaderView.js';
import { FooterView } from './views/FooterView.js';
import { HomeView } from './views/HomeView.js';
import { CadastroView } from './views/CadastroView.js';
import { BuscaView } from './views/BuscaView.js';
import { ClienteController } from './controllers/ClienteController.js';
import { Router } from './controllers/Router.js';

class App {
  constructor() {
    this.views = {};
    this.controller = new ClienteController();
    this.router = new Router();
    this.init();
  }

  /**
   * Inicializa a aplicação
   */
  async init() {
    this.setupHeader();
    this.setupFooter();
    this.setupViews();
    this.setupRouter();
    this.setupGlobalUI();
  }

  /**
   * Configura o header
   */
  setupHeader() {
    this.views.header = new HeaderView();
    this.views.header.setCallbacks({
      onNavigate: (route) => this.router.navigateTo(route),
      onToggleMenu: () => this.views.header.toggleMobileMenu()
    });
    
    // Insere o header no DOM
    const headerContainer = document.getElementById('appHeader');
    if (headerContainer) {
      const headerElement = this.views.header.render();
      headerContainer.appendChild(headerElement);
    }
  }

  /**
   * Configura o footer
   */
  setupFooter() {
    this.views.footer = new FooterView();
    
    // Insere o footer no DOM
    const footerContainer = document.getElementById('appFooter');
    if (footerContainer) {
      const footerElement = this.views.footer.render();
      footerContainer.appendChild(footerElement);
    }
  }

  /**
   * Configura as views
   */
  setupViews() {
    // Home View
    this.views.home = new HomeView();

    // Cadastro View
    this.views.cadastro = new CadastroView();
    this.views.cadastro.setCallbacks({
      onBack: () => this.router.navigateTo('home'),
      onSubmit: (formData) => this.handleCadastroSubmit(formData),
      onReset: () => this.views.cadastro.updateDataCriacao()
    });

    // Busca View
    this.views.busca = new BuscaView();
    this.views.busca.setCallbacks({
      onSearch: (termo, filtro) => this.handleSearch(termo, filtro),
      onFilterChange: (filtro) => {
        // Atualiza filtro (pode ser usado para otimizações futuras)
        console.log('Filtro alterado:', filtro);
      },
      onClearResults: () => this.views.busca.clearResults()
    });
  }

  /**
   * Configura o router
   */
  setupRouter() {
    const mainElement = document.getElementById('appMain');
    
    this.router.addRoute('home', {
      view: this.views.home,
      onActivate: () => {
        this.views.header?.setActiveRoute('home');
        this.updateFooterInfo();
      }
    });

    this.router.addRoute('cadastro', {
      view: this.views.cadastro,
      onActivate: () => {
        this.views.header?.setActiveRoute('cadastro');
        this.views.cadastro.updateDataCriacao();
        const inputNome = document.querySelector('#nome');
        if (inputNome) inputNome.focus();
      }
    });

    this.router.addRoute('busca', {
      view: this.views.busca,
      onActivate: () => {
        this.views.header?.setActiveRoute('busca');
        const inputBusca = document.querySelector('#buscaInput');
        if (inputBusca) {
          inputBusca.focus();
          this.views.busca.clearResults();
        }
      }
    });

    this.router.init(mainElement);
  }

  /**
   * Configura elementos globais da UI
   */
  setupGlobalUI() {
    this.updateFooterInfo();
    this.setupModal();
  }

  /**
   * Manipula o envio do formulário de cadastro
   * @param {Object} formData Dados do formulário
   */
  handleCadastroSubmit(formData) {
    const resultado = this.controller.cadastrarCliente(formData);
    
    if (resultado.success) {
      this.showSuccessModal();
      this.views.cadastro.clearForm();
      this.updateFooterInfo();
    } else {
      this.views.cadastro.showErrors(resultado.errors);
    }
  }

  /**
   * Manipula a busca de clientes
   * @param {string} termo Termo de busca
   * @param {string} filtro Filtro de busca
   */
  handleSearch(termo, filtro) {
    const resultados = this.controller.buscarClientes(termo, filtro);
    this.views.busca.showResults(resultados, termo);
  }

  /**
   * Configura o modal de sucesso
   */
  setupModal() {
    // Cria o modal dinamicamente
    const modalHTML = `
      <div class="modal" id="successModal">
        <div class="modal__overlay"></div>
        <div class="modal__container">
          <div class="modal__header">
            <div class="modal__icon-container" style="background-color: var(--color-success-light);">
              <i class="fas fa-check" style="color: var(--color-success);"></i>
            </div>
            <h3 class="modal__title">Sucesso!</h3>
            <button class="modal__close" id="fecharModalBtn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal__body">
            <p class="modal__message">Cliente cadastrado com sucesso!</p>
            <div class="modal__details">
              <p>Os dados do cliente foram armazenados no sistema.</p>
            </div>
          </div>
          <div class="modal__footer">
            <button class="button button--primary" id="okModalBtn">
              <i class="fas fa-check"></i>
              OK
            </button>
          </div>
        </div>
      </div>
    `;

    // Adiciona ao body se ainda não existir
    if (!document.getElementById('successModal')) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      // Configura eventos do modal
      const modal = document.getElementById('successModal');
      const fecharBtn = document.getElementById('fecharModalBtn');
      const okBtn = document.getElementById('okModalBtn');
      
      const closeModal = () => {
        modal.classList.remove('modal--show');
        document.body.style.overflow = 'auto';
      };
      
      if (fecharBtn) fecharBtn.addEventListener('click', closeModal);
      if (okBtn) okBtn.addEventListener('click', closeModal);
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }
  }

  /**
   * Exibe o modal de sucesso
   */
  showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.classList.add('modal--show');
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Atualiza informações do footer
   */
  updateFooterInfo() {
    const count = this.controller.obterContagemClientes();
    if (this.views.footer) {
      this.views.footer.updateClientesCount(count);
    }
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new App();
});