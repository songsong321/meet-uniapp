<template>
    <view>
        
        <view class="wrapper">

            <view class="barrage">
                <l-barrage ref='lBarrage' :onLineNum='onLineNum'></l-barrage>

            </view>
            <view class="bg">
                <my-bg></my-bg>
                <view class="send">
                    <u-input v-model="message" :clearable="false" placeholder="快来畅聊吧"></u-input>
                    <u-button type='primary' plain @click="send">发送</u-button>
                </view>
            </view>

        </view>
        <u-top-tips ref="uTips"></u-top-tips>
    </view>

</template>
<script lang="ts">
    import {
        Component,
        Vue,
    } from 'vue-property-decorator';
    import lBarrage from '@/components/l-barrage/l-barrage.vue';
    import myBg from '@/components/p-meteorShower/meteorShower.vue';
    import {
        baseUrl
    } from "@/util/util"
    @Component({
        name: 'IndexPage',
        components: {
            lBarrage,
            myBg
        }
    }) // 装饰器
    export default class IndexPage extends Vue {


        // data
        private message ? : string = "";
        private ws ? : object = null;
        private onLineNum = 0;
        // methods
        private send(): void {
            /*插入一条弹幕*/
            this.ws.send({
                data: JSON.stringify({
                    type: 'worldtext',
                    message: this.message
                }),
                success: () => {
                    this.message = ''
                },
                fail: () => {
                    this.$refs.uTips.show({
                        title: '发送失败',
                        type: 'error',
                        duration: '1500'
                    })
                }
            })
        }
        beforeDestroy() {
            console.log(123)
            if (this.ws) {
                this.ws.close({
                    code: 1000,
                    success: res => {
                        console.log(res)
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            }
        }
        onReady(){
            uni.setNavigationBarColor({backgroundColor:"#121212",frontColor:"#ffffff"})
        }
        onShow() {
            let token = uni.getStorageSync('token')
            if (!token) {
                uni.switchTab({
                    url: "/tabbar/pages/mine"
                })
                return;
            }
            this.ws = uni.connectSocket({
                url: baseUrl.indexOf('songhan.top') >= 0 ? "wss://" + baseUrl + "wsRoom/" + token :
                    "ws://" +
                    baseUrl + "wsRoom/" + token,
                success: res => {

                },
                fail(err) {
                    console.log(err)
                }
            })
            if (this.ws) {
                this.ws.onMessage(res => {
                    console.log(res,'res')
                    let msg = JSON.parse(res.data)
                    if (msg.type == 'worldtext') {
                        this.$refs.lBarrage.add(msg.message)
                    } else if (msg.type == 'worldsystem') {
                        console.log(msg,'msg')
                        this.onLineNum = msg.message
                    }
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .bg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;

        .send {
            width: 80%;
            padding: 20upx;
            border-radius: 30upx;
            position: absolute;
            bottom: 30upx;
            left: 10%;
            display: flex;

            ::v-deep u-input {
                width: 70%;

                input {
                    width: 100%;
                    color: white;
                }
            }

            ::v-deep u-button {
                width: 30%;

                button {
                    width: 100%;
                }
            }
        }
    }

    .barrage {
        width: 100%;
        height: 52%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }
</style>
