<template>
    <view>
    <view class="YmContent " v-if="isLogin && isPro==1">
        <view class="myself">
            <view class="login" v-if="!isLogin" @click="login">点击登录>>></view>

            <view v-else>
                <view class="left fl">
                    <u-avatar size="large" mode="square" :show-level="userInfo.level >= 5" show-sex
                        :sex-icon="userInfo.gender == 1 ? 'man' : 'woman'" :src="userInfo.avatarUrl"></u-avatar>
                </view>
                <view class="right fl ml-40">
                    <view class="top">{{ userInfo.nickName }}</view>
                    <view class="bottom">
                        <text @click="goToFen" class="num">{{userInfo.fannum || 0}}</text>
                        <text @click="goToFen" class="text">粉丝</text>
                        <text @click="my_service_14_14_click" class="num">{{userInfo.focusonnum || 0}}</text>
                        <text @click="my_service_14_14_click" class="text">关注</text>
                    </view>
                </view>
            </view>
            <view v-if="isLogin" style="display: flex;align-items: center;position: relative;bottom: 15upx;">
                <text style="color: #C0C0C0;" @click="goToInfo">个人主页</text>
                <image style="width: 30upx; height: 30upx;margin-left: 4upx;position: relative;bottom: 1upx;"
                    src="../../static/MyApplets/img/right.png" mode=""></image>
            </view>
        </view>
        <view style="clear:both"></view>
        <u-gap height="20" bg-color="whitesmoke"></u-gap>
        <view class="my_service_1" v-if="isLogin">
            <text decode="true" class="my_service_5">我的等级</text>
            <view style="clear: both;"></view>
            <view class="level my_service_6" style="height: auto;">
                <view class="now">
                    <image src="../../static/MyApplets/img/level.png" mode=""></image>
                    <text>{{ userInfo.level }}</text>
                </view>
                <view class="press">
                    <u-line-progress active-color="#33CCFF" height="22" :striped="true" :percent="getPercent"
                        :striped-active="true">
                        <view></view>
                    </u-line-progress>
                </view>
                <view class="experinece">
                    <text>{{ userInfo.experinece }}/{{ userInfo.level * 1 * 500 }}</text>
                </view>
                <view class="next">
                    <image src="../../static/MyApplets/img/level.png" mode=""></image>
                    <text>{{ userInfo.level + 1 }}</text>
                </view>
            </view>
        </view>
        <view class="my_service_1" v-if="isLogin" style="position: relative;">
            <text decode="true" class="my_service_5">我的卡</text>
            <view style="clear: both;"></view>
            <view class="my_service_6" style="height: auto;">
                <view
                    :class="['mycard', { normal_card: userInfo.accountcategory == 1, black_card: userInfo.accountcategory == 2 }]">
                    <image class="bg" lazy-load v-if="userInfo.accountcategory == 1"
                        src="../../static/MyApplets/img/normal.png" mode=""></image>
                    <image class="bg" lazy-load v-if="userInfo.accountcategory == 2"
                        src="../../static/MyApplets/img/black-vip.png" mode=""></image>
                    <view style="z-index: 99;position: relative;height: 100%;">
                        <view class="vip_name">{{ userInfo.accountcategory == 1 ? '会员卡' : '黑金卡' }}</view>
                        <view class="num serial">{{ getNum }}</view>
                    </view>
                </view>
            </view>
            <view style="clear: both;"></view>
            <view
                style="display: flex;align-items: center; font-size: 25rpx;padding-left: 41rpx;margin-top: 10rpx;color: #FF9933;font-weight: bold;position: absolute;bottom:20rpx;left: 50rpx;">
                <image style="width: 40rpx;height: 40rpx;" src="../../static/MyApplets/img/gold.png" mode=""></image>
                <text>{{userInfo.goldNum}}</text>
            </view>
        </view>
        <view class="my_service_1">
            <text decode="true" class="my_service_5">我的足迹</text>
            <view class="my_service_6">
                <view class="my_service_7">
                    <image v-on:click="my_service_8_8_click()" src="/static/my_service/images/fa.png" mode="scaleToFill"
                        border="0" class="my_service_8"></image>
                    <text decode="true" class="my_service_9">我发布的</text>
                </view>
                <view class="my_service_10">
                    <image v-on:click="my_service_11_11_click()" src="/static/my_service/images/dian.png"
                        mode="scaleToFill" border="0" class="my_service_11"></image>
                    <text decode="true" class="my_service_12">我点赞的</text>
                </view>
                <view class="my_service_13">
                    <image v-on:click="my_service_14_14_click()" src="/static/my_service/images/love.png"
                        mode="scaleToFill" border="0" class="my_service_14"></image>
                    <text decode="true" class="my_service_15">我关注的</text>
                </view>
                <view class="my_service_16">
                    <image v-on:click="my_service_17_17_click()" src="/static/my_service/images/shou.png"
                        mode="scaleToFill" border="0" class="my_service_17"></image>
                    <text decode="true" class="my_service_18">我收藏的</text>
                </view>
            </view>
        </view>
        <view class="my_service_1" style="margin-top: 0;">
            <text decode="true" class="my_service_5">获取金币</text>
            <view style="clear: both;"></view>
            <view class="my_service_6" style="margin-top: 0;">
                <view class="my_service_7" @click="signin()">
                    <image src="/static/MyApplets/img/qian.png" mode="scaleToFill" border="0" class="my_service_8">
                    </image>
                    <text decode="true" class="my_service_9">每日签到</text>
                </view>
                <view class="my_service_10" @click="vipShow = true">
                    <image src="/static/MyApplets/img/vip.png" mode="scaleToFill" border="0" class="my_service_11">
                    </image>
                    <text decode="true" class="my_service_12">升级会员</text>
                </view>
                <view class="my_service_13" @click="shareShow = true">
                    <image src="../../static/MyApplets/img/shaer.png" mode="scaleToFill" border="0"
                        class="my_service_14"></image>
                    <text decode="true" class="my_service_15">分享朋友圈</text>
                </view>
                <view class="my_service_16">
                    <image v-on:click="goToLucky()" src="../../static/MyApplets/img/lucky.png" mode="scaleToFill"
                        border="0" class="my_service_17"></image>
                    <text decode="true" class="my_service_18">金币抽奖</text>
                </view>
            </view>
        </view>
        <view class="poup">
            <u-popup v-model="show" mode="center">
                <view class="signin">
                    <image class="light start" src="../../static/MyApplets/img/light.png" mode=""></image>
                    <view class="inner">
                        <image class="bg" src="../../static/MyApplets/img/register.png" mode=""></image>
                        <view class="header"><text>签到成功</text></view>
                        <view class="main">
                            <view>
                                已连续签到
                                <text style="color: yellow;margin: 0 10upx;">{{ userInfo.signinDays }}</text>
                                天
                            </view>
                            <view>
                                <text>已获得{{ userInfo.signinDays * 100 }}经验值</text>
                            </view>
                            <view>
                                <text>已获得{{ userInfo.signinDays * 1 }}金币</text>
                            </view>
                            <view class="little"><text>温馨提示:签到天数越多获得经验和金币越多哟</text></view>
                        </view>
                    </view>
                </view>
            </u-popup>
        </view>
        <view class="loading">{{ loadingText }}</view>
        <view class="ymBbottom"></view>
        <share :show='shareShow' @close='shareShow = false'></share>
        <u-popup v-model="vipShow" mode="center">
            <view class="vipCode">
                <u-input v-model="vipCode" border="true" placeholder="请输入激活码"></u-input>
                <text class="link" @click="goToGetCode">获得激活码</text>
                <view style="width: 70%;margin: 0 auto;">
                    <u-button type="warning" @click="getVip">激活</u-button>
                </view>
            </view>
        </u-popup>
    </view>
    <guidePage v-if="!isLogin && isPro==1" @enter='login'></guidePage>
    <audit v-if='!isPro && isPro==0'></audit>
  
    </view>
    
</template>

<script lang="ts">
    import {
        login,
        signIn,
        setUserType
    } from '@/api/user/index';
    import {
        Component,
        Vue
    } from 'vue-property-decorator';
    import share from '@/tabbar/pages/components/share.vue'
    import {
        mapActions,
        mapGetters
    } from 'vuex';
    import {
        acceptMessage
    } from "@/mixins/acceptMessage"
    @Component({
        name: 'MinePage',
        mixins: [acceptMessage],
        methods: {
            ...mapActions({
                openWebsocket: "openWebsocket",
                sendMessage: "sendMessage",
                setKey: 'user/setKey'
            })
        },
        computed: {
            ...mapGetters({
                getUserInfo: 'user/getUserInfo'
            })
        },
        components: {
            share
        }
    }) // 装饰器
    export default class MinePage extends Vue {
        // computed
        private get getPercent(): number {
            if (this.userInfo) {
                return (this.userInfo.experinece / (this.userInfo.level * 500)).toFixed(2) * 100;
            } else {
                return ''
            }

        }
        // computed 获取用户信息
        private get userInfo(): object {
            return Object.keys(this.getUserInfo).length > 0 ? this.getUserInfo : uni.getStorageSync('userInfo') ?
                JSON.parse(uni.getStorageSync('userInfo')) : {}
        }

        // 获取卡号
        private get getNum(): string {
            if (this.userInfo) {
                let num: string = this.userInfo.id + '';
                let cardNumLength: number = num.length;
                for (let i = cardNumLength; i <= 6; i++) {
                    num = '0' + num;
                }
                return num;
            } else {
                return 0;
            }

        }

        // data
        private vipCode: String = ''
        private vipShow: boolean = false
        private shareShow: boolean = false
        private show: boolean = false;
        private isLogin: boolean = uni.getStorageSync('token') ? true : false;
        private days: number = 0;
        // 接受用户信息


        // methods
        // 进入详情页面
        private async goToInfo(): void {
            let userInfoString = JSON.stringify(this.userInfo);
            uni.navigateTo({
                url: '/mine/pages/info?info=' + userInfoString + "&openId=" + this.userInfo.openid
            });
        }
        private goToGetCode(){
            uni.navigateTo({
                url:'/mine/pages/getCode/index'
            })
        }
        // 测试文件上传
        private my_service_8_8_click(): void {
            uni.navigateTo({
                url: "/mine/pages/myRelease/myRelease"
            })
        }
        private async setUserType(){
            let res = await setUserType({vipCode:this.vipCode})
            uni.showToast({
                title:res.data,
                icon:"none",
                duration:2000
            })
            this.aautoLogin()
        }
        private getVip(){
            let token = uni.getStorageSync("token") || ''
            if(token){
                if(this.vipCode){
                    this.setUserType()
                }else{
                    uni.showToast({
                        title:"请输入激活码",
                        icon:"none",
                        duration:2000
                    })
                }
            }else{
                uni.showToast({
                    title:"请先登录",
                    icon:"none",
                    duration:2000
                })
            }
        }
        /**
         * 点赞
         */
        private my_service_11_11_click(): void {
            uni.navigateTo({
                url: "/mine/pages/myLike/myLike"
            })

        }
        /**
         * 收藏
         */
        private my_service_17_17_click() {
            uni.navigateTo({
                url: "/mine/pages/myLove/myLove"
            })
        }
        // 打开签到弹窗
        private async signin(): void {
            uni.requestSubscribeMessage({
                tmplIds: ['tbfLA_9YQBo9tU4johFCewTz995_G86VMwgKL1CHGrE'],
                success: async (res) => {
                    try {
                        let res = await signIn()
                        if (res.code == 200) {
                            if (res.data.success) {
                                let userInfo = JSON.parse(JSON.stringify(this.userInfo));
                                userInfo.experinece = res.data.experinece;
                                userInfo.signinDays = res.data.days;
                                uni.setStorageSync('userInfo', JSON.stringify(userInfo));
                                this.setKey({
                                    key: "userInfo",
                                    value: userInfo
                                })
                                await this.autoLogin();
                                this.show = true;
                            } else {
                                uni.showToast({
                                    title: res.data.message,
                                    icon: 'none'
                                });
                            }
                        }
                    } catch (error) {
                        console.log(error, 'catch')
                    }
                },
                fail: err => {
                    console.log(err, 'err')
                    uni.showToast({
                        title: "取消授权",
                        icon: "none",
                        duration: 2000
                    })
                }
            });
        }
        goToFen() {
            uni.navigateTo({
                url: "/message/pages/focusForMe/index?type=fans"
            })
        }
        private goToLucky() {
            uni.navigateTo({
                url: '/mine/pages/luckyDraw/index'
            })
        }
        private my_service_14_14_click(): void {
            uni.navigateTo({
                url: "/message/pages/focusForMe/index?type=focus"
            })
        }
        onShareAppMessage() {
            return {
                title: "我在小方片等你！快来和我一起畅聊吧！", //分享标题名称
                path: `/tabbar/pages/index`, //根据id跳转相应内容详情页中，数据更据id请求得到的话，必须添加参数
                imageUrl: 'https://songhan.top/files/share.jpg', // 分享封面图片
                success(res) { // 分享成功回调
                    console.log(res, 'res')
                    
                },
                fail(err) {
                    console.log(err, 'err')
                }
            }
        }
        onShareTimeline() {
            return {
                title: "我在小方片等你！快来和我一起畅聊吧！", //分享标题名称
                path: `/tabbar/pages/index`, //根据id跳转相应内容详情页中，数据更据id请求得到的话，必须添加参数
                imageUrl: 'https://songhan.top/files/share.jpg', // 分享封面图片
                success(res) { // 分享成功回调
                    console.log(res, 'res')
        
                },
                fail(err) {
                    console.log(err, 'err')
                }
            }
        }
        // 登录
        private login(): void {
            uni.getUserProfile({
                desc: '获取信息',
                provider: 'weixin',
                success: async (infoRes: any): void => {
                    let code: string = await this.getCode();
                    let params: any = infoRes.userInfo;
                    console.log(infoRes, 'infoRes')
                    params.code = code;
                    let res: any = await login(params, false);
                    if (res) {
                        if (res.code == 200) {
                            uni.setStorageSync('token', res.data.openid);
                            uni.setStorageSync('userInfo', JSON.stringify(res.data));
                            this.setKey({
                                key: "token",
                                value: res.data.openid
                            })
                            this.setKey({
                                key: "userInfo",
                                value: res.data
                            })
                            this.isLogin = true;
                            this.openWebsocket()
                        } else {
                            uni.showToast({
                                title: res.message
                            });
                        }
                    }
                },
                fail: (error: any): void => {
                    console.log(error, 'error');
                }
            });
        }
        // 获取code
        private getCode(): Promise {
            return new Promise((resolve: any, reject: any) => {
                uni.login({
                    provider: 'weixin',
                    success: (res: any): void => {
                        resolve(res.code);
                    },
                    fail: (error: any): void => {
                        reject(error);
                    }
                });
            });
        }
        // 隐式登录
        private async autoLogin(): void {
            let token: any = uni.getStorageSync('token') || '';
            if (token) {
                try {
                    const res = await login({}, true);
                    if (res) {
                        if (res.code == 200) {

                            uni.setStorageSync('token', res.data.openid);
                            uni.setStorageSync('userInfo', JSON.stringify(res.data));
                            this.setKey({
                                key: "token",
                                value: res.data.openid
                            })
                            this.setKey({
                                key: "userInfo",
                                value: res.data
                            })
                            this.isLogin = true;
                            this.openWebsocket()
                        } else {
                            uni.showToast({
                                title: res.message
                            });
                        }
                    }
                } finally {
                    uni.stopPullDownRefresh()
                }

            }
        }
        // 生命周期
        private async created(): void {
   
        }
        private loadFunction() {
            if(this.isLogin && this.isPro){
                this.autoLogin();
            }
            
        }
        onShow(){
            
        }
        // 下拉刷新
        private onPullDownRefresh() {
            this.autoLogin()
        }
    }
</script>

<style lang="scss" scoped>
    @import './my.scss';

    .myself {
        white-space: normal;
        width: 663upx;
        padding: 0upx;
        clear: both;
        margin-top: 40upx;
        margin-left: 43upx;
        border-radius: 0upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #app {
        // height: 100%;
        width: 100%;
    }

    .YmContent {
        // height: 100%;
        width: 100%;
    }

    #app {
        // height: 100%;
    }

    button::after {
        border: none;
        width: auto;
    }

    input {
        outline: none;
        border: none;
        list-style: none;
        width: auto;
    }

    .list_item {
        float: left;
    }

    .ym_hide {
        display: none;
    }

    .ym_show {
        display: block;
    }

    .slide-image {
        width: 100%;
        height: 100%;
    }

    .list_horizontal {
        width: auto;
        display: inline-block;
    }

    .my_service_1 {
        white-space: normal;
        width: 749upx;

        padding: 0upx;
        clear: both;
        float: left;
        background-color: #ffffff;
        border-radius: 0upx;
        font-size: 8upx;
    }
    
    .my_service_1 .my_service_2 {
        white-space: normal;
        width: 663upx;
        height: 113upx;
        padding: 0upx;
        clear: both;
        margin-top: 40upx;
        margin-left: 43upx;
        float: left;
        border-bottom-color: #e1e1e1;
        border-bottom-width: 1upx;
        border-bottom-style: solid;
        border-radius: 0upx;
        font-size: 8upx;
    }

    .my_service_1 .my_service_2 .my_service_3 {
        white-space: normal;
        width: 73upx;
        height: 73upx;
        overflow: hidden;
        padding: 0upx;
        margin-top: 9upx;
        margin-left: 6upx;
        float: left;
        border-radius: 53upx;
        font-size: 8upx;
        line-height: 73upx;
    }

    .my_service_1 .my_service_2 .my_service_4 {
        white-space: normal;
        width: 382upx;
        height: 36upx;
        padding: 0upx;
        margin-top: 29upx;
        margin-left: 36upx;
        float: left;
        border-radius: 0upx;
        color: #000000;
        font-size: 30upx;
        line-height: 36upx;
    }

    .my_service_1 .my_service_5 {
        white-space: normal;
        width: 119upx;
        height: 37upx;
        padding: 0upx;
        clear: both;
        margin-top: 43upx;
        margin-left: 41upx;
        float: left;
        border-radius: 0upx;
        color: #c8c8c8;
        font-size: 22upx;
        line-height: 37upx;
    }

    .my_service_1 .my_service_6 {
        white-space: normal;
        width: 693upx;
        height: 186upx;
        padding: 0upx;
        clear: both;
        margin-top: 18upx;
        margin-left: 35upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
    }

    .vipCode {
        padding: 30rpx;
        background-color: white;
        height: 350rpx;
        border-radius: 20rpx;
        padding-top: 70rpx;
    }
    .link{
        color: #007AFF;
        line-height: 40rpx;
        font-size: 20rpx;
        display: block;
        text-align: right;
        margin: 20rpx 0;
    }
    .my_service_1 .my_service_6 .my_service_7 {
        white-space: normal;
        width: 108upx;
        height: 128upx;
        padding: 0upx;
        margin-top: 29upx;
        margin-left: 4upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
    }

    .my_service_1 .my_service_6 .my_service_7 .my_service_8 {
        white-space: normal;
        width: 78upx;
        height: 78upx;
        padding: 0upx;
        clear: both;
        margin-top: 0upx;
        margin-left: 14upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
        line-height: 78upx;
    }

    .my_service_1 .my_service_6 .my_service_7 .my_service_9 {
        white-space: normal;
        width: 108upx;
        height: 24upx;
        padding: 0upx;
        clear: both;
        margin-top: 25upx;
        margin-left: 0upx;
        float: left;
        text-align: center;
        justify-content: center;
        border-radius: 0upx;
        color: #808080;
        font-size: 20upx;
        line-height: 24upx;
    }

    .my_service_1 .my_service_6 .my_service_10 {
        white-space: normal;
        width: 108upx;
        height: 128upx;
        padding: 0upx;
        margin-top: 29upx;
        margin-left: 79upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
    }

    .my_service_1 .my_service_6 .my_service_10 .my_service_11 {
        white-space: normal;
        width: 77upx;
        height: 79upx;
        padding: 0upx;
        clear: both;
        margin-top: 0upx;
        margin-left: 14upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
        line-height: 79upx;
    }

    .my_service_1 .my_service_6 .my_service_10 .my_service_12 {
        white-space: normal;
        width: 108upx;
        height: 24upx;
        padding: 0upx;
        clear: both;
        margin-top: 24upx;
        margin-left: 0upx;
        float: left;
        text-align: center;
        justify-content: center;
        border-radius: 0upx;
        color: #808080;
        font-size: 20upx;
        line-height: 24upx;
    }

    .my_service_1 .my_service_6 .my_service_13 {
        white-space: normal;
        width: 108upx;
        height: 127upx;
        padding: 0upx;
        margin-top: 30upx;
        margin-left: 79upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
    }

    .my_service_1 .my_service_6 .my_service_13 .my_service_14 {
        white-space: normal;
        width: 78upx;
        height: 78upx;
        padding: 0upx;
        clear: both;
        margin-top: 0upx;
        margin-left: 14upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
        line-height: 78upx;
    }

    .my_service_1 .my_service_6 .my_service_13 .my_service_15 {
        white-space: normal;
        width: 108upx;
        height: 24upx;
        padding: 0upx;
        clear: both;
        margin-top: 24upx;
        margin-left: 0upx;
        float: left;
        text-align: center;
        justify-content: center;
        border-radius: 0upx;
        color: #808080;
        font-size: 20upx;
        line-height: 24upx;
    }

    .my_service_1 .my_service_6 .my_service_16 {
        white-space: normal;
        width: 110upx;
        height: 127upx;
        padding: 0upx;
        margin-top: 30upx;
        margin-left: 79upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
    }

    .my_service_1 .my_service_6 .my_service_16 .my_service_17 {
        white-space: normal;
        width: 79upx;
        height: 77upx;
        padding: 0upx;
        clear: both;
        margin-top: 0upx;
        margin-left: 14upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
        line-height: 77upx;
    }

    .my_service_1 .my_service_6 .my_service_16 .my_service_18 {
        white-space: normal;
        width: 107upx;
        height: 24upx;
        padding: 0upx;
        clear: both;
        margin-top: 25upx;
        margin-left: 0upx;
        float: left;
        text-align: center;
        justify-content: center;
        border-radius: 0upx;
        color: #808080;
        font-size: 20upx;
        line-height: 24upx;
    }

    .my_service_1 .my_service_22 {
        white-space: normal;
        width: 119upx;
        height: 27upx;
        padding: 0upx;
        clear: both;
        margin-top: 39upx;
        margin-left: 41upx;
        float: left;
        border-radius: 0upx;
        color: #c8c8c8;
        font-size: 23upx;
        line-height: 27upx;
    }

    .my_service_1 .my_service_20 {
        white-space: normal;
        width: 661upx;
        height: 83upx;
        padding: 0upx;
        clear: both;
        margin-top: 49upx;
        margin-left: 43upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
    }

    .my_service_1 .my_service_20 .my_service_23 {
        white-space: normal;
        width: 78upx;
        height: 78upx;
        padding: 0upx;
        margin-top: 4upx;
        margin-left: 13upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
        line-height: 78upx;
    }

    .my_service_1 .my_service_20 .my_service_24 {
        white-space: normal;
        width: 434upx;
        height: 74upx;
        padding: 0upx;
        margin-top: 8upx;
        margin-left: 40upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
    }

    .my_service_1 .my_service_20 .my_service_24 .my_service_25 {
        white-space: normal;
        width: 434upx;
        height: 33upx;
        padding: 0upx;
        clear: both;
        margin-top: 0upx;
        margin-left: 0upx;
        float: left;
        border-radius: 0upx;
        color: #000000;
        font-size: 32upx;
        line-height: 33upx;
    }

    .my_service_1 .my_service_20 .my_service_24 .my_service_26 {
        white-space: normal;
        width: 434upx;
        height: 25upx;
        padding: 0upx;
        clear: both;
        margin-top: 15upx;
        margin-left: 0upx;
        float: left;
        border-radius: 0upx;
        color: #646464;
        font-size: 27upx;
        line-height: 25upx;
    }

    .my_service_1 .my_service_20 .my_service_29 {
        white-space: normal;
        width: 15upx;
        height: 27upx;
        padding: 0upx;
        margin-top: 31upx;
        margin-left: 78upx;
        float: left;
        border-radius: 0upx;
        font-size: 25upx;
        line-height: 27upx;
    }

    .my_service_1 .my_service_30 {
        white-space: normal;
        width: 663upx;
        height: 2upx;
        padding: 0upx;
        clear: both;
        margin-top: 36upx;
        margin-left: 43upx;
        float: left;
        background-color: #e1e1e1;
        border-radius: 0upx;
        font-size: 1upx;
        line-height: 2upx;
    }

    .my_service_1 .my_service_48 {
        white-space: normal;
        width: 119upx;
        height: 27upx;
        padding: 0upx;
        clear: both;
        margin-top: 46upx;
        margin-left: 41upx;
        float: left;
        border-radius: 0upx;
        color: #c8c8c8;
        font-size: 23upx;
        line-height: 27upx;
    }

    .my_service_1 .my_service_66 {
        white-space: normal;
        width: 663upx;
        position: relative;
        height: 109upx;
        padding: 0upx;
        clear: both;
        margin-top: 44upx;
        margin-left: 43upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
    }

    .my_service_1 .my_service_66 .my_service_49 {
        white-space: normal;
        width: 78upx;
        height: 78upx;
        padding: 0upx;
        margin-top: 10upx;
        margin-left: 14upx;
        float: left;
        position: absolute;
        top: 0upx;
        left: 0upx;
        border-radius: 0upx;
        font-size: 8upx;
        line-height: 78upx;
    }

    .my_service_1 .my_service_66 .my_service_52 {
        white-space: normal;
        width: 192upx;
        height: 33upx;
        padding: 0upx;
        margin-top: 13upx;
        margin-left: 133upx;
        float: left;
        position: absolute;
        top: 0upx;
        left: 0upx;
        border-radius: 0upx;
        color: #000000;
        font-size: 31upx;
        line-height: 33upx;
    }

    .my_service_1 .my_service_66 .my_service_53 {
        white-space: normal;
        width: 338upx;
        height: 27upx;
        padding: 0upx;
        margin-top: 61upx;
        margin-left: 133upx;
        float: left;
        position: absolute;
        top: 0upx;
        left: 0upx;
        border-radius: 0upx;
        color: #646464;
        font-size: 24upx;
        line-height: 27upx;
    }

    .my_service_1 .my_service_66 .my_service_61 {
        white-space: normal;
        width: 109upx;
        height: 26upx;
        padding: 0upx;
        margin-top: 36upx;
        margin-left: 526upx;
        float: left;
        position: absolute;
        top: 0upx;
        left: 0upx;
        border-radius: 0upx;
        color: #c8c8c8;
        font-size: 24upx;
        line-height: 26upx;
    }

    .my_service_1 .my_service_66 .my_service_64 {
        white-space: normal;
        width: 15upx;
        height: 24upx;
        padding: 0upx;
        margin-top: 37upx;
        margin-left: 642upx;
        float: left;
        position: absolute;
        top: 0upx;
        left: 0upx;
        border-radius: 0upx;
        font-size: 22upx;
        line-height: 24upx;
    }

    .my_service_1 .my_service_67 {
        white-space: normal;
        width: 663upx;
        position: relative;
        height: 106upx;
        padding: 0upx;
        clear: both;
        margin-top: 43upx;
        margin-left: 43upx;
        float: left;
        border-radius: 0upx;
        font-size: 8upx;
    }

    .my_service_1 .my_service_67 .my_service_50 {
        white-space: normal;
        width: 78upx;
        height: 77upx;
        padding: 0upx;
        margin-top: 10upx;
        margin-left: 13upx;
        float: left;
        position: absolute;
        top: 0upx;
        left: 0upx;
        border-radius: 0upx;
        font-size: 8upx;
        line-height: 77upx;
    }

    .my_service_1 .my_service_67 .my_service_56 {
        white-space: normal;
        width: 255upx;
        height: 33upx;
        padding: 0upx;
        margin-top: 13upx;
        margin-left: 133upx;
        float: left;
        position: absolute;
        top: 0upx;
        left: 0upx;
        border-radius: 0upx;
        color: #000000;
        font-size: 30upx;
        line-height: 33upx;
    }

    .my_service_1 .my_service_67 .my_service_57 {
        white-space: normal;
        width: 336upx;
        height: 27upx;
        padding: 0upx;
        margin-top: 61upx;
        margin-left: 134upx;
        float: left;
        position: absolute;
        top: 0upx;
        left: 0upx;
        border-radius: 0upx;
        color: #646464;
        font-size: 27upx;
        line-height: 27upx;
    }

    .my_service_1 .my_service_67 .my_service_62 {
        white-space: normal;
        width: 108upx;
        height: 26upx;
        padding: 0upx;
        margin-top: 36upx;
        margin-left: 526upx;
        float: left;
        position: absolute;
        top: 0upx;
        left: 0upx;
        border-radius: 0upx;
        color: #646464;
        font-size: 24upx;
        line-height: 26upx;
    }

    .my_service_1 .my_service_67 .my_service_65 {
        white-space: normal;
        width: 15upx;
        height: 24upx;
        padding: 0upx;
        margin-top: 37upx;
        margin-left: 642upx;
        float: left;
        position: absolute;
        top: 0upx;
        left: 0upx;
        border-radius: 0upx;
        font-size: 22upx;
        line-height: 24upx;
    }

    .login {
        width: 100%;
        height: 100rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;
        bottom: 20rpx;
        color: $uni-color-primary;
        font-weight: bold;
        font-size: 30rpx;
    }
</style>
