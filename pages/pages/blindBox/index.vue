<template>
    <audit v-if='!isPro && isPro==0'></audit>
    <view v-else>
        <view class="flex-column">
            <view class="title flex-row-center">
                <image src="../../static/title.png" mode="widthFix"></image>
                <image class="home-top" src="../../static/home-top.png" mode="widthFix"></image>
                <text class="home-top-text">{{ title[navIndex] }}</text>
            </view>
            <image class="more-icon" src="../../static/more.png" mode="widthFix"></image>
            <friend-pro v-if="navIndex == 0" @sexchange="checkSex" :num-man="numMan" :num-woman='numWoman'></friend-pro>
            <friend-pay v-if="navIndex == 1" :sex="sex" @changenav="navChange" @paysuccess="paySuccess"
                @putmsg="putMsg"></friend-pay>
            <friend-result v-if="navIndex == 2" :sex="sex" @changenav="navChange" :content="content"></friend-result>
            <friend-put v-if="navIndex == 3" :sex="sex" @changenav="navChange"></friend-put>
            <image class="bg-image" src="https://songhan.top/files/bg.png" mode="aspectFill"></image>

        </view>
    </view>
</template>

<script>
    import friendPro from '../../components/friend-pro/friend-pro.vue'
    import friendPut from '../../components/friend-put/friend-put.vue'
    import friendPay from '../../components/friend-pay/friend-pay.vue'
    import friendResult from '../../components/friend-result/friend-result.vue'
    import {
        findPaperLen
    } from '@/api/user/index'
    import {
        acceptMessage
    } from "@/mixins/acceptMessage"
    export default {
        components: {
            friendPro,
            friendPut,
            friendPay,
            friendResult
        },
        mixins: [acceptMessage],
        data() {
            return {
                navIndex: 0,
                sex: 0,
                title: ["请选择您的性别", "抽取纸条", "打开纸条", "投入纸条"],
                content: '',
                numMan: 0,
                numWoman: 0,
            }
        },
        watch: {
            navIndex: {
                handler: function(val) {
                    if (val == 0) {
                        this.findPaperLen()
                    }
                },

            }
        },
        onLoad() {
            var me = this;
            uni.getSystemInfo({
                success: function(res) { // res - 各种参数
                    me.swiperHeight = res.windowHeight - 90
                }
            });
        },
        onShow() {
            var me = this;
            this.findPaperLen()
        },
        methods: {
            async findPaperLen() {
                let res = await findPaperLen()
                this.numMan = res.data.manLen || 0;
                this.numWoman = res.data.womanLen || 0
            },
            checkSex(sex) {
                var me = this;
                me.sex = sex
                me.navIndex = 1
            },
            navChange(index) {
                var me = this;
                me.navIndex = index
            },
            paySuccess(item) {
                var me = this;
                me.navIndex = 2
                me.sex = item.sexIndex
                me.content = item.content
            },
            putMsg(item) {
                var me = this;
                me.navIndex = 3
                me.sex = item.sexIndex

            },
        }
    }
</script>

<style lang="scss" scoped>
    .more-icon {
        position: fixed;
        z-index: 9999;
        width: 60rpx;
        top: 150rpx;
        right: 80rpx;
    }

    .company {
        position: fixed;
        bottom: 60rpx;
        color: #fff;
        font-size: 22rpx;
    }

    .ad {
        position: fixed;
        bottom: 50rpx;
        color: #fff;
        font-size: 22rpx;
        width: 90%;
        background-color: #fff;
        color: #212121;

        image {
            width: 150rpx;
            height: 150rpx;
        }

        .right {
            height: 150rpx;
            padding: 10rpx 20rpx;
            align-items: flex-start;
            width: 80%;

            .title {
                font-size: 32rpx;
            }

            .content {
                margin-top: 10rpx;
                color: $minor-text-color;
            }
        }
    }

    .title {
        image {
            position: absolute;
            top: 160rpx;
            width: 70%;
        }

        .home-top {
            position: absolute;
            top: 400rpx;
            z-index: 9;
        }

        .home-top-text {
            position: absolute;
            top: 430rpx;
            z-index: 99;
            font-size: 35rpx;
            font-weight: bold;
        }
    }

    .sex-block {
        position: absolute;
        top: 450rpx;
        width: 90%;
        background-color: #fff;
        border-radius: 30rpx;
        justify-content: space-around;
        padding: 240rpx 30rpx;

        image {
            width: 180rpx;
        }

        text {
            margin-top: 20rpx;
        }
    }

    page {
        background-color: #fff;
        font-size: 28rpx;
        color: #212121;
    }

    .container {
        padding: 20rpx;
    }

    .iconfont {
        font-family: "iconfont" !important;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }

    /*每个页面公共css */
    @font-face {
        font-family: 'iconfont';
        /* project id 1997429 */
        src: url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.eot');
        src: url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.eot?#iefix') format('embedded-opentype'),
            url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.woff2') format('woff2'),
            url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.woff') format('woff'),
            url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.ttf') format('truetype'),
            url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.svg#iconfont') format('svg');
    }

    .main-bg {
        background-color: #da649a;
    }

    .main-text {
        color: #da649a;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .flex-row-center {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .flex-row-left {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .flex-row-right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .flex-column-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .clear {
        clear: both;
    }

    .empty-block {
        margin-top: 20%;
    }

    .padding10 {
        padding: 0 10rpx;
    }

    .padding20 {
        padding: 0 20rpx;
    }

    .padding30 {
        padding: 0 30rpx;
    }

    .tui-header-box {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9998;
        height: 140rpx;
    }

    .tui-header {
        width: 100%;
        font-size: 18px;
        line-height: 18px;
        font-weight: 500;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 80rpx;
    }

    .tui-header-icon {
        position: fixed;
        left: 10px;
        top: 80rpx;
        display: flex;
        align-items: flex-start;
        height: 38px;
        transform: translateZ(0);
        z-index: 99999;
    }

    .tui-icon-ml {
        margin-left: 20rpx;
    }

    .icon-zuojiantou {
        height: 32px !important;
        width: 32px !important;
        display: block !important;
        border-radius: 50%;
    }

    .tui-icon-more {
        height: 20px !important;
        width: 20px !important;
        padding: 6px !important;
        display: block !important;
    }

    .tui-header-icon .iconfont {
        padding: 10rpx;
        border-radius: 50%;
    }

    .slot-wrap {
        padding: 0 30rpx;
    }

    .navbar-right {
        margin-right: 30rpx;

        .add-icon {
            margin-right: 5rpx;
        }
    }

    .header-zhan {
        height: 100px;
    }

    .signs {
        text {
            margin-right: 20rpx;
            font-size: 20rpx;
            border: 1px solid #f2f2f2;
            border-radius: 50rpx;
            padding: 0 15rpx;
        }
    }

    .load-more {
        padding: 30rpx 0;
    }

    .bg-image {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: -1;
    }
</style>
