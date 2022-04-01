<template>
    <view class="page" >
        <view class="wrapper" v-if="isLogin && isPro==1">
           <view>
               <xingqiu :listData='listData'></xingqiu>
           </view>
            <view class="top_title" style="margin-bottom: 30upx;margin-top: 30upx;">
                <u-row>
                    <u-col>
                        <text class="title">趣味交友</text>
                    </u-col>
                </u-row>
            </view>
            <view class="u-demo-block__content">
                <u-row >
                    <u-col span="4">
                        <view @tap='goToSky' class="dl">
                            <view class="dt">
                                <image src="/static/MyApplets/img/motianlun.png" mode=""></image>
                            </view>
                            <view class="dd">
                                <text>摩天轮</text>
                            </view>
                        </view>
                    </u-col>
                    <u-col span="4">
                        <view @tap='goToBarrage' class="dl">
                            <view class="dt">
                                <image src="/static/MyApplets/img/yuzhou.png" mode=""></image>
                            </view>
                            <view class="dd">
                                <text>宇宙聊天室</text>
                            </view>
                        </view>
                    </u-col>
                    <u-col span="4">
                        <view @tap='goToBlind' class="dl">
                            <view class="dt">
                                <image src="/static/MyApplets/img/box.png" mode=""></image>
                            </view>
                            <view class="dd">
                                <text>盲盒交友</text>
                            </view>
                        </view>
                    </u-col>
                    <u-col span="3">

                    </u-col>
                </u-row>
            </view>
        </view>
       <guidePage v-if="!isLogin && isPro==1" @enter='login'></guidePage>
       <audit v-if='!isPro && isPro==0'></audit>
    
    </view>
</template>

<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator';
    import {acceptMessage} from "@/mixins/acceptMessage"
   import xingqiu from "./components/xingqiu.vue"
   import {getUsers,login} from "@/api/user"
   import {mapActions} from 'vuex'
    @Component({
        name: 'IndexPage',
        mixins:[acceptMessage],
        methods: {
            ...mapActions({
                openWebsocket: "openWebsocket",
                
            })
        },
        components:{
            xingqiu
           
        }
    }) // 装饰器
    export default class IndexPage extends Vue {
        // data
        private message ? : string = '';
        private listData?:Array<object> = [];
        private bgBase ? : string = "";
        private swiperList?:Array<string> = ['https://cdn.uviewui.com/uview/swiper/1.jpg','https://cdn.uviewui.com/uview/swiper/2.jpg','https://cdn.uviewui.com/uview/swiper/3.jpg'];
        // methods
        // 去夜晚弹幕
        private goToBarrage(): void {
            uni.navigateTo({
                url: '/pages/index/components/barrage/barrage'
            });
        }
        // 去摩天轮页面
        private goToSky(): void {
            uni.navigateTo({
                url: '/pages/index/components/play/play'
            });
        }
        private async getUsers(isLoading = true){
            let res = await getUsers(isLoading);
            this.listData = res.data.content || []
        }
        /**
         * 盲盒交友
         */
        private goToBlind(){
            uni.navigateTo({
                url:"/pages/pages/blindBox/index"
            })
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
                            uni.showTabBar({
                                fail:err=>{
                                    console.log(err,'err')
                                }
                            
                            })
                            this.getUsers()
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
        created(){
            
        }
        onShow(){
            
        }
        private loadFunction(){
            if(this.isLogin && this.isPro){
                this.getUsers(false)
            } 
        }
        
    }
</script>

<style lang="scss" scoped>
    .page {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-image: url("https://songhan.top/files/main-bg.png");
    }
    

    .wrapper {
        margin: 0 auto;
        width: calc(100% - 40upx);
        padding: 20upx;
        height: 100%;

        .title {
            color: #666666;
            padding: 10upx 20upx;
            background: rgba(255,255,0,0.4);
            border-radius: 30upx;
        }

        .dl {
            width: 100%;
            background:rgba(0,255,0,0.2);
            border-radius: 30upx;
            padding-bottom: 10upx;
            .dt {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-around;

                image {
                    width: 100upx;
                    height: 100upx;
                }
            }
            .dd {
                color: #666666;
                font-weight: bold;
                margin-top: 0upx;
                display: flex;
                align-items: center;
                justify-content: space-around;
            }
        }
    }
</style>
