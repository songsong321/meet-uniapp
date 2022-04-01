<template>
    <view>
        <list-card v-for="(item,index) in listData" @like="likeArticle" @love="loveArticle" :key="index"
            :articleDetail="item"></list-card>
    </view>
</template>

<script lang="ts">
    import {
        Component,
        Vue,
        Watch
    } from 'vue-property-decorator';
    import ListCard from '@/tabbar/pages/components/card.vue';

    import {
        findMineLike,
        likeArticle,
        loveArticle
    } from "@/api/article/index"
    @Component({
        name: "MineLike",
        components: {
            ListCard
        }
    })
    export default class MineLike extends Vue {
        // 当前列表数据
        private listData ? : Array < Object > = [];
        // 分页数据
        private pageInfo ? : object = {
            page: 1,
            size: 10,
        }
        /**
         * 获取数据
         */
        private async findMineLike(type=0): void {
           type == 1 && (this.listData = [],this.pageInfo.size = 10)
           type == 2 && (this.pageInfo.size = this.pageInfo.page*10,this.pageInfo.page = 1,this.listData = [])
           type == 0 && (this.pageInfo.page = this.pageInfo.size==10?this.pageInfo.page:this.pageInfo.size/10,this.pageInfo.size = 10)
            try {
                let {
                    code,
                    data,
                    message
                } = await findMineLike(this.pageInfo)
                data.forEach(item => {
                    item.likePeople = item.likePeople ? item.likePeople.split(',') : []
                    item.lovePeople = item.lovePeople ? item.lovePeople.split(',') : []
                })
                this.listData = this.listData.concat(data) || []
            } finally {
                uni.stopPullDownRefresh()
            }
        }
        /**
         * 接受点赞事件
         */
        private async likeArticle(params: object): void {
            let {
                code,
                data,
                message
            } = await likeArticle(params)
            code === 200 && this.findMineLike(2)
            code != 200 && uni.showToast({
                title: message,
                icon: 'none'
            })
        }
        /**
         * 收藏文章
         */
        private async loveArticle(params: object): void {
            let {
                code,
                data,
                message
            } = await loveArticle(params)
            code === 200 && this.findMineLike(2)
            code != 200 && uni.showToast({
                title: message,
                icon: 'none'
            })
        }
        /**
         * 下拉刷新
         */
        private onPullDownRefresh() {
            this.pageInfo.page = 1;
            this.findMineLike(1)
        }
        private onReachBottom() {
            this.pageInfo.page++
            this.findMineLike()

        }
        onShareAppMessage() {
            
             
                 let obj =  {
                     title: "快来和我一起看看这个动态吧！", //分享标题名称
                     path: `/tabbar/pages/community`, //根据id跳转相应内容详情页中，数据更据id请求得到的话，必须添加参数
                     imageUrl:"https://songhan.top/files/share.jpg", // 分享封面图片
                     bgImgUrl:"https://songhan.top/files/share.jpg",
                     success(res) { // 分享成功回调
                         console.log(res, 'res')
                     },
                     fail(err) {
                         console.log(err, 'err')
                     }
                 }
                 return obj; 
        }
        /**
         * 生命周期函数
         */
        private created() {
            this.findMineLike()
        }

    }
</script>

<style>

</style>
