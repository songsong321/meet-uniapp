<template>
    <view>
        <view class="page" v-if="isLogin && isPro==1">
            <!-- 发布按钮 -->

            <drag-button :isDock="true" :existTabBar="true" @btnClick="release">
                <view class="send-menu">
                    <u-icon size="40" name="plus"></u-icon>
                </view>
            </drag-button>
            <!-- 信息 -->

            <!-- 只能有一个根元素 -->
            <view class="header">
                <u-tabs active-color="#1296db" inactive-color="#707070" :list="list" :is-scroll="false"
                    :current="current" @change="change"></u-tabs>
            </view>

            <!-- 广场 -->
            <view>

                <view v-if="listData.length>0">
                    <ListCard v-for="(item,index) in listData" @like='likeArticle' @love='loveArticle' 
                    @share = "shareArt"
                        @focusOn="focusOn" :focusOnList='focusOnList' :imgList="item.imgList?item.imgList.split(','):[]"
                        :articleDetail="item" :key='index' :loading='loading' />
                    <!-- end -->
                    <u-divider class="index-list-divider">没有更多了</u-divider>
                </view>
                <view v-if="!loading && listData.length==0">
                    <u-empty text="没有动态" mode="list"></u-empty>
                </view>

            </view>
            <!-- 发布动态 -->
            <u-popup v-model="showModel" :closeable="false" close-icon-pos="top-left" mode="bottom" width="750rpx"
                height="100%">
                <view :style="[{ marginTop: `${statusBarHeight}px` }]">
                    <u-navbar title="新动态" back-icon-size="28" back-icon-name="close" :is-back="false">
                        <view class="back">
                            <u-icon @tap="close" name="close"></u-icon>
                        </view>
                        <view slot="right" class="nav-search-btn">
                            <u-button type="primary" size="mini" ripple shape="circle" @click="submit">发布</u-button>
                        </view>
                    </u-navbar>
                    <textarea height="50upx" v-model="form.content" @focus="textareaFocus" placeholder="分享你的心情~（最多200字）"
                        :maxlength="200" style="overflow: auto;padding: 0 30upx;" />
                    <u-upload @on-uploaded="uploaded" class="upload-img" :file-list="fileList" ref="uUpload"
                        :action="action" :header="{token:form.userId}" :auto-upload="false" width="166upx"
                        height="166upx">
                    </u-upload>
                    <view class="u-m-t-20" @click="choosePosition">
                        <u-cell-group>
                            <u-cell-item icon="map-fill" :title="title"></u-cell-item>
                        </u-cell-group>
                    </view>
                </view>
            </u-popup>
            <view v-for="item in 3" :key="item">
                <skeleton v-if="loading && isLoad==1"></skeleton>
            </view>
        </view>
        <guidePage v-if="!isLogin && isPro==1" @enter='login'></guidePage>
        <audit v-if='!isPro && isPro==0'></audit>
      
    </view>
</template>

<script lang="ts">
    import {
        Component,
        Vue,
        Watch
    } from 'vue-property-decorator';
    import ListCard from './components/card.vue';
    import skeleton from './components/skeleton.vue'
    import dragButton from '@/components/drag-button/drag-button.vue';
    import {
        findAll,
        saveArticle,
        likeArticle,
        loveArticle,
        getFocusOnArticleList
    } from '@/api/article/index';
    import {
        getFocusOnList,
        focusOn
    } from "@/api/user/index"

    import {
        baseUrl
    } from "@/util/util"
    import {
        mapGetters
    } from "vuex"
    import {
        acceptMessage
    } from "@/mixins/acceptMessage"
    @Component({
        name: 'CommunityPage',
        mixins: [acceptMessage],
        components: {
            ListCard,
            dragButton,
            skeleton
        },
        computed: {
            ...mapGetters({
                getUserInfo: 'user/getUserInfo'
            })
        },
    }) // 装饰器
    export default class CommunityPage extends Vue {
        @Watch('showModel')
        showModelChange(newVal: boolean) {
            if (newVal) {
                uni.hideTabBar();
            } else {
                uni.showTabBar();
            }
            this.$refs.uUpload.clear()
            let {
                avatarUrl,
                nickName,
                tags,
                token,
                level,
                gender
            } = this.getMineUserInfo;
            this.form = {
                userId: token,
                imgList: "",
                releaseAvar: avatarUrl,
                relaseName: nickName,
                tags: tags || "",
                releaseTime: "",
                content: "",
                longitude: "",
                latitude: "",
                positionName: "",
                sex: gender,
                level,
                imgList: ""
            }
        }
        /* 页面数据 */
        private isLoad: number = 0;
        private title ? : string = "你在哪里";
        private imgSrc ? : string = "";
        private listData ? : Array < Object > = [];
        private fileList ? : Array < Object > = [];
        private loading = false;
        private focusOnPageInfo: object = {
            page: 1,
            pageSize: 10
        }
        private pageInfo: object = {
            page: 1,
            pageSize: 10
        }
        private list: Array < object > = [{
                name: '关注'
            },
            {
                name: '发现'
            },
        ];
        private current: number = 1;
        private showModel: Boolean = false;
        private statusBarHeight: number = 0;
        private textMsg: any = '';
        // private action: string = 'https://songhan.top/my_applets/upload';
        private action: string = baseUrl.indexOf('songhan.top') >= 0 ? 'https://' + baseUrl + 'upload' : 'http://' +
            baseUrl + 'upload';
        private form ? : Object = {
            userId: uni.getStorageSync("token") || "",
            imgList: "",
            releaseAvar: this.getMineUserInfo.avatarUrl,
            relaseName: this.getMineUserInfo.nickName,
            tags: this.getMineUserInfo.tags || "",
            releaseTime: "",
            content: "",
            longitude: "",
            latitude: "",
            positionName: "",
            sex: this.getMineUserInfo.gender,
            level: this.getMineUserInfo.level
        };
        private fileList: string = "";
        private imgList: Array < string > = [

        ];
        private get getMineUserInfo(): object {

            let userInfo = this.getUserInfo ? Object.keys(this.getUserInfo).length == 0 ? uni.getStorageSync(
                    "userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : {} : this.getUserInfo : uni
                .getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : {};
            return userInfo;
        }
        private focusOnList: Array < string > = []
        /**
         * 接受点赞事件
         */
        private async likeArticle(params: object): void {
            let {
                code,
                data,
                message
            } = await likeArticle(params)
            if (code == 200) {
                if (this.current == 1) {
                    this.findAll()
                } else {
                    this.getFocusOnArticleList()
                }
            } else {
                uni.showToast({
                    title: message,
                    icon: 'none',
                    duration: 2000
                })
            }
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
            if (code === 200) {
                if (this.current == 1) {
                    this.findAll()
                } else {
                    this.getFocusOnArticleList()
                }
            } else {
                uni.showToast({
                    title: message,
                    icon: 'none',
                    duration: 2000
                })
            }
        }
        // 发布文章
        private async saveArticle(params: object): void {
            try {
                let {
                    code,
                    data,
                    message
                } = await saveArticle(params)
                if (code === 200) {
                    this.showModel = false
                    if (this.current == 1) {
                        this.findAll()
                    } else {
                        this.getFocusOnArticleList()
                    }
                } else {
                    uni.showToast({
                        title: message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            } catch (err) {
                console.log(err)
            }

        }
        // 获取我关注发布的文章列表
        private async getFocusOnArticleList(isLoading = true, type = 0) {
            this.loading = true
            type == 2 && (this.pageInfo.pageSize = this.pageInfo.page * 10, this.pageInfo.page = 1)
            type == 1 && (this.pageInfo.pageSize = 10)
            type == 0 && (this.pageInfo.page = this.pageInfo.pageSize == 10 ? this.pageInfo.page : this.pageInfo
                .pageSize / 10, this.pageInfo.pageSize = 10)
            try {
                let {
                    code,
                    data,
                    message
                } = await getFocusOnArticleList(this.focusOnPageInfo, isLoading);
                if (code == 200) {

                    data.content.forEach(item => {
                        item.likePeople = item.likePeople ? item.likePeople.split(',') : []
                        item.lovePeople = item.lovePeople ? item.lovePeople.split(',') : []
                    });
                    (type == 1 || type == 2) && (this.listData = data.content || []);
                    type == 0 && (this.listData = this.listData.concat(data.content || []))
                } else {
                    uni.showToast({
                        title: message,
                        icon: 'none'
                    });
                }
            } catch (err) {
                this.listData = [];
            } finally {
                uni.stopPullDownRefresh()
                this.loading = false
            }
        }
        private shareArt(src){
            this.imgSrc = src
        }
        // 选择位置
        private choosePosition(): void {
            uni.chooseLocation({
                success: res => {
                    this.form.latitude = res.latitude;
                    this.form.longitude = res.longitude;
                    this.form.positionName = res.name;
                    this.title = res.name
                },
                fail: error => {
                    uni.getSetting({
                        success: function(res) {
                            var statu = res.authSetting;

                            if (!statu['scope.userLocation']) {

                                uni.showModal({
                                    title: '是否授权当前位置',
                                    content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                                    success(tip) {
                                        if (tip.confirm) {
                                            uni.openSetting({
                                                success: function(data) {
                                                    if (data
                                                        .authSetting[
                                                            "scope.userLocation"
                                                        ] === true
                                                    ) {
                                                        uni.showToast({
                                                            title: '授权成功',
                                                            icon: 'success',
                                                            duration: 1000
                                                        })
                                                    }
                                                }
                                            })
                                        } else {
                                            uni.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })

                            }
                        }
                    })
                    console.log(error)
                }
            });
        }
        change(index: number) {
            this.current = index;
            index == 0 && (this.focusOnPageInfo.page = 1)
            index == 1 && (this.pageInfo.page = 1)
            index == 0 && this.getFocusOnArticleList(true, 1);
            index == 1 && this.findAll(true, 1)
        }
        private uploaded(lists, name): void {
            let arr: Array < string > = []
            lists.forEach(item => {
                arr.push(item.response.data)
            })
            this.form.imgList = arr.join(",");
            this.saveArticle(this.form)
        }
        // 发布
        private async submit(): void {

            if (!this.form.content) {
                uni.showToast({
                    title: "请输入文案",
                    icon: "none"
                })
                return
            }
            if (!this.form.positionName) {
                uni.showToast({
                    title: "请选择所在位置",
                    icon: "none"
                })
                return
            }
            this.form.releaseTime = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" +
                new Date()
                .getDate()
            await this.$refs.uUpload.upload();

        }

        // 修改值
        private updateValue(key: string, value: any) {}
        private close() {
            this.showModel = false;
        }

        /* 打开发布消息弹窗 */
        private release() {
            this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
            this.showModel = true;
        }

        /* 获取输入框焦点 */
        private textareaFocus() {}
        /* 获取动态列表 */
        private async findAll(isLoading = true, type = 0): void {
            this.loading = true
            type == 2 && (this.pageInfo.pageSize = this.pageInfo.page * 10, this.pageInfo.page = 1)
            type == 1 && (this.pageInfo.pageSize = 10)
            type == 0 && (this.pageInfo.page = this.pageInfo.pageSize == 10 ? this.pageInfo.page : this.pageInfo
                .pageSize / 10, this.pageInfo.pageSize = 10)
            try {
                let {
                    code,
                    data,
                    message
                } = await findAll(this.pageInfo, isLoading);
                if (code == 200) {
                    data.content.forEach(item => {
                        item.likePeople = item.likePeople ? item.likePeople.split(',') : []
                        item.lovePeople = item.lovePeople ? item.lovePeople.split(',') : []
                    })
                    type == 1 && (this.listData = data.content || []);
                    type == 0 && (this.listData = this.listData.concat(data.content || []))
                } else {
                    uni.showToast({
                        title: message,
                        icon: 'none'
                    });
                }
            } catch (err) {
                // console.log(err, 'err');
                this.listData = [];
            } finally {
                uni.stopPullDownRefresh()
                this.loading = false
            }
        }
        // 获取关注列表
        private async getFocusOnList(isLoading = true) {
            let params = {
                pageSize: 100000,
                page: 1,
            }
            let res = await getFocusOnList(params, isLoading);
            this.focusOnList = res.data.content.map(item => item.toOpenId);
        }
        // 关注 or 取消
        async focusOn(params) {
            let res = await focusOn(params);
            if (res.code == 200) {
                this.getFocusOnList();
                if (this.current == 1) {
                    this.findAll(true, 2)
                } else {
                    this.getFocusOnArticleList(true, 2)
                }
            }
        }
        // 监听触底
        onReachBottom() {
            if (this.current == 1) {
                this.pageInfo.page++
                this.findAll()
            } else {
                this.focusOnPageInfo.page++
                this.getFocusOnArticleList()
            }
        }
        // 下拉刷新
        private onPullDownRefresh() {
            if (this.current == 1) {
                this.pageInfo = {
                    page: 1,
                    pageSize: 10
                }
                this.findAll(true, 1)
            } else {
                this.focusOnPageInfo = {
                    page: 1,
                    pageSize: 10
                }
                this.getFocusOnArticleList(true, 1)
            }
        }
        /* 页面初始化 */
        private created() {
            this.isLoad = 0;
            uni.showShareMenu({
                withShareTicket: true,
                //设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
                menus: ["shareAppMessage", "shareTimeline"]
            })
        }
        private loadFunction(){
            if (this.isLogin && this.isPro) {
                this.isLoad++;
                this.getFocusOnList(false)
                if (this.current == 1) {
                    this.findAll(false)
                } else {
                    this.getFocusOnArticleList(false)
                }
            }
        }
        onShow(){
            
        }
      
        onShareAppMessage() {
            
              let imgSrc = this.imgSrc?'https://songhan.top/files/'+this.imgSrc : 'https://songhan.top/files/share.jpg';
                 let obj =  {
                     title: "快来和我一起看看这个动态吧！", //分享标题名称
                     path: `/tabbar/pages/community`, //根据id跳转相应内容详情页中，数据更据id请求得到的话，必须添加参数
                     imageUrl:imgSrc, // 分享封面图片
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
        onShareTimeline() {
            return {
                title: "我在小方片等你！快来和我一起畅聊吧！", //分享标题名称
                path: `/tabbar/pages/index`, //根据id跳转相应内容详情页中，数据更据id请求得到的话，必须添加参数
                imageUrl: 'https://songhan.top/files/share.jpg', // 分享封面图片
                success(res) { // 分享成功回调
                    console.log(res, 'res')

                },
                fail(err) {
                    console.log(err, 'err')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    // .content {
    // 	width: 100%;
    // 	min-height: 200rpx;
    // 	padding-bottom: 160upx;
    // 	// position: relative;
    // }
    .index-list-divider {
        margin-top: 60upx !important;
    }

    .send-menu {
        padding: 10upx;
        background-color: #4B4B4B;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        box-shadow: 1px 3px 13px #939090;
        // position: fixed;
        right: 60upx;
        bottom: 120upx;
        z-index: 1;

        >view {
            font-size: 40upx;
            color: #ffffff;
        }
    }

    .nav-search {
        margin-right: 30upx;
    }

    .nav-search-btn {
        margin-right: 30upx;
    }

    .upload-img .u-delete-icon {
        background-color: #2979ff !important;
    }

    .back {
        padding-left: 30rpx;
    }

    .header {
        width: 750rpx;
        height: 100rpx;
        padding: 10rpx 0;
        background-color: white;
        color: #fff;
        position: sticky;
        top: 0;
        z-index: 99;
    }

    ::v-deep .u-status-bar {
        height: 0 !important;
    }

    ::v-deep .u-navbar-inner {
        width: 100%;
    }

    ::v-deep .drag {
        z-index: 9;
    }

    .page {
        width: 100%;
        overflow-x: hidden;
    }
</style>
