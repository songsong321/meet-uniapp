<template>
    <view style="padding: 30upx;" class="page">
        <view v-for="(item,index) in articleList" :key='index' class="item">
            <view class="head">
                <view style="display: flex;justify-content: space-between;align-items: center;">
                    <view style="display: flex; align-items: center;" @click="goToInfo(item)">
                        <view>
                            <u-avatar size="50" :src="item.avar"></u-avatar>
                        </view>
                        <view style="margin-left: 10upx;font-size: 30upx;">
                            <text style="color: #2979ff;">{{item.nickName}}</text>
                            <text>{{(searchParams.type=='like'?'给你点了个赞':'收藏了这个动态') }}</text>
                        </view>
                    </view>

                    <view style="font-size: 20upx; color: #c8c8c8;">
                        {{searchParams.type=='like'?item.likeDate:item.loveDate}}
                    </view>
                </view>

            </view>
            <view class="body" @click="goToArticleInfo(item)">
                <view style="width:100%;display: flex; align-items: center;">
                    <image mode="widthFix" class="img" v-for="(ele,i) in getSrc(item.imgList)"
                        :src="'https://songhan.top/build/files/'+ele"></image>
                    <view class="text">
                        <text>{{item.content}}</text>
                    </view>

                </view>
            </view>
            <view class="gap" v-if="index!=articleList.length-1">
                <u-gap class="gap" height="10" bg-color="#f3f4f6"></u-gap>
            </view>
        </view>
    </view>
</template>

<script>
    import {
        getLikeOrLoveMeList
    }
    from "@/api/user/index"
    export default {
        data() {
            return {
                articleList: [],
                searchParams: {
                    page: 1,
                    pageSize: 10,
                    type: ""
                }
            }
        },
        methods: {
            goToArticleInfo(item){
                let id = this.searchParams.type=='like'?item.likeArtId:item.loveArtId
                uni.navigateTo({
                    url:"/tabbar/pages/components/cardDetail?artId="+id
                })
            },
            goToInfo(item){
              uni.navigateTo({
                  url: '/mine/pages/info?openId='+ item.openid
              });  
            },
            getSrc(imgList) {
                let arr = imgList ? imgList.split(",") : [];
                arr = arr.length == 0 ? [] : [arr[0]]
                return arr;
            },
            async getLikeOrLoveMeList(type=0) {
                try {
                    type == 1 && (this.articleList = [])
                    let res = await getLikeOrLoveMeList(this.searchParams)
                    this.articleList = this.articleList.concat(res.data.content || [])
                } catch (err) {
                    this.articleList = []
                }
            }
        },
        onPullDownRefresh() {
                this.searchParams.page = 1;
                this.getLikeOrLoveMeList(1)
        },
        onReachBottom(){
          this.searchParams.page++;
            this.getLikeOrLoveMeList()
        },
        onLoad(options) {
            this.searchParams.type = options.type;
            this.getLikeOrLoveMeList()
        },
        created() {

        }
    }
</script>

<style scoped>
    .page{
        width: 100%;
        overflow-x: hidden;
    }
    .body {
        padding: 20upx;
        background-color: #f3f4f6;
        min-height: 70px;
        display: flex;
        align-items: center;
        border-radius: 15upx;
    }

    .item {
        padding: 20upx 0;
        margin-bottom: 20upx;
    }

    .head {
        margin-bottom: 10upx;
    }

    .img {
        float: left;
        width: 45px;
        height: 45px;
        object-fit: fit;
    }

    .text {
        margin-left: 10upx;
        width: calc(100% - 60upx);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .gap {
        width: calc(100% + 90upx);
        position: relative;
        right: 30upx;
        top: 15upx;
    }
</style>
