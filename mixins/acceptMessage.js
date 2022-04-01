import userInfo from '@/util/getUserInfo.ts';
import {
    mapActions,
    mapGetters
} from 'vuex'
let {
    releaseAvar,
    relaseName,
    tags,
    token,
    level,
    sex
} = userInfo;
import {isProduction} from "@/api/user/index"
export const acceptMessage = {
    data(){
        return{
            isLogin:false,
            isPro:-1,
        }
    },
    computed: {
        ...mapGetters(['myWebsocket'])
    },
    methods: {
        ...mapActions({
            setKey: 'user/setKey',
        }),
        async isProduction(){
            try{
                let res = await isProduction()
                if(res.code==200){
                    this.isPro = res.data
                }
            }catch(err){
                this.isPro = false
            }finally{
                if(typeof this.loadFunction=='function') this.loadFunction()
            }
           
        },
        // 存储消息记录
        setIcon() {
            let storeage = uni.getStorageSync("noticeArr")
            let noticeArr = storeage ? JSON.parse(storeage) : [];
            let sum = noticeArr.reduce((pre, cur) => pre + cur.unreadNum, 0)
            if (sum > 0 && sum <= 90) {
                uni.hideTabBarRedDot({
                    index: 2
                })
                uni.setTabBarBadge({
                    index: 2,
                    text: sum + '',
                })
            } else if (sum > 90) {
                uni.removeTabBarBadge({
                    index: 2
                })
                uni.showTabBarRedDot({
                    index: 2
                })
            } else {
                uni.removeTabBarBadge({
                    index: 2
                })
                uni.hideTabBarRedDot({
                    index: 2
                })
            }
        },
        // 已读消息
        readMessage(id) {
            let storeage = uni.getStorageSync("noticeArr")
            let noticeArr = storeage ? JSON.parse(storeage) : [];
            let index = noticeArr.findIndex(item => item.id == id);
            if (index != -1) {
                noticeArr.splice(index, 1)
            }
            uni.setStorageSync("noticeArr", JSON.stringify(noticeArr))
        },
        // 处理本地消息数据
        processMessageData(msg) {
        
            let types = ["like", 'love','focusOn']
            let token = uni.getStorageSync("token")
            let id = types.includes(msg.type) ? msg.type : msg.fromOpenId == token ? msg.toOpenId : msg.fromOpenId;
            let storeage = uni.getStorageSync("noticeArr")
            let noticeArr = storeage ? JSON.parse(storeage) : [];
            let index = noticeArr.findIndex(item => item.id == id);
            if (index == -1) {
                noticeArr.push({
                    id,
                    type: msg.type,
                    time: msg.sendTime,
                    unreadNum: 1,
                })
            } else {
                noticeArr[index].unreadNum++
            }
            uni.setStorageSync("noticeArr", JSON.stringify(noticeArr))
            this.setIcon()
        }

    },
    onShow() {
        console.log(123)
        this.isProduction()
        this.$store.state.common.websocket.onSocketClosed()
        
        this.setIcon()
        
        uni.onSocketMessage((res) => {
            let msg = JSON.parse(res.data)
            if (msg.type == 'heart'|| msg.type=='worldtext' || msg.type=='worldsystem' ) {
                return;
            }
            if (msg.fromOpenId != token) {
                uni.vibrateLong({
                    success: function() {

                    }
                });
                this.processMessageData(msg)
            }
            if (this.acceptMessage && typeof this.acceptMessage == "function") this.acceptMessage(msg)
        });
    },
    created(){
        let token = uni.getStorageSync("token")
        this.isLogin = token ? true :false
        this.isProduction()
    },
  
    mounted() {
        if(this.isLogin){
            uni.showTabBar()
        }else{
            uni.hideTabBar()
        }
        uni.onSocketMessage((res) => {
            let msg = JSON.parse(res.data)
            if (msg.type == 'heart' || msg.type=='worldtext' || msg.type=='worldsystem') {
                return;
            }
            if (msg.fromOpenId != token) {
                uni.vibrateLong({
                    success: function() {

                    }
                });
                this.processMessageData(msg)
            }
            if (this.acceptMessage && typeof this.acceptMessage == "function") this.acceptMessage(msg)
        });
    }
}
