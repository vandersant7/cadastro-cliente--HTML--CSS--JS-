# Sistema de Cadastro e Busca de Clientes

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg)
![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg)
![Architecture](https://img.shields.io/badge/Architecture-MVC-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Um sistema completo para gerenciamento de clientes desenvolvido com tecnologias web puras (HTML, CSS e JavaScript), implementando arquitetura modular inspirada em MVC e navegação SPA (Single Page Application).

## 🎯 Visão Geral

Este projeto é uma aplicação web moderna para cadastro e busca de clientes, desenvolvida com foco em **boas práticas de desenvolvimento**, **organização de código** e **escalabilidade**. O sistema demonstra como estruturar projetos frontend complexos sem a necessidade de frameworks externos, utilizando apenas JavaScript puro.

**Ideal para:**
- Estudos de arquitetura frontend
- Portfólio de desenvolvimento
- Base para projetos maiores
- Aprendizado de padrões de design e organização de código

## ✨ Funcionalidades

### 📝 Cadastro de Clientes
- Formulário com validação em tempo real
- Campos: Nome, Endereço, Telefone, CPF (opcional)
- Data de criação automática
- Validações específicas para cada campo
- Feedback visual para erros e sucesso

### 🔍 Busca de Clientes
- Busca em tempo real
- Filtros por: Nome, Telefone, CPF ou "Todos os campos"
- Destaque do termo buscado nos resultados
- Cards detalhados com todas as informações
- Limpeza fácil dos resultados

### 🚀 Navegação e Interface
- **Navegação SPA** (Single Page Application) sem recarregamentos
- Header com menu de navegação responsivo
- Footer com informações dinâmicas
- Layout em cards com sombreamento e efeitos visuais
- Interface totalmente responsiva (mobile-first)
- Modal de confirmação para ações importantes

### 💾 Persistência de Dados
- Armazenamento local via `localStorage`
- Dados mantidos entre sessões do navegador
- Contador automático de clientes cadastrados

## 📁 Estrutura de Pastas

```
project/
├── index.html
├── README.md
└── src/
    ├── css/
    │   ├── base.css          # Reset, variáveis, estilos globais
    │   ├── layout.css        # Estrutura da página
    │   ├── components.css    # Componentes reutilizáveis
    │   └── additional.css    # Estilos específicos
    │
    └── js/
        ├── models/
        │   └── ClienteModel.js      # Modelo de dados do cliente
        │
        ├── views/
        │   ├── HeaderView.js        # Componente de header
        │   ├── FooterView.js        # Componente de footer
        │   ├── HomeView.js          # Tela inicial
        │   ├── CadastroView.js      # Tela de cadastro
        │   └── BuscaView.js         # Tela de busca
        │
        ├── controllers/
        │   ├── ClienteController.js # Lógica de negócio
        │   └── Router.js            # Gerenciador de rotas SPA
        │
        ├── services/
        │   ├── StorageService.js    # Serviço de persistência
        │   └── ValidationService.js # Serviço de validação
        │
        └── app.js                   # Ponto de entrada da aplicação
```

## 🏗️ Arquitetura MVC

O projeto implementa uma arquitetura modular inspirada no padrão **Model-View-Controller (MVC)**, adaptada para o frontend:

### **Models**
- `ClienteModel.js`: Define a estrutura de dados do cliente, com métodos para formatação e serialização
- Responsável pelas regras de negócio relacionadas aos dados

### **Views**
- `HeaderView.js`, `FooterView.js`: Componentes reutilizáveis
- `HomeView.js`, `CadastroView.js`, `BuscaView.js`: Telas da aplicação
- Apenas renderização HTML e captura de eventos
- Sem lógica de negócio

### **Controllers**
- `ClienteController.js`: Orquestra a comunicação entre Model e View
- `Router.js`: Gerencia a navegação SPA e transição entre views
- Responsável pelo fluxo da aplicação

### **Services**
- `StorageService.js`: Abstrai o acesso ao `localStorage`
- `ValidationService.js`: Centraliza as regras de validação
- Serviços reutilizáveis e desacoplados

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Navegador web moderno (Chrome 90+, Firefox 88+, Edge 90+)
- Editor de código (VS Code, Sublime, etc.)
- Servidor local (opcional, mas recomendado)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/vandersant7/sistema-clientes-mvc.git
   cd sistema-clientes-mvc
   ```

2. **Execute o projeto**
   - **Opção A:** Abra diretamente o arquivo `index.html` no navegador
   - **Opção B (recomendada):** Use um servidor local:
     ```bash
     # Com Python
     python -m http.server 8000
     
     # Com Node.js
     npx serve .
     
     # Com PHP
     php -S localhost:8000
     ```

3. **Acesse no navegador**
   - Abra: `http://localhost:8000` (ou a porta configurada)
   - O sistema estará pronto para uso!

### ⚠️ Observação Importante
O projeto **não requer backend** - todos os dados são armazenados localmente no navegador do usuário.

## 🏆 Boas Práticas Adotadas

### 📚 Modularização
- **ES Modules**: Uso de `import/export` para organização
- **Separação de responsabilidades**: Cada arquivo com uma única responsabilidade
- **Código reutilizável**: Serviços e componentes compartilhados

### 🎨 CSS Organizado
- **Variáveis CSS** para cores, espaçamentos e sombras
- **Metodologia BEM** para nomenclatura de classes
- **Arquivos separados** por responsabilidade
- **Design responsivo** com abordagem mobile-first

### ⚡ JavaScript Limpo
- **Nomes semânticos** para variáveis e funções
- **Funções pequenas e focadas**
- **Tratamento de erros** adequado
- **Comentários apenas quando necessário**

### 🔧 Padrões de Projeto
- **MVC adaptado** para frontend
- **SPA Router** próprio e leve
- **Event delegation** para melhor performance
- **StorageService** abstraindo a persistência

## 🤝 Contribuição

Contribuições são bem-vindas! Este projeto é open source e pode ser usado como base para estudos e projetos pessoais.

### Como contribuir:

1. **Faça um fork** do projeto
2. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Commit suas mudanças** seguindo o padrão Conventional Commits:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```
4. **Push para a branch**:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. **Abra um Pull Request**

### Padrão de Commits
Utilize **Conventional Commits**:
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `refactor:` Refatoração de código
- `docs:` Documentação
- `style:` Formatação de código

## 👤 Autor

**Vandersant7** - [GitHub](https://github.com/vandersant7)

Desenvolvedor fullstack com foco em boas práticas, arquitetura de software e projetos bem estruturados.

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📞 Suporte

- **Issues**: Reporte problemas [aqui](https://github.com/vandersant7/sistema-clientes-mvc/issues)
- **Sugestões**: Contribua com ideias e melhorias
- **Estudos**: Use como referência para seus projetos

## 🚀 Próximos Passos Possíveis

O projeto pode ser expandido com:
- [ ] Testes unitários com Jest
- [ ] Deploy em GitHub Pages ou Netlify
- [ ] Exportação de dados para CSV/Excel
- [ ] Sistema de login e múltiplos usuários
- [ ] Integração com API REST externa

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela no repositório!**