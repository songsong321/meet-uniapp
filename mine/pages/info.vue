<template>
    <view>
        <view class="u-skeleton">
            <!-- 后台按钮组件 -->

            <!-- mescroll组件 -->
            <!-- 用户背景封面 -->
            <image class="info-cover u-skeleton-rect" @tap="fnMainBgPic"
                src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5d36bb3d-8e98-4f00-ab8b-b018dc4f5dc6/17b0292c-8a63-4b7b-a6a6-724f416a9958.jpg"
                mode="scaleToFill"></image>

            <!-- 用户头像关注 -->
            <view class="u-flex-wrap"
                style="padding-top: 18rpx;padding-bottom: 18rpx;position: relative;align-items: center;display: flex;flex-direction: row;justify-content: flex-end;">
                <view class="info-avatar u-skeleton-circle">

                    <u-avatar :src="userInfo.avatarUrl" size="135"></u-avatar>

                </view>
                <view style="margin-right: 50rpx;">
                    <u-button class="u-skeleton-fille" :type="focusOnList.includes(userInfo.openid)?'warning':'success'"
                        :ripple="true" size="mini" style="margin-right: 30rpx;"
                        @click="focusOn(focusOnList.includes(userInfo.openid)?2:1)">
                        <u-icon style="margin-right: 5upx;"
                            :name="focusOnList.includes(userInfo.openid)?'checkmark':'plus'"></u-icon>
                        {{focusOnList.includes(userInfo.openid)?'已关注':'关注'}}
                    </u-button>
                    <u-button class="u-skeleton-fille" type='warning' size='mini' v-if='showedit' @click="UserEdit">编辑信息
                    </u-button>
                    <u-button class="u-skeleton-fille" type='warning' size='mini' v-if='!showedit' @click="talkToUser">
                        私聊</u-button>

                </view>
            </view>
            <!-- 用户名 -->
            <view class="u-skeleton-rect"
                style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 20rpx;"
                v-if="userInfo.length!=0">
                <text
                    style="font-size: 32rpx;color: #111111;font-weight: bold;margin-right: 10rpx;">{{userInfo.nickName}}</text>

                <u-icon :name="userInfo.gender==1?'man':userInfo.gender==2?'woman':'eye-off'"
                    :color="userInfo.gender==1?'#4baed5':userInfo.gender==2?'#f5991e':'4baed5'" size="30">
                </u-icon>
            </view>

            <!-- 单位职务 -->
            <view class="u-flex">
                <view class="u-skeleton-circle"
                    style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 20rpx;"
                    v-if="userInfo.length!=0">
                    <u-icon name="map-fill" size="32" color="#4baed5"></u-icon>
                    <text style="font-size: 24rpx;color: #555555;margin-left: 10rpx;">{{userInfo.city}}</text>
                </view>
                <!-- <view style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 20rpx;" v-if="userInfo.length!=0">
				    <u-icon name="man-add-fill" size="32" color="#4baed5"></u-icon>
				    <text style="font-size: 24rpx;color: #555555;margin-left: 10rpx;">{{userInfo.jor}}</text>
				  </view> -->
                <view class="u-skeleton-circle"
                    style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 20rpx;">
                    <img style="width: 16px;height: 16px;" src="/static/MyApplets/img/level.png" alt="">
                    <text style="font-size: 24rpx;color: #555555;margin-left: 10rpx;">{{userInfo.level}}</text>
                </view>
                <view style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 20rpx;">
                    <text style="font-size: 24rpx;color: #555555"> {{userInfo.accountcategory==1?"普通会员":"高级会员"}}</text>
                </view>
                <view style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 20rpx;">
                    <image style="width: 16px;height: 16px;" src="../../static/MyApplets/img/gold.png" mode=""></image>
                    <text style="font-size: 24rpx;color: #555555;margin-left: 10rpx;">{{userInfo.goldNum}}</text>
                </view>
            </view>
            <!-- 简介-->
            <view class="u-skeleton-rect" style="font-size: 24rpx;color: #555555;margin:20rpx 50rpx;"
                v-if="userInfo.length!=0">
                <u-tag v-if='membertype!=""' :text="membertype" mode="dark" shape="circle" bg-color="#4baed5" />
                <text style="margin-right: 20rpx;">{{userInfo.info?userInfo.info:'暂无简介'}}</text>
            </view>
            <view style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 20rpx;margin-bottom: 20rpx;"
                v-if="userInfo.length!=0">
                <text
                    style="font-size: 32rpx;font-weight: bold;color: #555555;margin-right: 18rpx;">{{userInfo.fannum || 0}}</text><text
                    style="font-size: 24rpx;color: gray;margin-right: 28rpx;">粉丝</text>
                <text
                    style="font-size: 32rpx;font-weight: bold;color: #555555;margin-right: 18rpx;">{{userInfo.focusonnum || 0}}</text><text
                    style="font-size: 24rpx;color: gray;margin-right: 28rpx;">关注</text>
            </view>

            <!-- 选择导航 -->
            <view v-if="isFixed" style="height: 90rpx;line-height: 90rpx;background-color: white;margin-bottom: 18rpx;">
            </view>
            <view id="tabbar" :class="isFixed?'tabbar-fixed':''"
                style="border-bottom:18rpx #f8f8f8 solid ;align-items: stretch;height: 90rpx;line-height: 90rpx;background-color: white;margin-bottom: 18rpx; display: flex;flex-direction: row;justify-content: space-around;">
                <view style="font-size: 32rpx;font-weight: bold;text-align: center;width: 128rpx;"
                    :class="current == 0?'tabbarsh':'notabbarsh'" @tap="fnBarClick(0)">{{userInfo.gender==2?"她":"他"}}发布的
                </view>
                <view style="font-size: 32rpx;font-weight: bold;text-align: center;width: 128rpx;"
                    :class="current == 1?'tabbarsh':'notabbarsh'" @tap="fnBarClick(1)">{{userInfo.gender==2?"她":"他"}}的相册
                </view>
            </view>

            <!-- 导航显示内容 -->
            <view v-if="current==0">
                <list-card v-for="(item,index) in articleList" @like="likeArticle" @love="loveArticle" :key="index"
                    :articleDetail="item" :focusOnBtn='false'></list-card>
                <u-empty text="暂无发布" mode="list" v-if="articleList.length==0"></u-empty>
            </view>
            <view style="padding: 20rpx;" v-else>
                暂未开放
            </view>



        </view>
        <u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
    </view>

</template>

<script>
    import {
        getChina
    } from "@/util/util.ts"
    import {
        getInfo,
        focusOn,
        getFocusOnList,
    } from "@/api/user/index"
    import {
        findMineRelease
    } from "@/api/article/index"
    import ListCard from '@/tabbar/pages/components/card.vue';
    export default {
        components: {
            ListCard
        },
        data() {
            return {
                uid: '',
                userInfo: {

                },
                Information: '',
                membertype: '',
                showedit: false, //信息编辑按钮
                //示例mescroll
                mescroll: '',
                // 是否固定导航
                isFixed: false,
                // 距离顶部达到导航距离
                topNum: 0,
                // 选中 
                current: 0,
                // 导航距离顶部
                tabbarTop: 0,
                clickRefresh: false,
                // 刷新间隔
                timeOutUserInfo: 0,
                // 激活顶部导航关联页状态
                status: {
                    publish: true,
                    praise: false,
                },
                articlePageInfo: {
                    page: 1,
                    size: 10
                },
                loading: false,
                // 关注列表
                focusOnList: [],
                articleList: [],
                toTop: {
                    src: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b9e817e6-7ee6-461f-8e66-4bed243cbe98/0436db82-2e48-4adb-8c87-2eb40e052b90.png',
                    offset: 300,
                    duration: 300,
                    zIndex: 9990,
                    right: 30,
                    bottom: 150,
                    safearea: false,
                    width: 72,
                    radius: "50%",
                    left: null
                }
            }
        },
        onLoad(option) {

            this.uid = option.openId
            this.getInfo(option.openId)
            // 等待0.3秒页面渲染,$nextTick使用不能准确
            setTimeout(() => {
                uni.hideLoading()
                // 获取导航条距顶部高度
                this.setTabbarTop();
            }, 300);
            let uid = uni.getStorageSync('token')
            if (uid === option.openId) {
                this.showedit = true
            }
        },
        onShow() {
            this.getFocusOnList()
        },
        methods: {
            /**
             * 获取他发布的
             */
            async findMineRelease() {
                let params = {
                    ...this.articlePageInfo,
                    token: this.userInfo.openid
                }
                console.log(params, 'params')
                let res = await findMineRelease(params);
                this.articleList = res.data.content || []
            },
            // 获取关注列表
            async getFocusOnList() {
                let params = {
                    pageSize: 100000,
                    page: 1,
                }
                let res = await getFocusOnList(params);
                this.focusOnList = res.data.content.map(item => item.toOpenId);
            },
            // 关注 or 取消
            async focusOn(type) {
                let token = uni.getStorageSync("token") || ""
                if (token && this.userInfo.openid) {
                    let params = {
                        fromOpenId: token,
                        toOpenId: this.userInfo.openid,
                        type
                    }
                    let res = await focusOn(params);
                    if (res.code == 200) {
                        this.getFocusOnList();
                        this.getInfo(this.userInfo.openid);
                    }
                }


            },
            // 获取用户详情
            async getInfo(openId) {
                this.loading = true
                try {
                    let res = await getInfo(openId)
                    if (res.code == 200) {
                        res.data.city = getChina(res.data.city)
                        this.userInfo = res.data;
                        this.findMineRelease()
                    }
                } catch (error) {

                } finally {
                    this.loading = false
                }

            },
            // mescroll组件初始化的回调,可获取到mescroll对象
            mescrollInit(mescroll) {
                console.log(mescroll);
                this.mescroll = mescroll;

            },
            upCallback(e) {
                this.mescroll.hideUpScroll()
                console.log('e', e);
            },
            // 滚动事件 (需在up配置onScroll:true才生效)
            scroll(mescroll) {
                this.topNum = mescroll.getScrollTop()
                // console.log(mescroll.getScrollTop());
                if (mescroll.getScrollTop() >= this.tabbarTop) {
                    this.isFixed = true // 显示悬浮菜单
                } else {
                    this.isFixed = false // 隐藏悬浮菜单 
                }
                // console.log(this.isFixed);
            },
            // 修改用户背景封面图
            fnMainBgPic() {

            },
            talkToUser() {
                uni.navigateTo({
                    url: "/message/pages/components/msgChart?data=" + JSON.stringify(this.userInfo)
                })
            },
            //编辑信息
            UserEdit() {
                uni.navigateTo({
                    url: "/mine/pages/edit"
                })
            },
            /// 顶部导航选项点击
            fnBarClick(current) {
                // console.log(current);
                // 是否当前项点击
                if (this.current == current) {
                    this.timeOutUserInfo += 1;
                    // 是否为刷新值和连续点击2次
                    // console.log('timeOutUserInfo',this.timeOutUserInfo);
                    if (!this.clickRefresh && this.timeOutUserInfo >= 2) {
                        // 刷新值开
                        // console.log('点击了两下');
                        this.clickRefresh = true;
                        // 获取新数据

                        // 定时器重置
                        this.timeOutUserInfo = setTimeout(() => {
                            // 清除定时器
                            // console.log('5秒后清除定时器');
                            clearTimeout(this.timeOutUserInfo)
                            // 连续触发记录重置
                            this.timeOutUserInfo = 0;
                            // 5秒后刷新值关
                            this.clickRefresh = false;
                        }, 5000);
                    }
                } else {
                    // 改变顶部导航选中
                    this.current = current;
                    // 首次选中激活顶部导航关联页状态
                    if (!this.status.praise && this.current == 1) this.status.praise = true;
                    // 获取新数据

                    // 清除定时器
                    clearTimeout(this.timeOutUserInfo)
                    // 连续触发记录重置
                    this.timeOutUserInfo = 0;
                    // 刷新值关
                    this.clickRefresh = false;
                }
                // 滚动上滑 
                this.mescroll.scrollTo(this.tabbarTop, 300);
                // console.log("滚动上滑",this.tabbarTop);
            },
            // 设置nav到顶部的距离 (滚动条为0, 菜单顶部的数据加载完毕获取到的数值是最精确的)
            setTabbarTop() {
                let view = uni.createSelectorQuery().in(this).select('#tabbar');
                view.boundingClientRect(data => {
                    // 到屏幕顶部的距离
                    this.tabbarTop = data.top
                }).exec();
                // console.log('tabbarTop',this.tabbarTop);
            },
        }
    }
</script>

<style>
    .info-cover {
        display: block;
        width: 100%;
        height: 260rpx;
    }

    .info-avatar {
        position: absolute;
        left: 0;
        top: -56rpx;
        margin-left: 50rpx;
    }

    .tabbarsh {
        color: #4baed5;
        border-bottom: 4rpx #4baed5 solid;
    }

    .notabbarsh {
        color: #555555;
    }

    .tabbar-fixed {
        position: fixed;
        left: 0;
        right: 0;
        /* #ifdef H5 */
        top: 0rpx;
        /* #endif */
        /* #ifndef H5 
	  top: 0;
	  /* #endif */
        z-index: 300;
        background: #FFFFFF;
        margin-bottom: 0;
        border-bottom: 2rpx #EEEEEE solid;
    }
</style>
