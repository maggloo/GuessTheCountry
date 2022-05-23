function ModuleView() {
    let that = this;
    let myModuleContainer = null;
    let contentContainer = null;
    let routesObj = null;
    let routeName = null;

    let countryListContainer = null;
    let countryFindContainer = null;
    let showElement = null;
    let scoreContainer = null;

    let root = null;
    let chart = null;
    let hourglassanimation = null;
    let indicator = null;
    let region_list = null;
    let listOfNamesInRussian = null;
    let regionsObject = null;
    let randomCnt = null;
    let counter = 0;
    let currentUserName = 'user';    
    let score = 0;    
    let permitSounds = null;
    let music =  new Audio("audio/backgroundMusic.mp3");
    let sounds = {
        click: new Audio('audio/clicking.mp3'),
        correct: new Audio('audio/correct.mp3'),
        hint: new Audio('audio/hint.mp3'),
    };

    this.init = function(container, routes) {
      myModuleContainer = container;
      routesObj = routes;
      menu = myModuleContainer.querySelector(".menu-list");
      contentContainer = myModuleContainer.querySelector("#content");
    }

    this.renderContent = function(hashPageName) {
      routeName = "login";

      if (hashPageName.length > 0) {    
          routeName = hashPageName in routes? hashPageName : "error";
          window.location.hash = `#${hashPageName}`;        
      } 

        window.document.title = routesObj[routeName].title;
        contentContainer.innerHTML = routesObj[routeName].render();

      this.showBtns()

      if (routeName === "game") {
        this.initializeMap()
      }
      if (routeName === "menu") {
        this.sayHi(currentUserName);
      }
      if (routeName === "login" || routeName === "error" ) {
        this.hideBtns();
      }
    
    }

    this.showBtns = function() {     
      let menu = myModuleContainer.querySelector("#nav-menu");
      menu.classList.remove("hidden")
    }
 
    this.hideBtns = function() {         //прячем навигацию если открыта стр логина
      let menu = myModuleContainer.querySelector("#nav-menu");
      menu.classList.add("hidden")
    }

    this.sayHi = function(userName) {
      contentContainer.querySelector('#hi-name').innerHTML = `Добро пожаловать, ${currentUserName}`;
    }
    
    this.printUsers = function(userList) {        //отображение таблицы на стр рекордов
      let userListContainer = document.querySelector('#result-list');
      userListContainer.innerHTML = '';

      if (userList){
        for (let user in userList) {
          userListContainer.append(createTable(user, userList));
        } 

        function createTable(user, userList) {
          
          let row = document.createElement('tr'),
              td1 = document.createElement('td'),
              td2 = document.createElement('td'),
              td3 = document.createElement('td');
          row.setAttribute('data-id', user);
          td1.innerHTML = `<strong>${user}</strong>`;
          td2.innerHTML = `${userList[user]}`;
          td3.innerHTML = `<a href="#" class="delete-user"> Удалить </a>`;
          row.append(td1, td2, td3);

          return row;
        }
      } 
    }

    this.setUserName = function(name) {
      currentUserName = name;
    }

    this.playMusic = function(state) {
      if (state) {
          music.play();
          music.loop = true;
          music.autoplay = true;
          music.muted = false;        
      } else if (!state){
        music.muted = true;
        music.pause();
      }      
    }

    this.playAudio = function(state) {
      if (state){      
        permitSounds = true;
      } else if (!state) {
        permitSounds = false;
      }
    }

    this.playSound = function(sound) {
      if (permitSounds) {
        switch (sound) {
          case 'click':
            sounds.click.currentTime = 0;
            sounds.click.play();
              break;
          case 'correct':
            sounds.correct.currentTime = 0;
            sounds.correct.play();
              break;
          case 'hint':
            sounds.hint.currentTime = 0;
            sounds.hint.play();
              break;
        }
      }
    }

    this.toggleState = function(sounds, music) {    //отобразить актуальные положения свитчеров в опциях
      let musicToggle = document.getElementById('checkMusic');
      musicToggle.checked = music.checkMusic;
 
      let soundsToggle = document.getElementById('checkSounds');
      soundsToggle.checked = sounds.checkSounds;
    }

    this.toggleAbout = function() {       //скрыть/открыть в опциях инфу об игре
      let readMore = contentContainer.querySelector(".about-game");
      readMore.classList.toggle('hidden');     
    }
    
    this.changeMode = function(newButton, newClassName, classTextContent) {   //изменить значения селекта и кнопки на стр рекордов
      let button = contentContainer.querySelector("#change-type");
      let className = contentContainer.querySelector('#mode-name');

      button.textContent = newButton;
      className.className = newClassName;
      className.textContent = classTextContent;      
    }

    this.swithForm = function() {        //поменять форму регистрации/логина
      myModuleContainer.querySelectorAll('.alert').forEach(alert => alert.textContent = '');
      myModuleContainer.querySelectorAll('.form').forEach(form =>  form.classList.toggle('hidden'));
    }

    this.showAlert = function(message) {      //показать при регистрации/логине ошибку входа
      myModuleContainer.querySelectorAll('.alert').forEach(alert => alert.textContent = message);
    }

    this.showCurrentName = function(id) {       //показать название страны по каждому клику
      showElement = contentContainer.querySelector(".current-country");
      const found = regionsObject.find(element => {
        return element.alpha2 === id.toLowerCase();   //возвращает объект страны 
      });
      showElement.innerHTML = `<strong>${found.name}</strong>`;
    }

    this.getFlags = function(regionCodes, namesInRussian, name, regionsObjArray) {
      score = 0;
      counter = 0;
      region_list = regionCodes;
      listOfNamesInRussian = namesInRussian;
      regionsObject = regionsObjArray;
      scoreContainer = myModuleContainer.querySelector("#score"); 
      let flagsContainer = contentContainer.querySelector('#chartdiv');
      countryListContainer = myModuleContainer.querySelector("#country-list");
      countryFindContainer = myModuleContainer.querySelector("#country-find"); 
      this.showCountryList(name);
      flagsContainer.style.height = 'auto';
      flagsContainer.style.padding = '2%';
      flagsContainer.style.textAlign = 'center';
      randomCnt = this.getRandomCountry();    //получаем рандомную страну при первой загрузке

      (() => {        //подгрузка флагов
        for (let i = 0; i <  region_list.length; i++) {
            const img = new Image();
              img.src = `https://cdn.jsdelivr.net/npm/world_countries_lists@2.5.1/data/flags/128x128/${region_list[i].toLowerCase()}.png`;
              img.classList.add("flag-img");
              img.id = `${region_list[i]}`;
              flagsContainer.append(img);
        }
      })();
    }

    this.checkFlag = function(id) {     
      this.showAlert("");
      let imgs = myModuleContainer.querySelectorAll(`.flag-img`); 
      flagImg =  myModuleContainer.querySelector(`#${id}`);     //конкретный выбранный флаг

      this.showCurrentName(id);    //на каждый клик отображаем название страны, по которой кликнули

      if (counter === 4) {    //анимация флага нужной страны спустя 5 кликов
        imgs.forEach(element => {
          if (element.id === randomCnt) {
            element.style.animation = "hint 0.5s linear alternate-reverse infinite";
          }
        });
        this.playSound('hint');
      }

        if (randomCnt === id) {            //логика если код флага по которому нажали совпадает с кодом нужной страны
          if (counter < 2) {
            flagImg.style.backgroundColor = "green";  
            score = score + 400 / listOfNamesInRussian.length;        
            this.updateScore(score); 
            counter = 0;
          } else if (counter < 4) {      
            flagImg.style.backgroundColor = "yellow"; 
            score = score + (400 / listOfNamesInRussian.length) / 2;
            this.updateScore(score); 
            counter = 0;
          } else {     
            flagImg.style.animation = 'none';
            flagImg.style.backgroundColor = "red"; 
            counter = 0;
          }
          flagImg.style.opacity = "0.3"; 
          this.playSound('correct');
                  
          this.deleteCountryFromList();  //удалить страну, которая уже была загадана
      
          if (region_list.length) {
            randomCnt = that.getRandomCountry();      // получаем рандомную страну и отображаем
          } else {
            this.showGameOver();
          }         
                 
        } else {      
          if (region_list.includes(id)) {
            counter++;                  
          }        
        }      
    }

    this.showCountryList = function(name) {       //отображение названия региона и списка стран на русском
      myModuleContainer.querySelector("#region-name").innerHTML = `${name}`;
      countryListContainer.innerHTML = `Список стран: ${listOfNamesInRussian.join(", ")} <i>(${listOfNamesInRussian.length})</i>`;   
    }

    this.showGameOver = function() {
      showElement.innerHTML =  `<strong>Вы нашли все страны!</strong>`;
    }

    this.initializeMap = function() {  
      let element = contentContainer.querySelector('#chartdiv');
      countryListContainer = contentContainer.querySelector("#country-list");
      countryFindContainer = contentContainer.querySelector("#country-find"); 
      scoreContainer = contentContainer.querySelector("#score"); 
      root = am5.Root.new(element);   //создать корень карты
      
      indicator = root.container.children.push(am5.Container.new(root, {  //лоадер при загрузке карты
        width: am5.p100,
        height: am5.p100,
        layer: 1000,
        background: am5.Rectangle.new(root, {
          fill: am5.color(0xffffff),
          fillOpacity: 0.7
        })
      }));

      indicator.children.push(am5.Label.new(root, {
        text: "Загрузка карты...",
        fontSize: 25,
        x: am5.p50,
        y: am5.p50,
        centerX: am5.p50,
        centerY: am5.p50
      }));

      let hourglass = indicator.children.push(am5.Graphics.new(root, {
        width: 32,
        height: 32,
        fill: am5.color(0x000000),
        x: am5.p50,
        y: am5.p50,
        centerX: am5.p50,
        centerY: am5.p50,
        dy: -45,
        svgPath: "M12 5v10l9 9-9 9v10h24V33l-9-9 9-9V5H12zm20 29v5H16v-5l8-8 8 8zm-8-12-8-8V9h16v5l-8 8z"
      }));

      hourglassanimation = hourglass.animate({
        key: "rotation",
        to: 180,
        loops: Infinity,
        duration: 200,
        easing: am5.ease.inOut(am5.ease.cubic)
      });

      hourglassanimation.play();
      indicator.show();
    }

    this.getMap = function(regionData, regionCodes, difference, namesInRussian, regionsObjArray) {
      score = 0;
      counter = 0;
      region_list = regionCodes;
      listOfNamesInRussian = namesInRussian;
      regionsObject = regionsObjArray;

      chart = root.container.children.push(       //построить отображение карты
        am5map.MapChart.new(root, {
          panX: "rotateX",
          projection:	am5map.geoMercator(),
          wheelY: "zoom",
          minZoomLevel: 1,
          zoomStep: 1.2,
          homeGeoPoint: regionData.homePoint,
        })
      );     

      const WorldSeriesSettings = {
        geoJSON: am5geodata_worldLow,
        geodataNames: am5geodata_lang_RU,
        exclude: region_list + ["AQ"],
        stroke: am5.color(0xffffff),
        fill: am5.color(0xffffff),
        templateField: "polygonSettings"
      }

      const WorldDifference = {
        geoJSON: am5geodata_worldUltra,
        include: difference,
        exclude: ["AQ"],
        stroke: am5.color(0xffffff),
      }

      const RegionSeriesSettings = {
        geoJSON: am5geodata_worldUltra,
        geodataNames: am5geodata_lang_RU,
        include: region_list,
        exclude: ["AQ"],
        stroke: am5.color(0xffffff),
        templateField: "polygonSettings"
      }

      chart.chartContainer.set("background", am5.Rectangle.new(root, {
        fill: am5.color(0xd4f1f9),
        fillOpacity: 1
      }));
    
      // Create root and chart
      let worldSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, WorldSeriesSettings)
      );

      worldSeries.events.on("datavalidated", function() {    
        chart.goHome();
        hourglassanimation.pause();
        indicator.hide();    //прячем и останавливаем анимацию лоадера
      });
      
      let regionSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, RegionSeriesSettings)
      );

      let different = chart.series.push(
        am5map.MapPolygonSeries.new(root, WorldDifference)
      );


    regionSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x89b3f5)
    });

    regionSeries.mapPolygons.template.states.create("highlightGreen", {
      fill: am5.color(0x1b7d10)
    });

    regionSeries.mapPolygons.template.states.create("highlightYellow", {
      fill: am5.color(0xf7f723)
    });

    regionSeries.mapPolygons.template.states.create("highlightRed", {
      fill: am5.color(0xe01212)
    });

    setTimeout (() => {    
        this.showCountryList(regionData.name);   
        randomCnt = that.getRandomCountry();
    }, 100);

    let timer;
    let eArray = regionSeries.mapPolygons.template._entities; 
    let timer2;
    let correctCountry = null; 
    let selectedColumn;

    function animating() {        //делаем подсказку (моргание нужной страны красным цветом)
      eArray.forEach(element => {
        if (element._dataItem.dataContext.id === randomCnt) {             
          correctCountry = element;            
        }
      });

      if (!timer && !timer2) {
        timer = setInterval(animate, 500);  
        timer2 = setInterval(defaultAnim, 1000);   
      }
      
      function animate() {
        correctCountry.states.apply("highlightRed");          
      } 
      
      function defaultAnim() {
        correctCountry.states.apply("default"); 
      } 
    }

    regionSeries.mapPolygons.template.events.on("click", function(ev) {     //вызвать метод обработки кликов
      let id = ev.target._dataItem.dataContext.id;    //код выбранной страны
      that.showCurrentName(id);
      that.showAlert("");
      
      if (counter === 4) {    //вызвать анимацию если 5 кликов
        animating();
        that.playSound('hint');
      }
       
      if (randomCnt === id) {       
          ev.target.states.remove("hover");    
          if (selectedColumn) {      
            ev.target.states.apply("default");
            selectedColumn = undefined;
          }
          if (counter < 2) {
            ev.target.states.apply("highlightGreen"); 
            selectedColumn = ev.target;
            score = score + 400 / listOfNamesInRussian.length;
            that.updateScore(score);
            counter = 0;
          } else if (counter < 4) {
            ev.target.states.apply("highlightYellow"); 
            selectedColumn = ev.target;
            score = score + (400 / listOfNamesInRussian.length) / 2;
            that.updateScore(score);
            counter = 0;
          } else {
            correctCountry = null;  
            clearInterval(timer);  
            timer = null;
            clearInterval(timer2); 
            timer2 = null; 
            counter = 0;       
            ev.target.states.apply("highlightRed"); 
            selectedColumn = ev.target;                   
          }
  
          that.deleteCountryFromList();

          if (region_list.length) {
            randomCnt = that.getRandomCountry();
          } else {
            that.showGameOver();
          }     
          that.playSound('correct');
       
      } 
      if (region_list.includes(id)) {
        counter++;
      }        
    });
    }
    
    this.deleteCountryFromList = function() {
      for (let i = 0; i <= region_list.length; i++){
        if (region_list[i] === randomCnt) {
          region_list.splice(i, 1);          
        }
      }
    }

    this.updateScore = function(score) {
      scoreContainer.innerHTML = `${Math.round(score)}`
    }

    this.getRandomCountry = function(){
      let random = Math.floor(Math.random() * region_list.length);
      const found = regionsObject.find(element => {
        return element.alpha2 === region_list[random].toLowerCase();
      });
      countryFindContainer.innerHTML = `Найдите: <strong>${found.name}</strong>`;
      return found.alpha2.toUpperCase();
    }    
  
}
