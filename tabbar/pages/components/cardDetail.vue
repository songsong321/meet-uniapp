<template>
  <view class="card-detail">
    <view class="card-header">
      <!-- 头像 -->
      <u-avatar
        src="https://sf6-cdn-tos.toutiaostatic.com/img/mosaic-legacy/2e0e20003729191fac9e8~c5_300x300.image"
        show-sex
        sex-icon="woman"
        show-level
        >
      </u-avatar>
      <!-- 昵称和时间 -->
      <view class="card-right">
        <view class="right-top-name">西瓜妹严尚嘉</view>
        <view class="header-right-bottom">
          两小时前
          <text class="header-right-info">
            <text class="header-right-point">·</text>
            泰洋川禾签约演员 头号英雄主持人
          </text>
        </view>
      </view>
    </view>
    <!-- 内容 -->
    <view class="card-body">
      <view class="card-body-text">
        东棉花胡同39号
      </view>
      <!-- 图片 -->
      <view class="card-body-img-col3" v-if="imgList.length > 1">
        <view class="card-body-img-col3-item" v-for="item in splitImgArr(imgList)" :key="item">
          <view v-for="item2 in item" :key="item2">
            <u-image @click="showPic(item2)" width="100%" height="250upx" :src="item2"></u-image>
          </view>
        </view>
      </view>
      <view class="card-body-img-col1" v-else>
        <u-image @click="showPic(imgList[0])" width="100%" height="750upx" :src="imgList[0]"></u-image>
      </view>
    </view>
   
  </view>
</template>

<script lang="ts" scoped>
import { Component, Vue} from 'vue-property-decorator'
@Component({
  name: 'cardDetail'
}) // 装饰器
export default class cardDetail extends Vue {
  private imgList: Array<string> = [
    'http://p26.toutiaoimg.com/img/tos-cn-i-0022/9b823768adde469996b6efad367b9394~tplv-tt-post:342:224.jpeg?from=post',
    'http://p26.toutiaoimg.com/img/tos-cn-i-0022/030af1dda4404e96889bf2bd7ee44cb0~tplv-tt-post:342:224.jpeg?from=post',
    'http://p26.toutiaoimg.com/img/tos-cn-i-0022/ee96e46ab1c44ed0a7e0f51430b3dca3~tplv-tt-post:342:224.jpeg?from=post',
    'http://p26.toutiaoimg.com/img/tos-cn-i-0022/ee96e46ab1c44ed0a7e0f51430b3dca3~tplv-tt-post:342:224.jpeg?from=post',
    'http://p26.toutiaoimg.com/img/tos-cn-i-0022/23977c52f89742a69636fae4ff64f338~tplv-tt-post:342:224.jpeg?from=post',
    'http://p26.toutiaoimg.com/img/tos-cn-i-0022/04085075c1f64f119f7a036716f413e6~tplv-tt-post:342:224.jpeg?from=post',
    'http://p26.toutiaoimg.com/img/tos-cn-i-0022/5f27fd0e6bcf479aa3a4ef8e819817fb~tplv-tt-post:342:224.jpeg?from=post',
    'http://p26.toutiaoimg.com/img/tos-cn-i-0022/148144db611e44a2ba533a95a6001c54~tplv-tt-post:342:224.jpeg?from=post',
    'http://p26.toutiaoimg.com/img/tos-cn-i-0022/8490dec2d2ff4554a112934de2567f0f~tplv-tt-post:342:224.jpeg?from=post'
  ]
  private commentList: Array<object> = [
    {
      id: 1,
      name: '曾小贤',
      date: '12-25 18:58',
      contentText: '多会儿开始直播答题呀',
      url: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/44f8d690-4f3d-11eb-b680-7980c8a877b8.svg',
      allReply: 12,
      likeNum: 33,
      isLike: false,
      replyList: [
        {
          name: '李四',
          contentStr: '应该没有了吧'
        },
        {
          name: '张三',
          contentStr: '怎么可能有'
        }
      ]
    },
    {
      id: 2,
      name: '风神行',
      date: '01-25 13:58',
      contentText: '啊！',
      allReply: 0,
      likeNum: 11,
      isLike: false,
      url: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/44f8d690-4f3d-11eb-b680-7980c8a877b8.svg',
    }
  ]
  

  /* 切割图片数组 */
  private splitImgArr (data: Array<string>) {
    let result = []
    for(let i = 0; i < data.length; i += 3){
      result.push(data.slice(i, i + 3))
    }
    return result
  }
  // 预览图片
  private showPic(imgSrc: string) {
    uni.previewImage({
      indicator: 'none',
      current: imgSrc,
      urls: this.imgList,
    })
  }
}
</script>

<style lang="scss" scoped>
  .card-detail {
    width: 750upx;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #e5e5e5;
    .card-header {
      padding: 20upx;
      display: flex;
      flex-direction: row;
      background-color: #ffffff;
      .card-right {
        padding-left: 10upx;
      }
    }
    .right-top-name {
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
      background-color: #ffffff;
      padding-bottom: 30upx;
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
      justify-content: space-around;
      padding: 20upx 0;
      .card-foot-item {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        text {
          color: #222;
          font-size: 34upx;
        }
      }
    }
    .detail-pl {
      width: 100%;
      padding: 20upx;
      margin-top: 10upx;
      background-color: #ffffff;
    }
    .comment {
      display: flex;
      padding: 30rpx 0rpx;
      .left {
        image {
          width: 64rpx;
          height: 64rpx;
          border-radius: 50%;
          background-color: #f2f2f2;
        }
      }
      .right {
        flex: 1;
        padding-left: 20rpx;
        font-size: 30rpx;
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10rpx;
          .name {
            color: #121213;
            font-weight: bold;
          }
          .like {
            display: flex;
            align-items: center;
            color: #9a9a9a;
            font-size: 26rpx;
            .num {
              margin-right: 4rpx;
              color: #9a9a9a;
            }
          }
          .highlight {
            color: #2979ff;
            .num {
              color: #2979ff;
            }
          }
        }
        .content {
          margin-bottom: 10rpx;
        }
        .reply-box {
          background-color: rgb(242, 242, 242);
          border-radius: 12rpx;
          .item {
            padding: 20rpx;
            border-bottom: solid 2rpx $u-border-color;
            .username {
              font-size: 24rpx;
              color: #999999;
            }
          }
          .all-reply {
            padding: 20rpx;
            display: flex;
            color: #5677fc;
            align-items: center;
            .more {
              margin-left: 6rpx;
            }
          }
        }
        .bottom {
          margin-top: 20rpx;
          display: flex;
          font-size: 24rpx;
          color: #9a9a9a;
          .reply {
            color: #5677fc;
            margin-left: 10rpx;
          }
        }
      }
    }
  }
</style>
