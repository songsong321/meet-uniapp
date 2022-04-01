<!--本页面由uniapp切片工具生成，uni-app切片-可视化设计工具(一套代码编译到7个平台iOS、Android、H5、小程序)，软件下载地址：http://www.ymznkf.com/new_view_669.htm -->
<template>
    <view>
    <view class="content"  v-if="isLogin && isPro==1">
        <view class="msg_16">
            <view class="msg_2">
                <view class="msg_12" style="position: relative;">
                    <u-badge type="error" :count="getMessageCount({type:'love'})"></u-badge>
                    <image v-on:click="icon_6_click('love')" src="/static/MyApplets/msg/cs.png" mode="scaleToFill"
                        border="0" class="icon"></image>
                    <text decode="true" class="word">收藏</text>
                </view>
                <view class="msg_13">
                    <view style="position: relative;">
                        <u-badge type="error" :count="getMessageCount({type:'focusOn'})"></u-badge>
                        <image v-on:click="icon_5_click()" src="/static/MyApplets/msg/msg_icon_5.jpg" mode="scaleToFill"
                            border="0" class="icon"></image>
                        <text decode="true" class="word">粉丝</text>
                    </view>
                </view>
                <view class="msg_14">

                    <view style="position: relative;">
                        <u-badge type="error" :count="getMessageCount({type:'like'})"></u-badge>
                        <image v-on:click="icon_6_click('like')" src="/static/MyApplets/msg/msg_icon_6.jpg" mode="scaleToFill"
                            border="0" class="icon"></image>
                        <text decode="true" class="word">点赞</text>
                    </view>
                </view>
            </view>
            <view class="Messages">
                <view class="item" v-for="(item_Messages, index) in messageList" :key="index">
                    <view class="row" @click="goToMessage(item_Messages,index)">
                        <image :src="item_Messages.avar" mode="scaleToFill" border="0" class="icon"></image>
                        <view class="msg_41">
                            <view class="msg_42">
                                <text decode="true" class="subject">{{ item_Messages.nickName }}</text>
                                <text decode="true" class="time">{{ getDateDiff(item_Messages.sendTime) }}</text>
                            </view>
                            <view class="msg_43">
                                <text decode="true" class="smallTitle">{{ item_Messages.standbyMessage }}</text>
                                <text v-if="getMessageCount(item_Messages) > 0" decode="true"
                                    class="vote">{{ getMessageCount(item_Messages) }}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <u-empty v-if="messageList.length==0" text="快去找人聊聊吧!" mode="message"></u-empty>
            </view>
        </view>

        <view class="loading">{{ loadingText }}</view>
        <view class="ymBbottom"></view>
    </view>
    <guidePage v-if="!isLogin && isPro==1" @enter='login'></guidePage>
    <audit v-if='!isPro && isPro==0'></audit>
    <view v-if='!isPro &&  isPro==-1'></view>
</view>
</template>

<script lang="ts">
    //本页面由uniapp切片工具生成，uni-app切片-可视化设计工具(一套代码编译到7个平台iOS、Android、H5、小程序)，软件下载地址：http://www.ymznkf.com/new_view_669.htm
    import {
        Component,
        Vue
    } from 'vue-property-decorator';
    import {
        mapActions,
        mapGetters
    } from "vuex"
    import {
        findMessageAll
    } from "@/api/message/index"
    import {acceptMessage} from "@/mixins/acceptMessage"
    @Component({
        name: 'MsgIndex',
        mixins:[acceptMessage],
        methods: {
            ...mapActions({
                resetMessage: 'user/resetMessage',
                setKey: "user/setKey"
            }),
        },
        computed: {
            ...mapGetters({
                getMessage: 'user/getMessage',

            })
        },
    }) // 装饰器
    export default class MsgIndex extends Vue {
        private page: number | string = 1;
        private timer: any = null;
        private loadingText: string = '';


        private list_Messages: Array < Object > = [];
        private page: number = 0;
        private apiUrl: string = '';
        private id: string | number = '';
        private del_id: string | number = '';
        private messageList: Array < object > = []

        private async findMessageAll() {
            let res = await findMessageAll()
            let token = uni.getStorageSync("token");
            try {
                if (res.data.length > 0) {
                    res.data.forEach(item => {
                        item.avar = item.fromOpenId == token ? item.toAvar : item.fromAvar;
                        item.nickName = item.fromOpenId == token ? item.toName : item.fromName;
                    })
                    this.messageList = res.data || []
                }
            }catch(err){
                this.messageList = []
            }


        }
        onLoad(options) {
            //检查是否登录参考代码,需要用的时候，可以把注释取掉
            //if(this.checkLogin()==false){
            //	return;
            //}

            //this.getLaction();//得到gps

            this.page = 0;

            //检测有没有传入id参数
            if (options.id != null && options.id != '') {
                this.id = options.id;
            }
            //执行初始化,需要用的时候，可以把注释取掉
            // this.Refresh("init");
        }
        private loadFunction() {
            if(this.isLogin && this.isPro){
                this.findMessageAll()
            }
        }
        onShow(){
            
        }
        getMessageCount(msg){
            let types = ["like", 'love','focusOn']
            let token = uni.getStorageSync("token")
            let id = types.includes(msg.type) ? msg.type : msg.fromOpenId == token ? msg.toOpenId : msg.fromOpenId;
            let storeage = uni.getStorageSync("noticeArr")
            let noticeArr = storeage ? JSON.parse(storeage) : [];
            let index = noticeArr.findIndex(item => item.id == id);
            if(index==-1){
                return 0;
            }else{
                return noticeArr[index].unreadNum
            }
        }

        getDateDiff(data) {
            // 传进来的data必须是日期格式，不能是时间戳
            //var str = data;
            //将字符串转换成时间格式
            var timePublish = new Date(data);
            var timeNow = new Date();
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var month = day * 30;
            var result = '2';
            var diffValue = timeNow - timePublish;
            var diffMonth = diffValue / month;
            var diffWeek = diffValue / (7 * day);
            var diffDay = diffValue / day;
            var diffHour = diffValue / hour;
            var diffMinute = diffValue / minute;
            if (diffValue < 0) {

            } else if (diffMonth > 3) {
                result = timePublish.getFullYear() + '-';
                result += timePublish.getMonth() + '-';
                result += timePublish.getDate();
            } else if (diffMonth > 1) {
                result = parseInt(diffMonth) + '月前';
            } else if (diffWeek > 1) {
                result = parseInt(diffWeek) + '周前';
            } else if (diffDay > 1) {
                result = parseInt(diffDay) + '天前';
            } else if (diffHour > 1) {
                result = parseInt(diffHour) + '小时前';
            } else if (diffMinute > 1) {
                result = parseInt(diffMinute) + '分钟前';
            } else {
                result = '刚刚';
            }
            return result;
        }
        /**
         * icon_4处理函数
         * 数据绑定  data-index="{{index}}"
         * 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
         */
        private icon_4_click(event: any): void {}

        /**
         * icon_5处理函数
         * 数据绑定  data-index="{{index}}"
         * 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
         */
        private icon_5_click(event: any): void {
            uni.navigateTo({
                url:"/message/pages/focusForMe/index?type=fans"
            })
        }

        /**
         * icon_6处理函数
         * 数据绑定  data-index="{{index}}"
         * 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
         */
        private icon_6_click(type) {
            this.readMessage(type)
            uni.navigateTo({
                url:'/message/pages/likeOrLoveMe/index?type='+type
            })
        }

        /**
         * msg_17_17处理函数
         * 数据绑定  data-index="{{index}}"
         * 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
         */
        private msg_17_17_click(event: any): void {}

        /**
         * icon_40处理函数
         * 数据绑定  data-index="{{index}}"
         * 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
         */
        private goToMessage(params: any): void {

            params.nickName = params.fromOpenId == uni.getStorageSync("token") ? params.toName : params.fromName;
            params.openid = params.fromOpenId == uni.getStorageSync("token") ? params.toOpenId : params.fromOpenId;
            let token = uni.getStorageSync("token");
            let id = params.fromOpenId == token ?params.toOpenId:params.fromOpenId;
            this.readMessage(id)
            uni.navigateTo({
                url: "/message/pages/components/msgChart?data=" + encodeURIComponent(JSON.stringify(params))
            });
        }
        // 下拉刷新
        private onPullDownRefresh() {
            this.findMessageAll()
        }
        private acceptMessage(msg) {
            this.findMessageAll()
        }
    }
</script>

<style lang="scss" scoped>
    @import './msg.scss';
</style>
