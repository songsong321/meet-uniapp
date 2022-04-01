<template>
    <view class="flex-column">
        <view class="sex-block flex-column">
            <view class="h1 flex-row-center">恭喜您</view>
            <view class="h2 flex-row-center">抽取到一位有缘人，祝您好运！</view>
            <view class="content" @click="copyText(pageContent||content)">{{ pageContent || content }}</view>
            <view class="back-block flex-row">
                <view class="back-li" @click="$emit('changenav', 0)">返回首页</view>
                <view class="back-li" @click="findPaper">再抽一次</view>
            </view>
            <view class="remark flex-column">
                <view style="text-align: center;position: relative;">
                    <image style="height: 30rpx;position: absolute;top:0;bottom: 0;margin: auto;left: 0;right: 90px;"
                        src="../../static/tishi.png" mode="widthFix"></image>
                    <view class="li1" style="display: inline-block;">温馨提示</view>
                </view>
                <view class="li2">文明礼貌的人和行为总能得到对方的认可，请您文明交友，礼貌待人。</view>
            </view>
        </view>
        <u-toast ref="uToast" />
    </view>
</template>

<script>
    import {
        findPaper
    } from '@/api/user/index'
    export default {
        props: {
            sex: {
                type: Number,
                default: 1
            },
            content: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                sexIndex: 1,
                pageContent: '',
                entity: {}
            }
        },
        mounted() {
            var me = this;
            me.sexIndex = me.sex
        },
        methods: {
            async findPaper() {
                let res = await findPaper({
                    sex: this.sex
                })
                if (typeof res.data == 'string') {
                    this.$refs.uToast.show({
                        title: res.data,
                        type: 'error',
                    })
                } else {
                    this.pageContent = res.data.content
                }
            },
            copyText(data) {
                uni.setClipboardData({
                    //准备复制的数据
                    data,
                    success: (res) => {
                        
                    },
                    fail: err => {
                        
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .sex-block {
        position: absolute;
        top: 360rpx;
        left: 0;
        right: 0;
        margin: auto;
        width: 90%;
        background-color: #fff;
        border-radius: 30rpx;
        justify-content: space-around;
        padding: 100rpx 30rpx 30rpx 30rpx;
        text-align: center;

        .h1 {
            font-size: 46rpx;
            color: #a517e7;
            font-weight: bold;
            padding-top: 60rpx;
        }

        .h2 {
            height: 60rpx;
            font-size: 26rpx;
            font-weight: bold;
        }

        .content {
            background-color: #f2edfc;
            padding: 30rpx;
            border-radius: 20rpx;
            margin-top: 50rpx;
            text-align: center;
        }

        .remark {
            margin-top: 50rpx;
            color: #a1a1a1;

            image {
                width: 30rpx;
                margin-bottom: 10rpx;
            }

            .li1 {
                font-size: 32rpx;
            }

            .li2 {
                text-align: center;
                font-size: 22rpx;
                width: 80%;
                margin: 0 auto;
                margin-top: 10rpx;
            }
        }

        .back-block {
            color: #a1a1a1;
            margin-top: 50rpx;
            width: 100%;
            display: flex;
            justify-content: space-between;
            text-decoration: underline;
        }
    }

    .li3 {
        margin-top: 30rpx;
        font-size: 22rpx;
        text-decoration: underline;

    }
</style>
