/**
 * View do Header
 * Responsável por renderizar o header da aplicação
 */
export class HeaderView {
  constructor() {
    this.element = null;
    this.callbacks = {
      onNavigate: () => {},
      onToggleMenu: () => {}
    };
  }

  /**
   * Renderiza o header
   * @returns {HTMLElement} Elemento do header
   */
  render() {
    const header = document.createElement('header');
    header.className = 'app-header';
    header.innerHTML = this.getTemplate();
    
    this.element = header;
    this.setupEventListeners();
    
    return header;
  }

  /**
   * Retorna o template HTML do header
   * @returns {string} Template HTML
   */
  getTemplate() {
    return `
      <div class="header-container">
        <div class="header-top">
          <div class="header-brand">
            <h1 class="header-title">
              <i class="fas fa-users"></i>
              Sistema de Clientes
            </h1>
            <p class="header-subtitle">Gerencie seus clientes de forma simples e eficiente</p>
          </div>
          
          <button class="nav-toggle" aria-label="Abrir menu" data-action="toggle-menu">
            <i class="fas fa-bars"></i>
          </button>
        </div>
        
        <nav class="header-nav" id="headerNav">
          <ul class="nav-list">
            <li>
              <a href="#home" class="nav-link nav-link--active" data-action="navigate" data-route="home">
                <i class="fas fa-home"></i>
                Home
              </a>
            </li>
            <li>
              <a href="#cadastro" class="nav-link" data-action="navigate" data-route="cadastro">
                <i class="fas fa-user-plus"></i>
                Cadastrar Cliente
              </a>
            </li>
            <li>
              <a href="#busca" class="nav-link" data-action="navigate" data-route="busca">
                <i class="fas fa-search"></i>
                Buscar Cliente
              </a>
            </li>
          </ul>
        </nav>
      </div>
    `;
  }

  /**
   * Configura os event listeners
   */
  setupEventListeners() {
    if (!this.element) return;

    // Botão toggle menu (mobile)
    const toggleBtn = this.element.querySelector('[data-action="toggle-menu"]');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.callbacks.onToggleMenu());
    }

    // Links de navegação
    const navLinks = this.element.querySelectorAll('[data-action="navigate"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.dataset.route;
        if (route) {
          this.callbacks.onNavigate(route);
        }
      });
    });
  }

  /**
   * Atualiza o link ativo no menu
   * @param {string} activeRoute Rota ativa
   */
  setActiveRoute(activeRoute) {
    if (!this.element) return;

    // Remove classe ativa de todos os links
    const navLinks = this.element.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('nav-link--active');
    });

    // Adiciona classe ativa no link correspondente
    const activeLink = this.element.querySelector(`[data-route="${activeRoute}"]`);
    if (activeLink) {
      activeLink.classList.add('nav-link--active');
    }
  }

  /**
   * Alterna o menu mobile
   */
  toggleMobileMenu() {
    if (!this.element) return;
    
    const nav = this.element.querySelector('#headerNav');
    if (nav) {
      nav.classList.toggle('header-nav--open');
      
      // Atualiza ícone do botão
      const toggleBtn = this.element.querySelector('[data-action="toggle-menu"]');
      if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          if (nav.classList.contains('header-nav--open')) {
            icon.className = 'fas fa-times';
          } else {
            icon.className = 'fas fa-bars';
          }
        }
      }
    }
  }

  /**
   * Configura callbacks da view
   * @param {Object} callbacks Callbacks para eventos
   */
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}