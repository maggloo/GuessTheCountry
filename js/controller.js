function ModuleController () {
    let that = this;
    let myModuleContainer = null;
    let myModuleModel = null;
    let hashPageName;

    this.init = function(container, model) {
      myModuleContainer = container;
      myModuleModel = model;

      this.updateState(); //первая отрисовка

      // вешаем слушателей на событие hashchange и кликам
      window.addEventListener("hashchange", this.updateState);
      myModuleContainer.addEventListener('click', this.clickBtns);
      myModuleContainer.addEventListener('change', this.readSelect);    
    }

    this.updateState = function() {   
      myModuleModel.playSound('click');
      hashPageName = location.hash.slice(1).toLowerCase();
      if (!hashPageName) {
        hashPageName = 'login';
      }    
      myModuleModel.updateState(hashPageName); 
      if (hashPageName === 'records') {
        that.readSelect();
      }                     
    }

    this.clickBtns = function(event) {     
      
      if ((event.target.className === 'log-in')
       || (event.target.className === 'sign-in')) {
        event.preventDefault();
        myModuleModel.playSound('click');
        myModuleModel.swithForm();
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
