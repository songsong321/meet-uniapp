<template>
    <view style="padding: 20upx;">
        <view v-for="(item,index) in getData" :key="index">
            <view class="body" style="display: flex;align-items: center;justify-content: space-between;border-bottom: 1upx solid #f4f4f5;padding-bottom: 20upx;">
                <view style="display: flex;align-items: center;">
                    <view class="left">
                        <u-avatar :src="type=='fans'?item.fromAvar:item.toAvar"></u-avatar>
                    </view>
                    <view class="title">
                        <view>
                            <view class="title_text">{{type=='fans'?item.fromName:item.toName}}</view>
                            <view class="info_text">{{type=='fans'?item.fromInfo?item.fromInfo:"这是一个神秘的人":item.toInfo?item.toInfo:"这是一个神秘的人"}}</view>
                        </view>
                    </view>
                </view>
                <view class="right">
                    <u-button size="mini" :type="type=='fans'?myFocusOnList.findIndex(ele=>ele[key]==item[key1])!=-1?'default':'success':focusOnList.findIndex(ele=>ele[key]==item[key1])!=-1?'default':'success'"
                        @click.stop="focusOn(item)">
                        {{type=='fans'?myFocusOnList.findIndex(ele=>ele[key]==item[key1])!=-1?'互相关注':'关注':focusOnList.findIndex(ele=>ele[key]==item[key1])!=-1?'互相关注':'关注'}}
                    </u-button>
                </view>
            </view>


        </view>
        <u-empty v-if="getData.length==0" :text="title" mode="favor"></u-empty>
    </view>
</template>

<script>
    import {
        getFocusOnForMe,
        focusOn,
        getFocusOnList
    } from "@/api/user/index"
    export default {
        data() {
            return {
                focusOnList: [],
                myFocusOnList: [],
                pageInfo: {
                    page: 1,
                    pageSize: 10
                },
                fPageInfo: {
                    page: 1,
                    pageSize: 10
                },
                
                key:"",
                key1:"",
                type:'',
                title:""
            }
        },
        computed:{
          getData(){
              return this.type == 'fans'?this.focusOnList:this.myFocusOnList;
          }    
        },
        methods: {
            // 关注 or 取消
            async focusOn(item) {
                let type = this.myFocusOnList.includes(item.fromOpenId) ? 2 : 1;
                let params = {
                    fromOpenId: item.toOpenId,
                    toOpenId: item.fromOpenId,
                    type
                }
                try {
                    let res = await focusOn(params);
                    if (res.code == 200) {
                        if(this.type=='fans'){
                            this.fPageInfo.pageSize = 100000
                            this.pageInfo.pageSize = 10
                            this.pageInfo.page++;
                            this.getFocusOnForMe()
                            this.getFocusOnList()
                        }else{
                            this.pageInfo.pageSize = 100000
                            this.fPageInfo.pageSize = 10
                            this.fPageInfo.page++
                            this.getFocusOnList()
                             this.getFocusOnForMe()
                        }
                       
                    }
                } catch (err) {

                }
            },
            /**
             * 获取关注我的（用于判断那些互相关注关系）
             */
            async getFocusOnList(type=0) {
                
                try {
                     (type == 1 || type==2) && (this.myFocusOnList = [])
                    let res = await getFocusOnList(this.fPageInfo)
                    if (res.data.content.length > 0) {
                        res.data.content.forEach(item => {
                            this.myFocusOnList.push(item)
                        })
                    }
                } catch (err) {
                    console.log(err,'err')
                    this.myFocusOnList = []
                } finally {
                    uni.stopPullDownRefresh()
                }
            },
            async getFocusOnForMe(type=0) {
                try {
                    (type == 1 || type==2) && (this.myFocusOnList = [])
                    let res = await getFocusOnForMe(this.pageInfo)
                    
                    this.focusOnList = this.focusOnList.concat(res.data.content || [])
                } catch (err) {
                    console.log(err,'err')
                    this.focusOnList = []
                } finally {
                    uni.stopPullDownRefresh()
                }

            },
            
        },
        
        onPullDownRefresh() {
            if(this.type=='fans'){
                this.fPageInfo.pageSize = 100000
                this.pageInfo.pageSize = 10
                this.pageInfo.page = 1
                this.getFocusOnForMe(1)
                this.getFocusOnList()
            }else{
                this.pageInfo.pageSize = 100000
                this.fPageInfo.pageSize = 10
                this.fPageInfo.page = 1
                this.getFocusOnList(1)
                this.getFocusOnForMe();
            }
        },
        onReachBottom() {
            if(this.type=='fans'){
                this.fPageInfo.pageSize = 100000
                this.pageInfo.pageSize = 10
                this.pageInfo.page++
                this.getFocusOnForMe()
                this.getFocusOnList()
            }else{
                this.pageInfo.pageSize = 100000
                this.fPageInfo.pageSize = 10
                this.fPageInfo.page++
                this.getFocusOnList()
                this.getFocusOnForMe()
            }
           
           
        },
        
        onLoad(options){
            this.type = options.type
            this.key = this.type=='fans'?'toOpenId':"fromOpenId"
            this.key1 = this.type=='fans'?'fromOpenId':"toOpenId"
            if(this.type=='fans'){
                this.fPageInfo.pageSize = 100000
                this.pageInfo.pageSize = 10
                uni.setNavigationBarTitle({
                    title:"我的粉丝"
                })
                this.title='还没有人关注你'
            }else{
                this.pageInfo.pageSize = 100000
                this.fPageInfo.pageSize = 10
                uni.setNavigationBarTitle({
                    title:"我关注的"
                })
                this.title='你还没有关注的人'
            }
           this.getFocusOnList()
           this.getFocusOnForMe()
        },
        onShow() {
            if(this.type=='fans'){
                this.fPageInfo.pageSize = 100000
                this.pageInfo.pageSize = 10
                uni.setNavigationBarTitle({
                    title:"我的粉丝"
                })
                this.title='还没有人关注你'
            }else{
                this.pageInfo.pageSize = 100000
                this.fPageInfo.pageSize = 10
                uni.setNavigationBarTitle({
                    title:"我关注的"
                })
                this.title='你还没有关注的人'
            }
        }
        
    }
</script>

<style scoped>
    .left {
        float: left;
    }

    .right {
        float: right;
    }

    .title {
        height: 100%;
        margin-left: 20upx;
        display: flex;
        align-items: center;
    }

    .title_text {
        font-size: 30upx;
        height: 40upx;
    }

    .info_text {
        font-size: 20upx;
        color: #C8C8C8;
    }
</style>
