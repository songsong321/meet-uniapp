<template>
    <view>
        <view class="ferris-wheel">
            <view class="wheel-wrap">
                <view class="wheels">
                    <text></text>
                    <text></text>
                    <text></text>
                    <text></text>
                    <text></text>
                    <text></text>
                    <text></text>
                    <text></text>
                </view>
                <view class="buckets">
                    <view v-for="(item,index) in 16" :key='index'>
                        <block class="view">
                            <image @click='goToDetail(data[index])'
                                style="width: 80%;height: 80%;position: absolute;top: 0;left: 0;right:0;bottom:0;margin: auto;border-radius: 5rpx;"
                                :src="data[index].avatarUrl">
                            </image>
                        </block>
                    </view>

                </view>
            </view>
            <view class="stand"><text></text></view>
        </view>
    </view>
</template>

<script>
    import {
        findUserByRandom
    } from '@/api/user/index'
    export default {
        data() {
            return {
                data:[]
            }
        },
        methods: {
            async findUserByRandom() {
                let res = await findUserByRandom({maxNum:16})
                let len = res.data.length;
                if(len<16){
                    for(let i=0;i<16-len;i++){
                        res.data.push({openid:null,avatarUrl:""})
                    }
                }
                this.data = res.data || []
            },
            goToDetail(item) {
                console.log(item,'item')
               if(item.openid){
                   uni.navigateTo({
                       url: '/mine/pages/info?openId=' + item.openid
                   });
               }
            }
        },
        created() {
            this.findUserByRandom()
        }
    }
</script>

<style>
    @import url("./index.css");
</style>
