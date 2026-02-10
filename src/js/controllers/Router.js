/**
 * Router - Gerencia navegação SPA
 */
export class Router {
  constructor(routes = {}) {
    this.routes = routes;
    this.currentRoute = null;
    this.mainElement = null;
  }

  /**
   * Inicializa o router
   * @param {HTMLElement} mainElement Elemento principal onde as views serão renderizadas
   */
  init(mainElement) {
    this.mainElement = mainElement;
    this.setupGlobalListeners();
    
    // Rota inicial
    this.navigateTo('home');
  }

  /**
   * Configura listeners globais para navegação
   */
  setupGlobalListeners() {
    // Delegation para botões com data-action="navigate"
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-action="navigate"]');
      if (button) {
        e.preventDefault();
        const route = button.dataset.route;
        if (route) {
          this.navigateTo(route);
        }
      }
    });

    // Manipula o botão voltar do navegador
    window.addEventListener('popstate', () => {
      const route = window.location.hash.replace('#', '') || 'home';
      this.navigateTo(route, false);
    });
  }

  /**
   * Navega para uma rota
   * @param {string} routeName Nome da rota
   * @param {boolean} updateHistory Se deve atualizar o histórico
   */
  async navigateTo(routeName, updateHistory = true) {
    // Verifica se a rota existe
    const route = this.routes[routeName];
    if (!route) {
      console.error(`Rota "${routeName}" não encontrada`);
      return;
    }

    // Evita navegação redundante
    if (this.currentRoute === routeName) return;

    // Atualiza histórico se necessário
    if (updateHistory) {
      window.history.pushState({ route: routeName }, '', `#${routeName}`);
    }

    // Limpa o conteúdo atual
    if (this.mainElement) {
      this.mainElement.innerHTML = '';
    }

    // Obtém a view da rota
    const view = route.view;
    if (view && typeof view.render === 'function') {
      const viewElement = await view.render();
      if (this.mainElement) {
        this.mainElement.appendChild(viewElement);
      }
      
      // Atualiza classe ativa
      this.updateActiveView(routeName);
      
      // Executa callback de ativação
      if (typeof route.onActivate === 'function') {
        route.onActivate();
      }
    }

    this.currentRoute = routeName;
  }

  /**
   * Atualiza a classe ativa nas views
   * @param {string} activeRoute Rota ativa
   */
  updateActiveView(activeRoute) {
    // Remove classe ativa de todas as views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('view--active');
    });

    // Adiciona classe ativa na view atual
    const activeView = document.getElementById(`${activeRoute}View`);
    if (activeView) {
      activeView.classList.add('view--active');
    }
  }

  /**
   * Adiciona uma rota
   * @param {string} name Nome da rota
   * @param {Object} config Configuração da rota
   */
  addRoute(name, config) {
    this.routes[name] = config;
  }

  /**
   * Obtém a rota atual
   * @returns {string} Nome da rota atual
   */
  getCurrentRoute() {
    return this.currentRoute;
  }
}