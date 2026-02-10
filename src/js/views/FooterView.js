/**
 * View do Footer
 * Responsável por renderizar o footer da aplicação
 */
export class FooterView {
  constructor() {
    this.element = null;
  }

  /**
   * Renderiza o footer
   * @returns {HTMLElement} Elemento do footer
   */
  render() {
    const footer = document.createElement('footer');
    footer.className = 'app-footer';
    footer.innerHTML = this.getTemplate();
    
    this.element = footer;
    this.updateCurrentYear();
    
    return footer;
  }

  /**
   * Retorna o template HTML do footer
   * @returns {string} Template HTML
   */
  getTemplate() {
    return `
      <div class="footer-container">
        <p class="footer-text">
          Sistema de Clientes &copy; <span id="currentYear">2024</span>
        </p>
        <p class="footer-info">
          <i class="fas fa-database"></i>
          <span id="clientesCount">0</span> clientes cadastrados
        </p>
      </div>
    `;
  }

  /**
   * Atualiza o ano atual
   */
  updateCurrentYear() {
    if (!this.element) return;
    
    const yearElement = this.element.querySelector('#currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Atualiza o contador de clientes
   * @param {number} count Número de clientes
   */
  updateClientesCount(count) {
    if (!this.element) return;
    
    const countElement = this.element.querySelector('#clientesCount');
    if (countElement) {
      countElement.textContent = count;
    }
  }
}