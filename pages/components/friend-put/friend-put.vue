<template>
    <view class="flex-column">
        <view class="sex-block flex-column">
            <view class="remark-li">
                投入纸条 期待相遇
            </view>
            <view class="li flex-row-left">
                <image class="left" src="../../static/icon-phone.png" mode="widthFix"></image>
                <input type="text" value="" v-model="paperContent" placeholder="请输入纸条内容" />
            </view>
            <view class="btn flex-row-center" @click="toPayFree">
                立即投入纸条 1金币
            </view>
            <view class="remark flex-row-center">
                投的越多，被抽到的概率越大，纸条内容可以相同！
            </view>
            <view class="back-btn flex-row">
                <view @click="$emit('changenav', 0)">返回上一步</view>
            </view>

            <u-picker mode="region" v-model="addrShow" :area-code='initAddr' @confirm="getAddrCode"></u-picker>

        </view>
        <u-toast ref="uToast" />
    </view>
</template>

<script>
    import {
        savePaper
    } from '@/api/user/index'
    export default {
        props: {
            sex: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                sexIndex: 1,
                addrShow: false,
                addrName: '山西省太原市万柏林区',
                addrCode: '140109',
                initAddr: ["14", "1401", "140109"],
                addrCode: '',
                addrName: '',
                paperContent: '',
            }
        },
        mounted() {
            var me = this;
            me.sexIndex = me.sex
        },
        methods: {
            async savePaper() {
                let res = await savePaper({
                    sex: this.sex,
                    content: this.paperContent
                })
                if (res.data == 1) {
                    this.$refs.uToast.show({
                        title: '投入成功',
                        type: 'success',

                    })
                    setTimeout(()=>{
                        this.$emit("changenav", 0)
                    },800)
                    
                } else if (res.data == 0) {
                    this.$refs.uToast.show({
                        title: '金币不足',
                        type: 'error',
                    })
                } else {
                    this.$refs.uToast.show({
                        title: '系统错误',
                        type: 'error',
                    })
                }
            },

            toPayFree() {
                var me = this;
                console.log(this.sex)
                if (!me.paperContent.trim()) {
                    uni.showToast({
                        title: "请输入纸条内容",
                        icon: "none"
                    })
                    return;
                }
                this.savePaper()

            },
            toPay() {
                var me = this;
                if (!me.paperContent.trim()) {
                    uni.showToast("请输入纸条内容")
                    return;
                }
                uni.showLoading({
                    title: "正在投入..."
                })
                uni.hideLoading()
                me.showToast("纸条投入成功！")
                setTimeout(function() {
                    me.$emit("changenav", 0)
                }, 1000)
            },
            getWeChatCode() {

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
        padding: 100rpx 30rpx 10rpx 30rpx;
        padding-top: 140rpx;

        .remark-li {
            color: #a1a1a1;
            font-size: 24rpx;
            margin-bottom: 10rpx;
            padding-top: 30rpx;
            text-align: center;
        }

        .li {
            width: 90%;
            margin: 0 auto;
            background-color: #f2edfc;
            border-radius: 200rpx;
            padding: 30rpx;
            margin-top: 30rpx;
            display: flex;
            align-items: center;

            image {
                width: 24rpx;
                height: 24rpx;
                margin-right: 20rpx;
            }

            .text1 {
                width: 90%;
                color: #a1a1a1;
            }

            .text2 {
                width: 90%;
            }
        }

        .btn {
            width: 90%;
            margin: 0 auto;
            margin-top: 60rpx;
            background-color: #FFD800;
            padding: 30rpx;
            border-radius: 200rpx;
            font-weight: bold;
        }

        .remark {
            color: #a1a1a1;
            font-size: 24rpx;
            margin-top: 20rpx;
        }

        .back-btn {
            width: 100%;
            color: #a1a1a1;
            font-size: 24rpx;
            margin-top: 50rpx;
            text-decoration: underline;
            justify-content: space-around;

            .right {
                color: #FF0000;
            }
        }
    }

    .flex-row-center {
        text-align: center;
    }
</style>
