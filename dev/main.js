
import Vue from "vue";
import Vuetify from 'vuetify/lib/framework';
import Ripple from 'vuetify/lib/directives/ripple';
import App from "./App.vue"
import colors from 'vuetify/lib/util/colors'

console.log("dev/main.js");

// Configure Vue features
Vue.config.devtools = false;
Vue.config.productionTip = false;

Vue.use(Vuetify, {
  directives: {
    Ripple,
  },
});

// async
function createApp(
  // {
  //   beforeApp = () => {},
  //   afterApp = () => {}
  // } = {}
) {
  const render = create => create(App);

  // await beforeApp({});

  const app = new Vue({
    render,
    vuetify: new Vuetify({
      theme: {
        themes: {
          light: {
            primary: colors.green,
            secondary: colors.lightGreen,
            accent: colors.lime.accent2,
            error: colors.amber.lighten1,
          },
          dark: {
            primary: colors.lightGreen,
            secondary: colors.green,
            accent: colors.lime.accent3,
            error: colors.amber.darken1,
          },
        },
      },
    }),
  });

  return { app };
}

const {app} = createApp();

export default app;

app.$mount('#app')

console.log("dev/main.js app", app);
// app.then($app => console.log("dev/main.js app.then", $app));
