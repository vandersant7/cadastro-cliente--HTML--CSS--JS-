/**
 * View da Tela Inicial
 * Responsável por renderizar a interface da home
 */
export class HomeView {
  constructor() {
    this.element = null;
  }

  /**
   * Renderiza a view
   * @returns {HTMLElement} Elemento da view
   */
  render() {
    const view = document.createElement('section');
    view.className = 'view home-view';
    view.id = 'homeView';
    view.innerHTML = this.getTemplate();
    this.element = view;
    return view;
  }

  /**
   * Retorna o template HTML da view
   * @returns {string} Template HTML
   */
  getTemplate() {
    return `
      <div class="view-container">
        <div class="home-view__cards">
          <div class="card">
            <div class="card__header">
              <div class="card__icon-container">
                <i class="fas fa-user-plus card__icon"></i>
              </div>
              <h2 class="card__title">Cadastrar Cliente</h2>
              <p class="card__subtitle">Adicione novos clientes ao sistema com informações completas</p>
            </div>
            <div class="card__content">
              <p class="card__description">Preencha o formulário com dados do cliente para cadastro no sistema.</p>
              <button class="button button--primary" data-action="navigate" data-route="cadastro" style="width: 100%;">
                <i class="fas fa-plus"></i>
                Acessar Cadastro
              </button>
            </div>
          </div>
          
          <div class="card">
            <div class="card__header">
              <div class="card__icon-container">
                <i class="fas fa-search card__icon"></i>
              </div>
              <h2 class="card__title">Buscar Cliente</h2>
              <p class="card__subtitle">Localize clientes cadastrados por nome, CPF ou telefone</p>
            </div>
            <div class="card__content">
              <p class="card__description">Utilize nossa ferramenta de busca para encontrar clientes rapidamente.</p>
              <button class="button button--secondary" data-action="navigate" data-route="busca" style="width: 100%;">
                <i class="fas fa-search"></i>
                Acessar Busca
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Atualiza a view
   */
  update() {
    if (this.element) {
      this.element.innerHTML = this.getTemplate();
    }
  }
}