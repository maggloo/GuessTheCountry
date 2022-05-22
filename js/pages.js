const Login = {
    id: "login",
    title: "Регистрация и Вход",
    render: (customClass = "") => { 
        return ` 
        <div class="login-page">      
            <div class="form hidden">       
                <form class="register-form">
                    <p class="form-name">Регистрация</p>
                    <input id="signup-name"type="text" placeholder="Логин"/>
                    <input id="signup-email" type="text" placeholder="Email"/>
                    <input id="signup-password" type="password" placeholder="Пароль"/>
                    <button class="btn-create-user" id="create-user">Зарегистрироваться</button>
                    <p class="message">Уже есть аккаунт? <a href="#" class="sign-in">Войти</a></p>
                    <span class="alert" style="color: red"></span>
                </form>
            </div> 
            <div class="form visible"> 
                <form class="login-form">
                <p class="form-name">Войти</p>
                <input id="login-email" type="text" placeholder="Email"/>
                <input id="login-password" type="password" placeholder="Пароль"/>          
                <button class="btn-login-user" id="login-user">Войти</button>
                <p class="message">Нет аккаунта? <a href="#" class="log-in">Зарегистрироваться</a></p>
                <span class="alert" style="color: red"></span>
                </form>
                </div>
            </div>
      </div>
      `
    }
};

const Menu = { 
  id: "menu",
  title: "Меню",
  render: (customClass = "") => {
       
  return `
  <div class="menu-page"> 
    <h2 id="hi-name">Добро пожаловать</h2>
    <div class="menu-list">
        <div class="mode-type">
            <div>
                <img src="img/compass-svgrepo-com.svg" alt="Страны">
                <div><a href="#region" class="mainmenu__link">Страны</a></div>
            </div>
            <div>
                <img src="img/flag-svgrepo-com.svg" alt="Флаги">
                <div><a href="#flgregion" class="mainmenu__link">Флаги</a></div>
            </div>
        </div>
        <div class="mode-type">
            <div>
                <img src="img/settings-gear-svgrepo-com.svg" alt="Опции">
                <div><a href="#options" class="mainmenu__link">Опции</a></div>
            </div>
            <div>
                <img src="img/trophy-award-svgrepo-com.svg" alt="Рекорды">
                <div><a href="#records" class="mainmenu__link">Рекорды</a></div>
            </div>
        </div>
    </div>   
  </div>
  `
  }
};

const Records = {
    id: "records",
    title: "Рекорды",
    render: (customClass = "") => {
       
        return `
        <div class="records-page">
            
            <label for="maps-select" id="mode-name" class="maps">Карты</label> 
            <select id="maps-select">
                <option value="get-world">Весь мир</option>
                <option value="get-europe">Европа</option>
                <option value="get-ncAmerica">Северная и Центральная Америка</option>
                <option value="get-sAmerica">Южная Америка</option>
                <option value="get-africa">Африка</option>
                <option value="get-asia">Азия</option>
                <option value="get-oceania">Австралия и Океания</option>
            </select>
            
                <table class="table">
                    <tbody id="result-list">
                       
                    </tbody>
                  </table>
                <button id="change-type">Флаги</button>
        </div>
        `
    }
};

const Options = { 
  id: "options",
  title: "Опции",
  render: (customClass = "") => {
       
  return `
  <div class="options-page"> 
  <h2>Опции</h2>
  <div class="options-list">
      <div class="opt">
          <img src="img/music-svgrepo-com.svg" alt="Музыка">
          <div>Музыка</div>
          <div class="options-switch">
            <label class="switch">
            <input type="checkbox" id="checkMusic">
            <span class="slider round"  ></span>
            </label>
          </div>
      </div>
      <div class="opt">
          <img src="img/speakers-speaker-svgrepo-com.svg" alt="Звуки">
          <div>Звуки</div>
          <div class="options-switch">
            <label class="switch" >
            <input type="checkbox" id="checkSounds">
            <span class="slider round"></span>
            </label>
          </div>
      </div>
      <div id="about-btn" class="opt">
          <img src="img/information-info-svgrepo-com.svg" alt="Как играть?">
          <div><a href="#" id="about-more">Как играть?</a></div>                               
      </div>
      <div class="about-game wrap">
        <div> Выберите на карте/в поле с флагами запрашиваемую страну или флаг. Если вы нашли нужную страну с 1-2 раза, вы получаете максимально возможное количество очков, а правильно угаданная страна или флаг окрашивается в <span style="color:green"><b>зеленый</b></span> цвет. Если вы указали нужную страну/флаг с 3-4 попытки, то вы получаете в два раза меньше очков, а этот элемент окрашивается в <span style="color:rgb(224, 195, 3)"><b>желтый</b></span> цвет. Если же найти страну у вас получилось только с 5 попыток (и больше), то вы не получите баллы, элемент окрасится в <span style="color:red"><b>красный</b></span>, а после 5 попытки вам будет дана подсказка. Максимальное возможное количество баллов - <b>400</b>. Удачи! </div>      
      </div>
    </div>   
</div>
  `
  }
};

const Region = { 
  id: "region",
  title: "Регион",
  render: (customClass = "") => {
       
  return `
  <div class="regions-page"> 
        <h2>Выберите регион</h2>
        <div class="regions-list">
            <div class="world-row">
                <div>
                    <a href="#game"><img id="get-world" class="get-map" src="img/regions/world.png" alt="Мир"></a>
                    <h3>Мир</h3>
                    <p>Здесь вы сможете найти все страны мира (193 государств-членов ООН) в одной викторине!</p>
                </div>
            </div>
            <div class="top-row">    
                <div>
                    <a href="#game"><img  id="get-europe" class="get-map" src="img/regions/europe2.png" alt="Европа"></a>
                    <h3>Европа</h3>
                    <p>Франция и Германия, Чехия, Черногория и Андорра. Найдите их все!</p>               
                </div>
                <div>
                    <a href="#game"><img id="get-ncAmerica" class="get-map" src="img/regions/north-america.png" alt="Северная и Центральная Америка"></a>
                    <h3>Северная и Центральная Америка</h3>
                    <p>США и Канаду найти легко, но что насчет Гватемалы и Белиза? Тренируйтесь здесь!</p>
                </div>
                <div>
                    <a href="#game"><img  id="get-sAmerica" class="get-map" src="img/regions/south-america.png" alt="Южная Америка"></a>
                    <h3>Южная Америка</h3>
                    <p>Найдите Бразилию, Чили, Венесуэлу и другие страны Южной Америки на карте.</p>
                </div>
            </div>
            <div class="bottom-row">
                <div>
                    <a href="#game"><img id="get-africa" class="get-map" src="img/regions/africa.png" alt="Африка"></a>
                    <h3>Африка</h3>
                    <p>Нигерия и Кения, Южная Африка, Алжир и Марокко. Сможете их найти?</p>
                </div>
                <div>
                    <a href="#game"><img id="get-asia" class="get-map" src="img/regions/asia.png" alt="Азия"></a>
                    <h3>Азия</h3>
                    <p>Где находится Непал? Научитесь находить многочисленные страны Азии.</p>
                </div> 
                <div>
                    <a href="#game" ><img id="get-oceania" class="get-map" src="img/regions/australia.png" alt="Австралия и Океания"></a>
                    <h3>Австралия и Океания</h3>
                    <p>Покажите где находится Австралия, Новая Зеландия и все крошечные страны Океании!</p>
                </div> 
            </div>
            
        </div>   
    </div>
  `
  }
};

const FlgRegions = { 
    id: "flgregion",
    title: "Флаги",
    render: (customClass = "") => {
         
    return `
    <div class="regions-page"> 
          <h2>Выберите регион</h2>
          <div class="regions-list">
              <div class="world-row">
                  <div>
                      <a href="#flags"><img id="get-world" class="get-flag" src="img/regions/world.png" alt="Мир"></a>
                      <h3>Флаги стран мира</h3>
                      <p>Здесь вы можете найти флаги всех стран мира! (193 государства-члена ООН)</p>
                  </div>
              </div>
              <div class="top-row">    
                  <div>
                      <a href="#flags"><img  id="get-europe" class="get-flag" src="img/regions/europe2.png" alt="Европа"></a>
                      <h3>Флаги Европейских стран </h3>
                      <p> Знаете ли вы, как выглядит флаг Андорры? А Монако? </p>               
                  </div>
                  <div>
                      <a href="#flags"><img id="get-ncAmerica" class="get-flag" src="img/regions/north-america.png" alt="Северная и Ценральная Америка"></a>
                      <h3> Флаги стран Северной и Центральной Америки</h3>
                      <p> Все знают, как выглядит флаг США, но что насчет Гватемалы и Белиза? </p>
                  </div>
                  <div>
                      <a href="#flags"><img  id="get-sAmerica" class="get-flag" src="img/regions/south-america.png" alt="Южная Америка"></a>
                      <h3> Флаги стран Южной Америки</h3>
                      <p>Найдите флаги Бразилии, Чили, Венесуэлы и других стран Южной Америки.</p>
                  </div>
              </div>
              <div class="bottom-row">
                  <div>
                      <a href="#flags"><img id="get-africa" class="get-flag" src="img/regions/africa.png" alt="Африка"></a>
                      <h3>Флаги стран Африки</h3>
                      <p>Здесь найдутся флаги Нигерии и Кении, Южной Африки, Алжира, Марокко...</p>
                  </div>
                  <div>
                      <a href="#flags"><img id="get-asia" class="get-flag" src="img/regions/asia.png" alt="Азия"></a>
                      <h3>Флаги стран Азии</h3>
                      <p>Как выглядит флаг Непала? Узнайте здесь!</p>
                  </div> 
                  <div>
                      <a href="#flags" ><img id="get-oceania" class="get-flag" src="img/regions/australia.png" alt="Австралия и Океания"></a>
                      <h3>Флаги Австралии и Океании</h3>
                      <p>Здесь вы найдете флаги Австралии, Новой Зеландии и всех крошечных стран Океании!</p>
                  </div> 
              </div>      
          </div>   
      </div>
    `
    }
  };

const Game = {
    id: "game",
    title: "Игра", 

    render: (customClass = "") => {      
        return `
        <div class="game-page"> 
            <h2 id="region-name" class="info"></h2>
            <div class="gameplay">
                <div>
                    <p class="info" id="country-list">Список стран: </p>
                </div> 
                <div class="map-window">
                    <p class="info" id="country-find"></p>  
                    <p class="info">Ваш счет: <span id="score" class="maps">0</span></p>             
                    <div class="current-country info"></div>
                    <div id="chartdiv" class="map"></div> 
                </div> 
            </div>
        </div> 
        `
    },
}

const Flags = {
    id: "flags",
    title: "Флаги",

    render: (customClass = "") => {      
        return `
        <div class="game-page"> 
            <h2 id="region-name" class="info"></h2>
            <div class="gameplay">
                <div>
                    <p id="country-list" class="info">Список стран: </p>
                </div> 
                <div class="map-window">
                    <p id="country-find" class="info"></p>
                    <p class="info">Ваш счет: <span id="score" class="flags">0</span></p>    
                    <p class="current-country info"></p>
                    <div id="chartdiv"></div> 
                </div> 
            </div>
        </div> 
        `
    },
}

const ErrorPage = {
    id: "error",
    title: "Achtung, warning, kujdes, attenzione, pozornost...",
    render: (className = "container", ...rest) => {
      return `
      
        <section class="error-page">
          <h1>Ошибка 404</h1>
          <p>Страница не найдена.</p>
          <p>Попробуйте <a href="#login">войти</a></p>
        </section>
      `;
    }
  };
  
  
  
