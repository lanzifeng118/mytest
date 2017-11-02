// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import {getCookie} from 'components/tools/global'

Vue.use(VueAxios, axios)
Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    hasLogin: false,
    user: {
      name: '',
      lastlogintime: '',
      avatar: ''
    },
    quillEditor: {
      nomal: [
        ['bold', 'italic', { 'align': [] }], // toggled buttons
        [{'color': []}, {'background': []}, {'header': [1, 2, 3, 4, 5, false]}], // dropdown with defaults from theme
        [{'list': 'bullet'}, {'list': 'ordered'}],
        ['link', 'image'],
        ['clean'] // remove formatting button
      ],
      easy: [
        ['bold', 'italic'], // toggled buttons
        [{'color': []}, {'background': []}], // dropdown with defaults from theme
        ['clean'] // remove formatting button
      ]
    }
  }
})

router.beforeEach((to, from, next) => {
  store.state.hasLogin = getCookie()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    goPage(store.state.hasLogin, '/login')
  } else if (to.meta.loginPage) {
    goPage(!store.state.hasLogin, '/admin')
  } else {
    next()
  }

  function goPage(hasLogin, path) {
    if (hasLogin) {
      next()
    } else {
      next({
        path: path,
        query: {redirect: to.fullPath}
      })
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  store,
  components: {
    App
  }
})
