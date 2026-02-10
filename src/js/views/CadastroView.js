/**
 * View da Tela de Cadastro
 * Responsável por renderizar o formulário de cadastro
 */
export class CadastroView {
  constructor() {
    this.element = null;
    this.formElement = null;
    this.callbacks = {
      onBack: () => {},
      onSubmit: () => {},
      onReset: () => {}
    };
  }

  /**
   * Renderiza a view
   * @returns {HTMLElement} Elemento da view
   */
  render() {
    const view = document.createElement('section');
    view.className = 'view cadastro-view';
    view.id = 'cadastroView';
    view.innerHTML = this.getTemplate();
    
    this.element = view;
    this.formElement = view.querySelector('.form');
    this.setupEventListeners();
    
    return view;
  }

  /**
   * Retorna o template HTML da view
   * @returns {string} Template HTML
   */
  getTemplate() {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    return `
      <div class="view-container">
        <div class="card">
          <div class="card__header">
            <div class="card__icon-container">
              <i class="fas fa-user-plus card__icon"></i>
            </div>
            <h2 class="card__title">Cadastro de Cliente</h2>
            <p class="card__subtitle">Preencha os dados abaixo para cadastrar um novo cliente</p>
          </div>
          
          <div class="card__content">
            <form class="form">
              <div class="form__group">
                <label for="nome" class="form__label">
                  <i class="fas fa-user"></i>
                  Nome <span class="form__required">*</span>
                </label>
                <input type="text" id="nome" name="nome" class="form__input" placeholder="Digite o nome completo" required>
                <div class="form__error" id="nomeError"></div>
              </div>
              
              <div class="form__group">
                <label for="endereco" class="form__label">
                  <i class="fas fa-map-marker-alt"></i>
                  Endereço <span class="form__required">*</span>
                </label>
                <textarea id="endereco" name="endereco" class="form__textarea" rows="3" 
                          placeholder="Digite o endereço completo" required></textarea>
                <div class="form__error" id="enderecoError"></div>
              </div>
              
              <div class="form__group">
                <label for="telefone" class="form__label">
                  <i class="fas fa-phone"></i>
                  Telefone <span class="form__required">*</span>
                </label>
                <input type="tel" id="telefone" name="telefone" class="form__input" 
                       placeholder="(00) 00000-0000" required>
                <div class="form__error" id="telefoneError"></div>
              </div>
              
              <div class="form__group">
                <label for="cpf" class="form__label">
                  <i class="fas fa-id-card"></i>
                  CPF (Opcional)
                </label>
                <input type="text" id="cpf" name="cpf" class="form__input" placeholder="000.000.000-00">
                <div class="form__error" id="cpfError"></div>
              </div>
              
              <div class="form__group">
                <div class="form__info">
                  <i class="fas fa-calendar-alt"></i>
                  Data de criação: <span id="dataCriacao">${dataAtual}</span>
                </div>
              </div>
              
              <div class="form__actions">
                <button type="button" class="button button--secondary" data-action="back">
                  <i class="fas fa-arrow-left"></i>
                  Voltar
                </button>
                <button type="reset" class="button button--secondary">
                  <i class="fas fa-redo"></i>
                  Limpar
                </button>
                <button type="submit" class="button button--primary">
                  <i class="fas fa-check"></i>
                  Cadastrar Cliente
                </button>
              </div>
            </form>
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

    // Botão voltar
    const backButton = this.element.querySelector('[data-action="back"]');
    if (backButton) {
      backButton.addEventListener('click', () => this.callbacks.onBack());
    }

    // Formulário
    if (this.formElement) {
      this.formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = this.getFormData();
        this.callbacks.onSubmit(formData);
      });

      this.formElement.addEventListener('reset', () => {
        this.clearErrors();
        this.callbacks.onReset();
      });
    }
  }

  /**
   * Obtém os dados do formulário
   * @returns {Object} Dados do formulário
   */
  getFormData() {
    const formData = new FormData(this.formElement);
    return {
      nome: formData.get('nome') || '',
      endereco: formData.get('endereco') || '',
      telefone: formData.get('telefone') || '',
      cpf: formData.get('cpf') || ''
    };
  }

  /**
   * Limpa todos os erros do formulário
   */
  clearErrors() {
    const errorElements = this.element.querySelectorAll('.form__error');
    errorElements.forEach(element => {
      element.textContent = '';
      element.classList.remove('form__error--show');
    });
  }

  /**
   * Exibe erros no formulário
   * @param {Object} errors Objeto com erros
   */
  showErrors(errors) {
    this.clearErrors();
    
    for (const [field, message] of Object.entries(errors)) {
      const errorElement = this.element.querySelector(`#${field}Error`);
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('form__error--show');
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

  /**
   * Atualiza a data de criação
   */
  updateDataCriacao() {
    const dataElement = this.element?.querySelector('#dataCriacao');
    if (dataElement) {
      dataElement.textContent = new Date().toLocaleDateString('pt-BR');
    }
  }

  /**
   * Limpa o formulário
   */
  clearForm() {
    if (this.formElement) {
      this.formElement.reset();
      this.clearErrors();
      this.updateDataCriacao();
    }
  }
}