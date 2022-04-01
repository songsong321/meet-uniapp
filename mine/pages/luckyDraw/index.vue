<template>
    <view class="page">
        <!-- 背景图 -->
        <view class="" style="height: 100%;">
            <image src="https://songhan.top/files/luckyBigBg.png" class="ImageBG"></image>
        </view>
        <view class="cell">
            <block v-for="(item,index) in AwardList" :key="index">
                <view class="CellItem" :class="index==4||index===sel?'YellowBackground':'WhiteBackground'"
                    @tap="begin(index)">
                    <view class="CellItemContent" :class="index==4||index===sel?'Yellow':'white'">
                        <image :src="item.image" mode="scaleToFill" class="ItemImage" v-if="item.image"></image>
                        <view class="">
                            <text class="text">{{item.name}}</text>
                        </view>
                    </view>
                </view>
            </block>
        </view>
        <u-top-tips ref="uTips"></u-top-tips>
    </view>
</template>

<script>
    import {
        getInfo,
        setUserGold
    } from "@/api/user/index"
    export default {
        data() {
            return {
                AwardList: [{
                        image: 'https://songhan.top/files/thanks.png',
                        name: '谢谢参与',
                        type:2,
                        num:10,
                    },
                    {
                        image: '../../../static/MyApplets/img/gold.png',
                        name: '10金币',
                        type:1,
                        num:10,
                    },
                    {
                        image: 'https://songhan.top/files/thanks.png',
                        name: '谢谢参与',
                        type:2,
                        num:10,
                    },
                    {
                        image: '../../../static/MyApplets/img/gold.png',
                        name: '50金币',
                        type:1,
                        num:50,
                    },
                    {
                        image: 'https://songhan.top/files/begin.png',
                        name: '10金币',
                        type:1,
                        num:10,
                    },
                    {
                        image: '../../../static/MyApplets/img/gold.png',
                        name: '20金币',
                        type:1,
                        num:20,
                    },
                    {
                        image: 'https://songhan.top/files/thanks.png',
                        name: '谢谢参与',
                        type:2,
                        num:10,
                    },
                    {
                        image: '../../../static/MyApplets/img/gold.png',
                        name: '30金币',
                        type:1,
                        num:30,
                    },
                    {
                        image: 'https://songhan.top/files/thanks.png',
                        name: '谢谢参与',
                        type:2,
                        num:10,
                    }
                ],
                sel: '',
                FastNums: 0,
                SlowNums: 0,
                time: 1000,
                goldNum: 0,
                LoopStatus: true
            }
        },
        created() {
            this.getInfo()
        },
        methods: {
            async setUserGold(num){
                let res = await setUserGold({type:this.AwardList[num].type,goldNum:this.AwardList[num].type==1?this.AwardList[num].num-10:this.AwardList[num].num})
                if(res.data=='修改成功'){
                    this.$refs.uTips.show({
                        title:this.AwardList[num].type==1?'恭喜获得'+this.AwardList[num].num+"个金币":"再接再厉吧",
                        type: 'success',
                        duration: '2000'
                    })
                }else{
                    this.$refs.uTips.show({
                        title:res.data,
                        type: 'error',
                        duration: '2000'
                    })
                }
            },
            async getInfo() {
                let token = uni.getStorageSync("token") || ''
                if (token) {
                    let res = await getInfo(token)
                    this.goldNum = res.data.goldNum;
                }
            },
            begin(index) {
                this.getInfo().then(res => {
                    if (this.goldNum >= 10) {
                        if (index == 4) {
                            this.FastNums = 0
                            this.SlowNums = 0
                            this.time = 1000
                            this.LoopStatus = true
                            this.loop()
                        }
                    } else {
                        this.$refs.uTips.show({
                            title: '您的金币不足',
                            type: 'error',
                            duration: '2000'
                        })
                    }
                })


            },
            getRandomNum() {
                let bigNum = 0;
                const getNum = () => {
                    let num = Math.floor(Math.random() * (8 - 0) + 0);
                    if (num == 4) {
                        getNum()
                    } else {
                        bigNum = num;
                    }
                }
                getNum()
                return bigNum;
            },
            loop() {
                if (!this.sel || this.sel < 9) {
                    if (this.sel == 3) {
                        this.sel = 0
                    } else if (this.sel === '') {
                        this.sel = 0
                    } else if (this.sel == 2) {
                        this.sel = 5
                    } else if (this.sel == 5) {
                        this.sel = 8
                    } else if (this.sel == 8) {
                        this.sel = 7
                    } else if (this.sel == 7) {
                        this.sel = 6
                    } else if (this.sel == 6) {
                        this.sel = 3
                    } else {
                        this.sel++
                    }
                    this.FastNums++
                    if (this.FastNums == 4) {
                        this.FastNums = 0
                        this.time = 50
                        this.SlowNums++
                    }
                    if (this.SlowNums == 8) {
                        this.SlowNums = 0
                        this.time = 500
                        this.FastNums = 5
                    }
                    let num = this.getRandomNum()
                    if (this.FastNums > 5) {
                        if (this.sel == num) {
                            this.LoopStatus = false
                        }
                    }
                    if (this.LoopStatus) {
                        setTimeout(() => {
                            this.loop()
                        }, this.time);
                    } else {
                       this.setUserGold(num)
                    }
                }
            }
        }

    }
</script>

<style scoped>
    .page {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
    }

    .cell {
        width: 700rpx;
        padding: 50rpx;
        padding-left: 65rpx;
        margin-top: -600rpx;
        height: 700rpx;
        position: absolute;
        left: 0;
        right: 0;
        top: 480rpx;
        bottom: 0;
        margin: auto;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        background-image: url(../../../static/MyApplets/img/luckyBg.png);
        background-size: cover;
    }

    .CellItem {
        width: 188rpx;
        height: 188rpx;
        border-radius: 30rpx;
        margin: 5rpx 4rpx;
    }

    .CellItemContent {
        width: 188rpx;
        height: 168rpx;
        border-radius: 30rpx;
        text-align: center;
    }

    .white {
        background-color: #fdf2ee;
    }

    .WhiteBackground {
        background-color: #f8d0c3;
    }

    .Yellow {
        background-color: #ffcc00;
        color: #FFFFFF;
    }

    .YellowBackground {
        background-color: #dd8e03;
    }

    .ImageBG {
        width: 750rpx;
        height: 100%;
    }

    .ItemImage {
        width: 90rpx;
        height: 90rpx;
        margin-top: 10rpx;
    }

    .text {
        font-size: 28rpx;
    }
</style>
