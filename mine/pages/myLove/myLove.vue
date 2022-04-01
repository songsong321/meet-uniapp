<template>
    <view>
        <list-card v-for="(item,index) in listData" @like="likeArticle" @love="loveArticle" :key="index" :articleDetail="item" :focusOnBtn='false'></list-card>
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
        findMineLove,
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
        private async findMineLove(type=0): void {
            type == 1 && (this.listData = [],this.pageInfo.size = 10)
            type == 2 && (this.pageInfo.size = this.pageInfo.page*10,this.pageInfo.page = 1,this.listData = [])
            type == 0 && (this.pageInfo.page = this.pageInfo.size==10?this.pageInfo.page:this.pageInfo.size/10,this.pageInfo.size = 10)
            try {
                let {
                    code,
                    data,
                    message
                } = await findMineLove(this.pageInfo)
                data.forEach(item => {
                    item.likePeople = item.likePeople ? item.likePeople.split(',') : []
                    item.lovePeople = item.lovePeople ? item.lovePeople.split(',') : []
                })
                this.listData =  this.listData.concat(data) || []
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
            code === 200 && this.findMineLove(2)
            code != 200 && uni.showToast({
                title: message,
                icon: 'none'
            })
        }
        private onReachBottom(){
            this.pageInfo.page++
            this.findMineLove()
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
            code === 200 && this.findMineLove(2)
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
            this.findMineLove(1)
        }
        /**
         * 生命周期函数
         */
        private created() {
            this.findMineLove()
        }

    }
</script>

<style>

</style>
