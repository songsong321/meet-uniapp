<template>
    <view>
        <view class="card-content u-skeleton">
            <view class="card-header">
                <!-- 头像 -->
                <u-avatar class="u-skeleton-circle" @click="goToInfo" :src="articleDetail.releaseAvar"
                    :show-sex="articleDetail.sex==0?false:true"
                    :sex-icon="articleDetail.sex=='1'?'man':articleDetail.sex=='2'?'woman':''"
                    :show-level='articleDetail.level>="5"?true:false'>
                </u-avatar>
                <!-- 昵称和时间 -->
                <view class="card-right">
                    <view style="width: 100%;">
                        <view class="right-top-name u-skeleton-fillet"><text>{{articleDetail.relaseName}}</text>
                        </view>
                        <view class="header-right-bottom" style="margin-top:15rpx">
                            <view>
                                <text class="u-skeleton-fillet">{{articleDetail.releaseTime}}</text>
                                <text class="header-right-info u-skeleton-fillet">
                                    <text class="header-right-point"
                                        v-if="getImgList(articleDetail.tags).length>0">·</text>
                                    <text v-for="(item,index) in getImgList(articleDetail.tags)" :key='index'></text>
                                </text>
                            </view>
                        </view>
                    </view>
                    <view v-if="focusOnBtn" class="u-skeleton-fillet">
                        <u-button :type="focusOnList.includes(articleDetail.userId)?'warning':'success'" :ripple="true"
                            size="mini" style="margin-right: 30rpx;"
                            @click="focusOn(focusOnList.includes(articleDetail.userId)?2:1,articleDetail)">
                            <u-icon style="margin-right: 5upx;"
                                :name="focusOnList.includes(articleDetail.userId)?'checkmark':'plus'"></u-icon>
                            {{focusOnList.includes(articleDetail.userId)?'已关注':'关注'}}
                        </u-button>
                    </view>
                </view>
            </view>
            <!-- 内容 -->
            <view class="card-body">
                <view class="card-body-text u-skeleton-fillet">{{articleDetail.content}}</view>
                <!-- 图片 -->
                <view class=" allImage">
                    <view class="imgList">
                        <u-grid :border="false" :col="3" v-for="item in splitImgArr(getImgList(articleDetail.imgList))"
                            :key="item">
                            <u-grid-item class="u-skeleton-fillet" :custom-style="{padding:'5px 0',minHeight:'40px'}"
                                v-for="item2 in item" :key="item2">
                                <u-image :width="imgWidth+'px'" :height="imgHeight+'px'" lazy-load
                                    :style="{ width: imgWidth + 'px', 'max-height': imgHeight + 'px' }"
                                    @click="showPic(item2,articleDetail.imgList)"
                                    :src="'https://songhan.top/build/files/'+item2" mode="aspectFill">
                                    <u-loading slot="loading" color="#2979ff"></u-loading>
                                    <view slot="error" style="font-size: 24rpx;">加载失败</view>
                                </u-image>
                            </u-grid-item>
                        </u-grid>
                    </view>
                </view>
            </view>
            <!-- address -->
            <view class="address u-skeleton-circle">
                <u-icon name="map-fill" class="map-icon" color="#2979ff"></u-icon>
                <text style="color:#2979ff">{{articleDetail.positionName}}</text>
            </view>
            <!-- 点赞 评论 转发 -->
            <view class="card-foot">
                <view class="card-foot-item u-skeleton-circle" @tap='likeArticle(articleDetail)'>

                    <image
                        :src="articleDetail.likePeople?articleDetail.likePeople.includes(userId)==false?dianzan:dianzand:dianzan"
                        style="width:45upx;height: 45upx;" />
                    <text class="card-foot-item-text">{{articleDetail.likeNum}}</text>
                </view>
                <view class="card-foot-item u-skeleton-circle" @tap='loveArticle(articleDetail)'>
                    <image
                        :src="articleDetail.lovePeople?articleDetail.lovePeople.includes(userId)==false?shoucang:shoucangd:shoucang"
                        style="width:45upx;height: 45upx;" />
                    <text class="card-foot-item-text">{{articleDetail.loveNum}}</text>
                </view>
                <!-- <view class="card-foot-item" @tap="showDetail">
				<image :src="pinglun" style="width:45upx;height: 45upx;" />
				<text class="card-foot-item-text">6</text>
			</view> -->
                <view class="card-foot-item u-skeleton-circle" @tap="shareArticle(splitImgArr(getImgList(articleDetail.imgList)))">
                    <button open-type="share" class="my-button">
                        <image :src="share" style="width:45upx;height: 45upx;" />
                    </button>

                    <!-- <text class="card-foot-item-text">{{articleDetail.forwardingNum}}</text> -->
                </view>

            </view>
        </view>
      
    </view>
</template>

<script lang="ts" scoped>
    import {
        Component,
        Vue,
        Prop
    } from 'vue-property-decorator';
    import userInfo from "@/util/getUserInfo.ts"
    let {
        releaseAvar,
        relaseName,
        tags,
        token,
        level,
        sex
    } = userInfo;
    @Component({
        name: 'ListCard'
    }) // 装饰器
    export default class ListCard extends Vue {
        @Prop({
            type: Array,
            default: []
        }) imgList: array;
        @Prop({
            type: Boolean,
            default: true
        }) focusOnBtn: boolean;
        @Prop({
            type: Boolean,
            default: false
        }) loading: boolean;
        @Prop({
            type: Array,
            default: []
        }) focusOnList: array;
        @Prop({
            type: Object,
            default: {}
        }) articleDetail: object;
        mounted() {
            const res = uni.getSystemInfoSync();
            this.windowHeight = res.windowHeight;
            this.windowWidth = res.windowWidth;
            this.judgeImg();
        }
        // 点赞图片地址
        private dianzan: string = '/static/MyApplets/img/like.png'
        private dianzand: string = '/static/MyApplets/img/like-i.png'
        // 评论图片地址
        private pinglun: string = '/static/MyApplets/img/pinglun.png'
        // 转发图片地址
        private share: string = '/static/MyApplets/img/share1.png'
        // 收藏图片地址
        private shoucang: string = '/static/MyApplets/img/shoucang.png'
        private shoucangd: string = '/static/MyApplets/img/shoucang-i.png'
        private windowHeight: number = 0;
        private windowWidth: number = 0;
        private imgHeight: number = 0;
        private imgWidth: number = 0;

        private userId: string = token ? token : uni.getStorageSync("token") || '';
        private getImgList(data: string) {
            let arr: Array < string > = []
            if (data != '' && data != null) {
                arr = data.split(",")
            } else {
                arr = []
            }
            return arr;
        }
        /**
         * 点赞or取消点赞
         */
        private likeArticle({
            id,
            likePeople
        }): void {
            if (!likePeople) likePeople = ''
            let likeArr = likePeople
            let index = likeArr.indexOf(this.userId)
            index == -1 ? likeArr.push(this.userId) : likeArr.splice(index, 1)
            let params = {
                id,
                type: index == -1 ? 1 : 2,
                likePeople: likeArr.filter(item => item).join(","),
                token: this.userId,
            }
            this.$emit("like", params)
        }
        /**
         * 收藏or取消收藏
         */
        private loveArticle({
            id,
            lovePeople
        }): void {

            if (!lovePeople) lovePeople = ''
            let loveArr = lovePeople
            let index = loveArr.indexOf(this.userId)
            index == -1 ? loveArr.push(this.userId) : loveArr.splice(index, 1)
            let params = {
                id,
                type: index == -1 ? 1 : 2,
                lovePeople: loveArr.join(","),
                token: this.userId,
            }
            this.$emit("love", params)
        }
        /**
         * 分享
         */
        private shareArticle(arr): void {
            let imgUrl = arr.length==0?"":arr[0][0];
            this.$emit("share",imgUrl)
        }
        /* 切割图片数组 */
        private splitImgArr(data: Array < string > ) {
            let result = [];
            for (let i = 0; i < data.length; i += 3) {
                result.push(data.slice(i, i + 3));
            }
            return result;
        }
        /* 查看评论 */
        private showDetail() {
            uni.navigateTo({
                url: '/pages/community/components/cardDetail'
            });
        }
        // 去个人详情页
        private goToInfo() {
            uni.navigateTo({
                url: "/mine/pages/info?openId=" + this.articleDetail.userId
            })
        }
        // 预览图片
        private showPic(imgSrc: string, list: string) {
            imgSrc = "https://songhan.top/build/files/" + imgSrc
            let imgList = this.getImgList(list).map(item => "https://songhan.top/build/files/" + item)
            uni.previewImage({
                indicator: 'none',
                current: imgSrc,
                urls: imgList
            });
        }
        // 自适应判断
        private judgeImg() {

            this.imgWidth = this.windowWidth / 3.2;
            this.imgHeight = this.imgWidth;

        }

        // 关注 or 取消
        private focusOn(type, item) {
            let token = uni.getStorageSync("token") || ""
            if (token && item.userId) {
                let params = {
                    fromOpenId: token,
                    toOpenId: item.userId,
                    type
                }
                this.$emit("focusOn", params)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .my-button {
        background-color: white;
        border: none;
        line-height: 1;
    }

    .my-button::after {
        border: none !important;
    }

    .card-content {
        width: 750upx;
        display: flex;
        flex-direction: column;

        .card-header {
            padding: 20upx;
            display: flex;
            flex-direction: row;

            .card-right {
                width: 100%;
                padding-left: 20upx;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }

        .right-top-name {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #222;
            font-family: PingFangSC-Medium;
            font-size: 30upx;
        }

        .header-right-bottom {
            margin-top: 4upx;
            font-size: 20upx;
            line-height: 10upx;
            color: #999;

            .header-right-info {
                .header-right-point {
                    display: inline-block;
                    padding: 10upx;
                    font-weight: 700;
                }
            }
        }

        .card-body {
            .card-body-text {
                font-size: 30upx;
                line-height: 40upx;
                padding: 0 20upx;
                margin-bottom: 20upx;
            }

            .card-body-img-col1 {
                width: 750upx;
            }

            .card-body-img-col3 {
                width: 750upx;

                .card-body-img-col3-item {
                    width: 750upx;
                    display: flex;
                    flex-direction: row;

                    >view {
                        width: 250upx;
                        margin: 2upx;
                    }
                }
            }
        }

        .card-foot {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 20upx;

            .card-foot-item {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                text {
                    color: #222;
                    font-size: 34upx;
                    margin-left: 4upx;
                }
            }
        }

        .address {
            margin-left: 40upx;
            margin-top: 20upx;

            .map-icon {
                margin-right: 10upx;
            }
        }
    }

    .allImage {
        display: flex;
        margin-top: 10rpx;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .imgList {
        width: 100%;
    }

    .images {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        div {
            flex: 1
        }
    }
</style>
