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
