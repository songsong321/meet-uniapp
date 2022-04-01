
<script lang="ts">
import Vue from 'vue'
import {mapActions} from "vuex"
export default Vue.extend({
	mpType: 'app',
	methods:{
		...mapActions(['openWebsocket']),
	},
	created(){
		
	},
	onLaunch() {},
	onShow() {
		this.openWebsocket()
		console.log('App Show')
	},
	onHide() {
		console.log('App Hide')
	},
})
</script>
<style lang="scss">
page {
  height: 100%;
  position: relative;
}
@font-face{
    font-family: 'manhuati';
    src: url("https://songhan.top/files/mht.ttf");
}
@import "uview-ui/index.scss"
</style>
