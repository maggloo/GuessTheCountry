const Header = {
    render: (customClass = "") => {
      return `
        <header class="header ${customClass}" id="header">
          <div id="nav-menu">
            <a href="#menu" title="Вернуться в меню"><img src="img/home.svg" alt="Меню"></a>
            <a href="#" title="Разлогиниться"><img src="img/logoff.svg" class="log-out" alt="Выйти"></a>
          </div>
        </header>
      `;
    }
  };

  const Content = {
    render: (customClass = "") => {
      return `<div class="content ${customClass}" id="content"></div>`;
    }
  };
