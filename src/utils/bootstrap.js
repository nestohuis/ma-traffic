import Vue from 'vue';
import Toasted from 'vue-toasted';
import VueClipboard from 'vue-clipboard2';
import numeral from './numeral';

Vue.use(VueClipboard);
Vue.use(Toasted, { duration: 3000 });
Vue.use(numeral);
