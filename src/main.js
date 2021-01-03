import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'


Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$host = "http://localhost:8080" //ACTIVATE WHEN IN DEVELOPMENT MODE
// Vue.prototype.$host = "" //ACTIVATE BEFORE DEPLOYMENT (.jar file creation)

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
