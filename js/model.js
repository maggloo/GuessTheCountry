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
    }

    this.updateState = function(pageName) {
      if (!this.getUserFromLocalStorage()) {
        myModuleView.renderContent('login');   //если юзера нет в localStorage то предлагаем войти    
      } else {
        loggedUser = this.getUserFromLocalStorage();
        currentUserName = loggedUser;     
        myModuleView.setUserName(currentUserName);
      }       

      if ( this.getUserFromLocalStorage()) {
        loggedUser = this.getUserFromLocalStorage();    //считываем если есть
        currentUserName = loggedUser;     
        myModuleView.setUserName(currentUserName);        
      }  

      myModuleView.renderContent(pageName);
    
      if (this.getRegionFromLocalStorage()) {
        parsedRegion = this.getRegionFromLocalStorage();
      } else {
        parsedRegion = {region: 'get-world'};     //если региона нет до ставим весь мир по дефолту
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
             
      this.getAudios();     
      if (pageName.includes('options')) {
        this.checkToggle(sounds, music);        //проверяем отображение свитчеров
      }
          
    }

    this.getAudios = function() {
      if (this.getSoundsFromLocalStorage() || this.getMusicFromLocalStorage()) {
        sounds = this.getSoundsFromLocalStorage();
        music = this.getMusicFromLocalStorage();

        for (checkSounds in sounds) {
          this.playAudio("checkSounds", sounds.checkSounds);
        }
        for (checkMusic in music) {      
          this.playAudio("checkMusic", music.checkMusic);
        }
      }
    }

    this.playAudio = function(id, state) {
      if (id === "checkMusic") {
        let checkboxStateMusic = {
           [id]: state
        };
        localStorage.setItem("checkboxStateMusic", JSON.stringify(checkboxStateMusic)); 
        myModuleView.playMusic(state);
      } else if (id === "checkSounds") {
        let checkboxStateAudio = {
          [id]: state
       };
       localStorage.setItem("checkboxStateAudio", JSON.stringify(checkboxStateAudio)); 
       myModuleView.playAudio(state);
      }               
    }

    this.playSound = function(sound) {
      this.getAudios();
      myModuleView.playSound(sound);
    }

    this.getUserFromLocalStorage = function() {
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
      myModuleView.toggleState(sounds, music);      //актуальные значения свитчеров
    }

    this.toggleAbout = function() {
      myModuleView.toggleAbout();
    }

    this.createUser = function(userName, userEmail, userPass) {
      let name = userName.trim();
      let email = userEmail.trim();
      let password = userPass.trim();
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (userName, userEmail) {            
          that.addUser(name, email);      
        })
        .then(function (userName, userEmail) {
          that.loginUser(email, password);
        })
        .catch(function(error) {
          // Handle Errors here.
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
          let userData = null;
          let userDataName = null;
          let username = null;
          if (user) {
            myDBRef.child("users").orderByChild("email").equalTo(`${user.email}`).once("value",snapshot => {
              if (snapshot.exists()){
                userData = snapshot.val();
                userDataName = Object.keys(userData);
                username = currentUserName = userData[userDataName].username;
                
                localStorage.setItem('user', username);
                myModuleView.setUserName(username);
                that.updateState('menu');
                myModuleView.sayHi(username);   
              }
            })
            .catch(function (error) {
                console.log("Error: " + error.code);
            });

          } else {
            localStorage.removeItem("user");
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
          let listScores = {};      
          let myUsers = snapshot.val();
        
          Object.keys(myUsers).forEach(key => {      
            let val = myUsers[key];
            let username = val.username;
            let score = val.score;
            if (score) {listScores[username] = +score};    //записываем в новый объект вычитанные значения 
          })  

          let sortList = function(list) {
            let sortable = [];
            for (let key in list) {
                sortable.push([key, list[key]]);
            }        
            sortable.sort(function(a, b) {
              return b[1] - a[1];
            });   
            if (sortable.length >= 10) {
              sortable = sortable.slice(0,10);
            }
            
            let orderedList = {};
            for (let idx in sortable) {
                orderedList[sortable[idx][0]] = sortable[idx][1];
            }

            return orderedList;
          }

          let orderedList = sortList(listScores);      
          myModuleView.printUsers(orderedList); 

        } else {
          myModuleView.printUsers(0); 
        }
    }).catch(function (error) {
      console.log("Error: " + error.code);
    });
    }

    this.logout = function() {
      console.log("Bye Bye!");   
        firebase.auth().signOut();      
        localStorage.removeItem("user");  
        this.updateState('login');                
    }

    this.deleteUser = function(id, mode, select) {
      myDB.ref(`${mode}/` + `${select}/` + `user_${id.toLowerCase()}`).remove()
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
      myDB.ref(`${mode}/` + `${currentRegion.region}/` + `user_${currentUserName.toLowerCase()}`).set({
        score: `${score}`,
        username:`${currentUserName}`,
      })      
      .then(function(){
        myModuleView.showAlert("Счет был внесен в таблицу рекордов.");
      })
      .catch(function (error) {
        console.error("Ошибка добавления информации: ", error);
      }); 
    }

    this.changeMode = function(text, className) {     //изменение вида селекта и кнопки в рекордах
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
      myModuleView.changeMode(newButton, newClass, classTextContent)
    }

    this.swithForm = function() {
      myModuleView.swithForm();
    }

    this.saveRegion = function(id) {
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
          //возвращает объект с данными о необходимой стране
          //  возвращает undefined если результат не был найден или если аргумент неверный
            if (undefined === query.id && undefined === query.alpha2 && undefined === query.alpha3) return undefined;

          return countries.filter(function(country) {
                return (
                  (undefined !== query.alpha2 && country.alpha2 === query.alpha2.toLowerCase())
                )
            // возвращаем объект, а не массив
          }).pop()             
    }

    this.getCountriesNamesInRussian = function(countriesArray) {
      return (
        countriesArray.map(country => { 
          if (country.name === "Белоруссия") {
            country.name = "Беларусь"
          }       
          return country.name; 
        }).sort()     //сортируем по алфавиту
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

    this.shuffleArray = function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
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
      let namesInRussian = this.getCountriesNamesInRussian(region_list);
      let regionCodes = this.getCountryCodes(region_list);

      if (isFlags) {
        this.shuffleArray(regionCodes); //меняем рандомно элементы массива
      }

      (isFlags) ? 
      myModuleView.getFlags(regionCodes, namesInRussian, regionData.name, region_list) 
      : myModuleView.getMap(regionData, regionCodes, difference, namesInRussian, region_list);
    }
}
