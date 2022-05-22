// Список компонент (from components.js)
const components = {
  header: Header,
  content: Content,
};
  
  // Список поддердживаемых роутов (from pages.js)
  const routes = {
    login: Login,
    menu: Menu,
    options: Options,
    records: Records,
    region: Region,
    flgregion: FlgRegions,
    game: Game,
    flags: Flags,
    error: ErrorPage
  };
  


/* ----- spa init module --- */
const mySPA = (function() {

  /* ------- begin view -------- */
  function ModuleView() {
    let that = this;
    let myModuleContainer = null;
    let menu = null;
    let contentContainer = null;
    let routesObj = null;
    let region1 = null;
    let mapCentering1 = -10;
    let routeName = null;
    let worldObj = {};
    let countryListContainer = null;
    let countryFindContainer = null;
    let root = null;
    let chart = null;
    let element = null;
    let countries = null;
    let hourglassanimation = null;
    let indicator = null;
    let region_list = null;
    let region_list_full = null;
    let listOfNamesInRussian = null;
    let regionsObject = null;
    let randomCnt = null;
    let counter = 0;
    let currentUserName = 'user';
    let scoreContainer = null;
    let score;
    let showElement = null;
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
        that.initializeMap()
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
 
    this.hideBtns = function() {
      let menu = myModuleContainer.querySelector("#nav-menu");
      menu.classList.add("hidden")
    }

    this.sayHi = function(userName) {
      contentContainer.querySelector('#hi-name').innerHTML = `Добро пожаловать, ${currentUserName}`;
    }
    this.printUsers = function(userList) {
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
      } else {
        userListContainer.innerHTML = '';
      }
    }

    this.setUserName = (name) => {
      currentUserName = name;
    }

    this.playMusic = function(id, state) {
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

    this.playAudio = function(id, state) {
      if (state){      
        permitSounds = true;
      } else if (!state) {
        permitSounds = false;
      }
    }

    this.toggleState = function(sounds, music) {
      let musicToggle = document.getElementById('checkMusic');
      musicToggle.checked = music.checkMusic;
 
      let soundsToggle = document.getElementById('checkSounds');
      soundsToggle.checked = sounds.checkSounds;
    }
    this.toggleAbout = function() {
      let readMore = contentContainer.querySelector(".about-game");
      readMore.classList.toggle('wrap')     
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

    this.changeMode = function(newButton, newClassName, clasTextContent) {
      let button = contentContainer.querySelector("#change-type");
      let className = contentContainer.querySelector('#mode-name');

      button.textContent = newButton;
        className.className = newClassName;
        className.textContent = clasTextContent;      
    }

    this.swithForm = function(){
      myModuleContainer.querySelectorAll('.alert').forEach(alert => alert.textContent = '');
      myModuleContainer.querySelectorAll('.form').forEach(form =>  form.classList.toggle('hidden'));
    }

    this.showAlert = function(message) {
      myModuleContainer.querySelectorAll('.alert').forEach(alert => alert.textContent = message);
    }

    this.showCurrentName = function(id) {
      showElement = contentContainer.querySelector(".current-country");
      const found = regionsObject.find(element => {
        return element.alpha2 === id.toLowerCase();
      });
      showElement.innerHTML = `<strong>${found.name}</strong>`;
    }

    this.initializeMap = function() {  
        let element = contentContainer.querySelector('#chartdiv');
        countryListContainer = contentContainer.querySelector("#country-list");
        countryFindContainer = contentContainer.querySelector("#country-find"); 
        scoreContainer = contentContainer.querySelector("#score"); 
        root = am5.Root.new(element);
        
        indicator = root.container.children.push(am5.Container.new(root, {
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

    this.getFlags = function(regionCodes, namesInRussian, name, regionsObjArray) {
      region_list = regionCodes;
      listOfNamesInRussian = namesInRussian;
      regionsObject = regionsObjArray;
      scoreContainer = myModuleContainer.querySelector("#score"); 
      let flagsContainer = contentContainer.querySelector('#chartdiv');
      countryListContainer = myModuleContainer.querySelector("#country-list");
      countryFindContainer = myModuleContainer.querySelector("#country-find"); 
      score = 0;
      
      myModuleContainer.querySelector("#region-name").innerHTML = `${name}`;
      countryListContainer.innerHTML = `Список стран: ${listOfNamesInRussian.join(", ")} <i>(${listOfNamesInRussian.length})</i>`;   
      flagsContainer.style.height = 'auto';
      flagsContainer.style.padding = '2%';
      flagsContainer.style.textAlign = 'center';
      randomCnt = that.getRandomCountry();

      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffleArray(region_list);
      // countryListContainer.innerHTML = `Список стран: ${fullNamesArr.join(", ")} <i>(${fullNamesArr.length})</i>`;
      (() => {
        for (let i = 0; i <  region_list.length; i++) {
            const img = new Image();
              img.src = `https://cdn.jsdelivr.net/npm/world_countries_lists@2.5.1/data/flags/128x128/${region_list[i].toLowerCase()}.png`;
              // img.alt = flag.data.title;
              img.classList.add("flag-img");
              img.id = `${region_list[i]}`;
              flagsContainer.append(img);
        }
      })();
    }

    this.checkFlag = function(id) {     
      let imgs = myModuleContainer.querySelectorAll(`.flag-img`); 

      flagImg =  myModuleContainer.querySelector(`#${id}`); 
      this.showCurrentName(id);    
      if (counter === 4) {
        let correctImg = imgs.forEach(element => {
          if (element.id === randomCnt) {
            element.style.animation = "hint 0.5s linear alternate-reverse infinite";
          }
        });
        this.playSound('hint');
      }
        if (randomCnt === id) {          
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
                  
            for (let i = 0; i <= region_list.length; i++){
              if (region_list[i] === randomCnt) {
                  region_list.splice(i, 1);          
              }
            }
            if (region_list.length) {
              randomCnt = that.getRandomCountry();
            } else {
              this.showGameOver();
            }         
                 
        } else {      
          if (region_list.includes(id)) {
            counter++;                  
          }        
        }
       
    }

    this.showGameOver = function() {
      showElement.innerHTML =  `<strong>Вы нашли все страны!</strong>`;
    }

    this.getMap = function(regionData, regionCodes, difference, namesInRussian, regionsObjArray) {
      region_list = regionCodes;
      listOfNamesInRussian = namesInRussian;
      regionsObject = regionsObjArray;
      myModuleContainer.querySelector("#region-name").innerHTML = `${regionData.name}`;
      
      chart = root.container.children.push(
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
        indicator.hide();
        
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

    let randomCnt;
    let MapArr;

    setTimeout (() => {       
          countryListContainer.innerHTML = `Список стран: ${listOfNamesInRussian.join(", ")} <i>(${listOfNamesInRussian.length})</i>`;
          randomCnt = that.getRandomCountry();
    }, 100);

    let selectedColumn;
    let regionListLength = region_list.length;
    score = 0;

    let timer;
    let eArray = regionSeries.mapPolygons.template._entities; 
    let timer2;
    correctCountry = []; ///???????

    function animating() {   
      eArray.forEach(element => {
        if (element._dataItem.dataContext.id === randomCnt) {             
          correctCountry = element;            
        }
      });

      if (!timer && !timer2){
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


    regionSeries.mapPolygons.template.events.on("click", function(ev) {
      let id = ev.target._dataItem.dataContext.id;
      that.showCurrentName(id);
      
      if (counter === 4) {
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
            correctCountry = [];  
            clearInterval(timer);  
            timer = null;
            clearInterval(timer2); 
            timer2 = null; 
            counter = 0;       
            ev.target.states.apply("highlightRed"); 
            selectedColumn = ev.target;
                     
          }
          
          for (let i = 0; i <= region_list.length; i++){
            if (region_list[i] === randomCnt) {
              region_list.splice(i, 1);          
            }
          }
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
  /* -------- end view --------- */
  /* ------- begin model ------- */
  function ModuleModel () {
      let that = this;
      let myModuleView = null;
      let idModel = null;
      let countries = null;
      let isFlags = false;
      let parsedRegion = null;
      let loggedUser = {};
      let currentUserName;
      let sounds = null;
      let music = null;

      this.init = function(view) {
        myModuleView = view;
        if (!this.getUserFromLocalStorage()) {
          this.updateState('login');       
        } else {
          loggedUser = this.getUserFromLocalStorage();
          currentUserName = loggedUser;     
          myModuleView.setUserName(currentUserName);
        }
        
      }

      this.updateState = function(pageName) {
        myModuleView.renderContent(pageName);
        if (window.localStorage.getItem("region")){
          parsedRegion = JSON.parse(window.localStorage.getItem("region"));
        } else {
          parsedRegion = {region: 'get-world'};
        }
              

        if (pageName.includes('game')) { 
            isFlags = false;     
            idModel = parsedRegion.region;       
            this.getData(idModel);   
        } else if (pageName.includes('flag')) {       
            isFlags = true;
            idModel = parsedRegion.region;                   
            this.getData(idModel); 
        } 

        if (this.getSoundsFromLocalStorage() || this.getMusicFromLocalStorage()){
          this.getAudios();
          if (pageName.includes('options')) {
            this.checkToggle(sounds, music);
          }
        }
      }

      this.getAudios = function() {
        if (this.getSoundsFromLocalStorage() || this.getMusicFromLocalStorage()){
          sounds = this.getSoundsFromLocalStorage();
          music = this.getMusicFromLocalStorage();

          for (checkSounds in sounds) {
            myModuleView.playAudio('checkSounds', sounds.checkSounds);
          }
          for (checkMusic in music) {      
            myModuleView.playMusic('checkMusic', music.checkMusic);
          }
        }
      }

      this.getUserFromLocalStorage = () => {
        if (typeof localStorage !== "undefined") {
          return localStorage.getItem("user");
        } else {
          return false;
        }
      }
    
      this.getRegionFromLocalStorage = function() {
        if (typeof localStorage !== "undefined") {
          return JSON.parse(window.localStorage.getItem("region"));
        } else {
          return false;
        }
      }
      this.getSoundsFromLocalStorage = function(){
        if (typeof localStorage !== "undefined") {
          return JSON.parse(window.localStorage.getItem("checkboxStateAudio"));
        } else {
          return false;
        }
      }

      this.getMusicFromLocalStorage = function() {
        if (typeof localStorage !== "undefined") {
          return JSON.parse(window.localStorage.getItem("checkboxStateMusic"));
        } else {
          return false;
        }
      }

      this.checkToggle = function(sounds, music) {     
        myModuleView.toggleState(sounds, music);
      }

      this.playAudio = function(id, state) {
        if (id === "checkMusic") {
          let checkboxStateMusic = {
             [id]: state
          };
          localStorage.setItem("checkboxStateMusic", JSON.stringify(checkboxStateMusic)); 
          myModuleView.playMusic(id, state);
        } else if (id === "checkSounds") {
          let checkboxStateAudio = {
            [id]: state
         };
         localStorage.setItem("checkboxStateAudio", JSON.stringify(checkboxStateAudio)); 
         myModuleView.playAudio(id, state);
        } 
                
      }

      this.toggleAbout = function() {
        myModuleView.toggleAbout();
      }

      this.createUser = function(userName, userEmail, userPass) {
        let name = userName.trim();
        let email = userEmail.trim();
        let password = userPass.trim();
          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(function (userName,userEmail) {
            
            that.addUser(name, email);
            // localStorage.setItem(`user`, name.toLowerCase());

            // that.updateState('menu');
            // myModuleView.setUserName(name);
            // myModuleView.sayHi(name);
            // myModuleView.playSound('click');

            
           
            console.log(`Пользователь ${name} добавлен в коллецию users`);
          })
          .then(function (userName, userEmail) {
            that.loginUser(email, password);
            console.log(`Пользователь ${name} залогинен в коллецию users`);
          })
          .catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("Eroor Msg: "  + errorMessage);
            myModuleView.showAlert("Пожалуйста, введите корректные данные.");
          });
      }

      this.addUser = function(name, email){
        myDB.ref('users/' + `user_${name.replace(/\s/g, "").toLowerCase()}`).set({
          username: name,
          email: email,
        })
        .then(function (name) {
          console.log("Пользователь добавлен в коллецию users");
        })
        .catch(function (error) {
            console.error("Ошибка добавления пользователя: ", error);
        });
      }

      this.loginUser = function(userEmail, userPass) {
        if (userEmail && userPass) {
          firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
          .catch(function(error) {
            console.log("Error: " + error.message);
            myModuleView.showAlert("Неверный email или пароль. Введите корректные данные.");
            console.log("Неверный email или пароль. Введите корректные данные.");
          });
          
          firebase.auth().onAuthStateChanged(function(user) {
            let userData = null, userDataName = null, username = null;
            if (user) {
              myDBRef.child("users").orderByChild("email").equalTo(`${user.email}`).once("value",snapshot => {
                if (snapshot.exists()){
                  userData = snapshot.val();
                  userDataName = Object.keys(userData);
                  username = currentUserName = userData[userDataName].username;
                  
                  console.log(username);
                  myModuleView.setUserName(username);
                  that.updateState('menu');
                  myModuleView.sayHi(username);
                  localStorage.setItem('user', username);
                  
                  that.playSound('click');
                  // myModuleView.setUserName(username);
                  
                  
                  // loggedUser = that.getUserFromLocalStorage();

                  }
              })
              // .then(() => { 
               
              // })
              .catch(function (error) {
                  console.log("Error: " + error.code);
              });
            } else {
              localStorage.removeItem("user");
              console.log("Bye Bye!"); 
              that.updateState('login');   
            }
          });
        } else {
          myModuleView.showAlert("Пожалуйста, заполните поля e-mail и пароля.");
        }
      }

      this.getUsersList = function(select, className) {
        myDB.ref(`${className}/` + `${select}`).once("value")
        .then(function(snapshot) {
          if (snapshot.val()){
            console.log("User list:");  
            let listScores = {};      
            let challengeUsers = snapshot.val();
          
            Object.keys(challengeUsers).forEach(key => {
              var val = challengeUsers[key];
              let username = val.username;
              let score = val.score;
              if (score) listScores[username] = +score;
            })  

            let sortList = (list)=> {
              var sortable = [];
              for (var key in list) {
                  sortable.push([key, list[key]]);
              }        
              sortable.sort(function(a, b) {
                return b[1] - a[1];
              });   
              if (sortable.length >= 10) {
                sortable = sortable.slice(0,10);
              }
              
              var orderedList = {};
              for (var idx in sortable) {
                  orderedList[sortable[idx][0]] = sortable[idx][1];
              }
              return orderedList;
            }

            let ordered = sortList(listScores);
            let result = {};

          
          myModuleView.printUsers(ordered); 
          } else {
            myModuleView.printUsers(0); 
          }
      }).catch(function (error) {
        console.log("Error: " + error.code);
      });
      }

      this.printUsersList = function(select, mode) {
        myDB.ref(`${mode}/` + `${select}`).once("value")
        .then(function(snapshot) {
           let listScores = {};   
          let challengeUsers = snapshot.val();
          Object.keys(challengeUsers).forEach(key => {
            var val = challengeUsers[key];
            let username = val.username;
            let score = val.score;         
          });

          myModuleView.printUsers(challengeUsers);
        }, function (error) {
            console.log("Error: " + error.code);
        });
      }

      this.logout = function() {
        console.log("Bye Bye!");   
          firebase.auth().signOut();      
          localStorage.removeItem("user");  
          this.updateState('login');       
          console.log("Bye Bye!");              
      }


      this.deleteUser = function(id, mode, select) {
        myDB.ref(`${mode}/` + `${select}/` + `user_${id}`).remove()
        .then(function () {
          console.log("Пользователь удален из коллеции users");
        })
        .catch(function (error) {
            console.error("Ошибка удаления пользователя: ", error);
        });
        this.getUsersList(select, mode);
      }
      
      this.recordScore = function(score, mode) {
        let currentRegion = this.getRegionFromLocalStorage();
        myDB.ref(`${mode}/` + `${ currentRegion.region}/` + `user_${currentUserName.toLowerCase()}`).set({
          score: `${score}`,
          // level: `${challengeData.levelsComplited.lastComplited + 1}`,
          // lastComplited: `${challengeData.levelsComplited.lastComplited + 1}`,
          username:`${currentUserName}`,
        })      
        .catch(function (error) {
          console.error("Ошибка добавления информации: ", error);
        }); 
      }

      this.changeMode = function(text, className) {
        let newButton = null;
        let newClass = null;
        let classTextContent = null;
        if (text === 'Флаги') {
          newButton = "Карты";
        } else {
          newButton = "Флаги";
        }
        if (className === "maps") {
          newClass = "flags";
          classTextContent = "Флаги";
        } else {
          newClass = "maps";
          classTextContent= "Карты";
        }
        this.playSound('click');
        myModuleView.changeMode(newButton, newClass, classTextContent)
      }

      this.playSound = function(sound) {
        this.getAudios();
        myModuleView.playSound(sound);
      }

      this.swithForm = function() {
        myModuleView.swithForm();
      }

      this.saveRegion = function(id) {
        this.playSound('click');
        const regionData = {
          region: id,
        }; 
        localStorage.setItem("region", JSON.stringify(regionData));  
      }

      this.checkFlag = function(id) {
        myModuleView.checkFlag(id);      
      }

      this.getData = async function(idModel){
        this.saveID(idModel);
        let apiQuery = "https://cdn.jsdelivr.net/npm/world_countries_lists@2.5.1/data/countries/ru/countries.json";  
        try {
          const response = await fetch(apiQuery);
          countries = await response.json();
          this.calculateMap();
        } catch (error) {
            console.error("error:" + error);
        } 
  
      }

      this.searchCountry = function(query) {
         //  returns an object with the sought country's data if the search yields a result
            //  returns undefined if no results could be found or if argument is incorrect
              // if argument is not valid return false
              if (undefined === query.id && undefined === query.alpha2 && undefined === query.alpha3) return undefined;
  
                  // iterate over the array of countries
            return countries.filter(function(country) {
  
                  // return country's data if
                  return (
                      // we are searching by ID and we have a match
                      (undefined !== query.id && parseInt(country.id, 10) === parseInt(query.id, 10))
                      // or we are searching by alpha2 and we have a match
                      || (undefined !== query.alpha2 && country.alpha2 === query.alpha2.toLowerCase())
                      // or we are searching by alpha3 and we have a match
                      || (undefined !== query.alpha3 && country.alpha3 === query.alpha3.toLowerCase())
                  )
  
              // since "filter" returns an array we use pop to get just the data object
            }).pop()
              
      }

      this.getCountriesNamesInRussian = function(countriesArray) {
        return (
          countriesArray.map(country => { 
            if (country.name === "Белоруссия") {
              country.name = "Беларусь"
            }       
            return country.name; 
          }).sort()
        )
      }

      this.getCountryCodes = function(countriesArray) {
        return (
          countriesArray.map(country => {        
            return country.alpha2.toUpperCase();
          })
        )
      }

      this.saveID = function(id) {  
        idModel = id;
      }

      this.calculateMap = function() { 
        let region1 = null;
        let regionData = {
          homePoint: null,
          name: null,
        }         

        switch (idModel) {
          case "get-world" : 
            regionData.name = "Весь мир";
            region1 = 0;               
            break;
          case "get-europe":
            regionData.name = "Европа"; 
            region1 = 'EU';  
            regionData.homePoint = { longitude: 30, latitude: 47 };                    
            break;
          case "get-ncAmerica":
            regionData.name  = "Северная и Центральная Америка";
            region1 = 'NA';
            regionData.homePoint = { longitude: -90, latitude: 47 }; 
            break;
          case "get-sAmerica":
            regionData.name = "Южная Америка";
            region1 = 'SA';
            regionData.homePoint = { longitude: -100, latitude: -27 }; 
            break;
          case "get-africa":
            regionData.name = "Африка";
            region1 = 'AF';
            regionData.homePoint = { longitude: 30, latitude: 3 }; 
            break;
          case "get-asia":
            regionData.name = "Азия";
            region1 = 'AS';
            regionData.homePoint = { longitude: 100, latitude: 25 }; 
            break;  
          case "get-oceania":
            regionData.name = "Австралия и Океания";
            region1 = 'OC';
            regionData.homePoint = { longitude: 140, latitude: -30 }; 
            break;       
        }    
       

      let region_list = [];   //массив из объектов всех стран региона
      let difference = [];    //массив стран этого региона которых нет в оф. списке ООН
       if (region1) {
          for (let id in am5geodata_data_countries2) {
            let country = am5geodata_data_countries2[id];                
            if (country.continent_code === region1){  
              if (this.searchCountry({alpha2: id})) {
                region_list.push(this.searchCountry({alpha2: id}));  
              } else {
                difference.push(id);  
              }    
            } 
          } 
        } else {
          for (let id in am5geodata_data_countries2) {
            if (this.searchCountry({alpha2: id})) {
              region_list.push(this.searchCountry({alpha2: id}));
            }  
            else {
              difference.push(id);  
            }        
          }
        }
        console.log(regionData)
        let namesInRussian = this.getCountriesNamesInRussian(region_list);
        let regionCodes = this.getCountryCodes(region_list);

        setTimeout (() => {
          (isFlags) ? myModuleView.getFlags(regionCodes, namesInRussian, regionData.name, region_list) : myModuleView.getMap(regionData, regionCodes, difference, namesInRussian, region_list)}, 0);
      }
  }

  /* -------- end model -------- */
  /* ----- begin controller ---- */
  function ModuleController () {
      let that = this;
      let myModuleContainer = null;
      let myModuleModel = null;
      let hashPageName;

      this.init = function(container, model) {
        myModuleContainer = container;
        myModuleModel = model;

      //   window.onbeforeunload = function() {       
      //     return true;
      // };

        this.updateState(); //первая отрисовка

        // вешаем слушателей на событие hashchange и кликам
        window.addEventListener("hashchange", this.updateState);
        myModuleContainer.addEventListener('click', this.clickBtns);
        myModuleContainer.addEventListener('change', this.readSelect);
       
      }

      // this.saveRegionType = function() {
      //   let currentRegion = myModuleContainer.querySelector("#region-name").innerHTML;
      //   console.log(currentRegion)
      // }

      this.updateState = function() {   
        myModuleModel.playSound('click');
        hashPageName = location.hash.slice(1).toLowerCase();
        if (!hashPageName) {
          hashPageName = 'login';
        }             
        myModuleModel.updateState(hashPageName);        
      }

      this.clickBtns = function(event) {
        
        switch (event.target) {        
          case myModuleContainer.querySelector('.log-in'):
          case myModuleContainer.querySelector('.sign-in'):
            event.preventDefault();
            myModuleModel.playSound('click');
            myModuleModel.swithForm();
            break;                
        }  

        if (event.target.className === "mainmenu__link") {
          myModuleModel.playSound('click');
        }
        if (event.target.id === "login-user"){
          event.preventDefault();
          event.stopPropagation();
          myModuleModel.playSound('click');
          myModuleModel.loginUser(
              myModuleContainer.querySelector('#login-email').value,
              myModuleContainer.querySelector('#login-password').value
          );
        }

        if (event.target.id === "create-user"){
          event.preventDefault();
          event.stopPropagation()
          myModuleModel.playSound('click');
          myModuleModel.createUser(
            myModuleContainer.querySelector('#signup-name').value,
            myModuleContainer.querySelector('#signup-email').value,
            myModuleContainer.querySelector('#signup-password').value
          );

        }
        if (event.target.classList.contains("get-flag") || event.target.classList.contains("get-map")){
          myModuleModel.saveRegion(event.target.id);
        }

        if (event.target.classList.contains("flag-img")){
          myModuleModel.checkFlag(event.target.id);
        } 

        if (event.target.id === "change-type"){
          myModuleModel.playSound('click');
          that.changeSelect();
        } 
        if (event.target.id === "about-more"){
          event.preventDefault();
          event.stopPropagation();
          myModuleModel.playSound('click');
          myModuleModel.toggleAbout();
        } 
        

        if (myModuleContainer.querySelector('#score')){
          let currentScore = myModuleContainer.querySelector('#score');
          if (+currentScore.textContent > 0) {
            myModuleModel.recordScore(+currentScore.textContent, currentScore.className);
          }
        }
        if (event.target.classList.contains('log-out')) {
          event.preventDefault();
          event.stopPropagation();
          myModuleModel.playSound('click');
          myModuleModel.logout();
        }

        if (event.target.classList.contains("delete-user")){
          event.preventDefault();
          event.stopPropagation();
          myModuleModel.playSound('click');

          let modeName = myModuleContainer.querySelector('#mode-name').className;
          let select =  myModuleContainer.querySelector('#maps-select').value;
          let id = event.target.parentElement.parentElement.dataset.id;
          console.log(id, modeName, select)
          myModuleModel.deleteUser(id, modeName, select);
        }
      }

      this.changeSelect = function() {
        let button = myModuleContainer.querySelector("#change-type").textContent;
        let className = myModuleContainer.querySelector('#mode-name').className;
        myModuleModel.changeMode(button, className);
        this.readSelect();
      }

      this.readSelect = function() {
        if (hashPageName === 'records') {
          let select =  myModuleContainer.querySelector('#maps-select').value;
          let className = myModuleContainer.querySelector('#mode-name').className;
          myModuleModel.getUsersList(select, className);
        }
        if (hashPageName === "options") {
          let toggleMusic =  document.querySelectorAll('input[type="checkbox"]');
          toggleMusic.forEach(element => {
            if (element.checked) {        
              myModuleModel.playAudio(element.id, true);         
            } else {
              myModuleModel.playAudio(element.id, false);  
            }
          });
        }
      }

  };
  /* ------ end controller ----- */

  return {
      init: function({container, routes, components}) {
        this.renderComponents(container, components);

        const view = new ModuleView();
        const model = new ModuleModel();
        const controller = new ModuleController();

        //связываем части модуля
        view.init(document.getElementById(container), routes);
        model.init(view);
        controller.init(document.getElementById(container), model);
      },

      renderComponents: function (container, components) {
        const root = document.getElementById(container);
        const componentsList = Object.keys(components);
        for (let item of componentsList) {
          root.innerHTML += components[item].render("component");
        }

      },
  };

}());
/* ------ end app module ----- */

/*** --- init module --- ***/
document.addEventListener("DOMContentLoaded", mySPA.init({
  container: "spa",
  routes: routes,
  components: components
}));
