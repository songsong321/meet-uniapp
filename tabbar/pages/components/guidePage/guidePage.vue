<template>
    <view class="bg">
        <view class="main">
            <view class="text-box">
                <text class="text">{{teststr}}</text>
            </view>
            <view>
                <u-button shape="circle" @click="enter()">
                    <u-icon name='weixin-fill' style="margin-right: 4px;" color="green"></u-icon>
                    微信一键登录
                </u-button>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                textWriter: "欢迎来到小方片",
                teststr: ""
            }
        },
        methods: {
            enter() {
                this.$emit("enter")
            },
            setData() {
                let i = 0;
                let timer = setInterval(() => {
                    if (i <= this.textWriter.length) {
                        this.teststr = this.textWriter.slice(0, i++) + '_'
                    } else {
                        this.teststr = this.textWriter
                        clearInterval(timer)
                    }
                }, 200)

            },
        },
        created() {
            this.setData()
        }

    }
</script>

<style scoped>
    .bg {
        width: 100%;
        height: 100%;
        background-color: #e4f4da;
        background-image: url("https://songhan.top/files/share.jpg");
        background-size: 100%;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .main {
        width: 60%;
        text-align: center;
        position: relative;
        top: 15%;
    }

    .text-box {
        width: 100%;
        font-size: 1.5rem;
        margin-bottom: 20px;
        text-fill-color: #00FF00;
    }

    .text {
       font-family: 'manhuati';
        font-weight: bold;
    }
</style>
