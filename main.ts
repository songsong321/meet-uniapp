
import Vue from 'vue'
import App from '@/App.vue'
import uView from 'uview-ui'
import store from '@/store'
import guidePage from "@/tabbar/pages/components/guidePage/guidePage"
import audit from "@/tabbar/pages/components/audit/audit"
  
Vue.config.productionTip = false
Vue.use(uView)
Vue.component("audit",audit)
Vue.component("guidePage",guidePage)
Vue.prototype.$store = store
new App(store).$mount()
