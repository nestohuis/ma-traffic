import Vue from 'vue';
import Toasted from 'vue-toasted';
import VueClipboard from 'vue-clipboard2';
import App from './App.vue';

Vue.use(VueClipboard);
Vue.use(Toasted, { duration: 3000 });

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
