<template>
    <view>

        <view class="content" @touchstart="hideDrawer">
           
            <scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation"
                :scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory"
                :style="{bottom:bottom+'rpx'}" upper-threshold="50">
                <!-- 加载历史数据waitingUI -->
                <view class="loading" v-if="isHistoryLoading">
                    <view class="spinner">
                        <view class="rect1"></view>
                        <view class="rect2"></view>
                        <view class="rect3"></view>
                        <view class="rect4"></view>
                        <view class="rect5"></view>
                    </view>
                </view>
                <view class="row" v-for="(row, index) in msgList" :key="index" :id="'msg' + row.id">
                    <!-- 系统消息 -->
                    <block v-if="row.type == 'system'">
                        <view class="system">
                            <!-- 文字消息 -->
                            <view v-if="row.type == 'text'" class="text">{{ row.message }}</view>
                            <!-- 领取红包消息 -->
                            <view v-if="row.type == 'redEnvelope'" class="red-envelope">
                                <image src="/static/img/red-envelope-chat.png"></image>
                                {{ row.message }}
                            </view>
                        </view>
                    </block>
                    <!-- 用户消息 -->
                    <block v-if="row.type != 'system'">
                        <!-- 自己发出的消息 -->

                        <view class="my" v-if="row.fromOpenId == myuid">
                            <!-- 左-消息 -->
                            <view class="left">
                                <!-- 文字消息 -->

                                <view v-if="row.type == 'text'" class="bubble">
                                    <rich-text :nodes="row.message"></rich-text>
                                </view>
                                <!-- 语言消息 -->
                                <view v-if="row.type == 'voice'" class="bubble voice" @tap="playVoice(row)"
                                    :class="playMsgid == row.id ? 'play' : ''">
                                    <view class="length">{{ row.length }}</view>
                                    <view class="icon my-voice"></view>
                                </view>
                                <!-- 图片消息 -->
                                <view v-if="row.type == 'img'" class="bubble img" @tap="showPic(row.message)">
                                    <image lazy-load :src="row.base64" @load='imgLoad(index)'>
                                    </image>
                                </view>
                            </view>
                            <!-- 右-头像 -->
                            <view class="right">
                                <image :src="row.fromAvar" @click="goToInfo(row.fromOpenId)"></image>
                            </view>
                        </view>
                        <!-- 别人发出的消息 -->
                        <view class="other" v-if="row.fromOpenId != myuid">
                            <!-- 左-头像 -->
                            <view class="left">
                                <image :src="row.fromAvar" @click="goToInfo(row.fromOpenId)"></image>
                            </view>
                            <!-- 右-用户名称-时间-消息 -->
                            <view class="right">
                                <view class="username">
                                    <!-- <view class="name">{{ row.fromName }}</view> -->
                                    <view class="time">{{ row.sendTime }}</view>
                                </view>
                                <!-- 文字消息 -->
                                <view v-if="row.type == 'text'" class="bubble">
                                    <rich-text :nodes="row.message"></rich-text>
                                </view>
                                <!-- 语音消息 -->
                                <view v-if="row.type == 'voice'" class="bubble voice" @tap="playVoice(row)"
                                    :class="playMsgid == row.id ? 'play' : ''">
                                    <view class="icon other-voice"></view>
                                    <view class="length">{{ row.length }}</view>
                                </view>
                                <!-- 图片消息 -->
                                <view v-if="row.type == 'img'" class="bubble img" @tap="showPic(row.message)">
                                    <image :src="row.base64" @load='imgLoad'></image>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
            </scroll-view>
        </view>
        <!-- 抽屉栏 -->
        <view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
            <!-- 表情 -->
            <swiper class="emoji-swiper" :class="{ hidden: hideEmoji }" indicator-dots="true" duration="150">
                <swiper-item v-for="(page, pid) in emojiList" :key="pid">
                    <scroll-view :scroll-y="true" style="width: 100%;height: 100%;overflow: hidden;">
                        <view v-for="(em, eid) in page" :key="eid" @tap="addEmoji(em)" style="float: left;">
                            <image mode="widthFix" :src="'https://songhan.top/emoji/' + em.url"></image>
                        </view>
                    </scroll-view>
                </swiper-item>
            </swiper>
            <!-- 更多功能 相册-拍照-红包 -->
            <view class="more-layer" :class="{ hidden: hideMore }">
                <view class="list">
                    <view class="box" @tap="chooseImage">
                        <view class="icon tupian2"></view>
                    </view>
                    <view class="box" @tap="camera">
                        <view class="icon paizhao"></view>
                    </view>
                    <view class="box" @tap="videoCall">
                        <view class="icon shipin"></view>
                    </view>
                    <view class="box" @tap="showMap">
                        <view class="icon ditu"></view>
                    </view>
                    <!-- <view class="box" @tap="handRedEnvelopes"
            ><view class="icon hongbao"></view
          ></view> -->
                </view>
            </view>
        </view>
        <!-- 底部输入栏 -->
        <view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
            <!-- H5下不能录音，输入栏布局改动一下 -->
            <!-- #ifndef H5 -->
            <view class="voice">
                <view class="icon" :class="isVoice ? 'jianpan' : 'yuyin'" @tap="switchVoice"></view>
            </view>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <view class="more" @tap="showMore">
                <view class="icon add"></view>
            </view>
            <!-- #endif -->
            <view class="textbox">
                <view class="voice-mode" :class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']"
                    @touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd"
                    @touchcancel="voiceCancel">
                    {{ voiceTis }}
                </view>
                <view class="text-mode" :class="isVoice ? 'hidden' : ''">
                    <view class="box">
                        <!-- <textarea
              auto-height="true"
              v-model="textMsg"
              @focus="textareaFocus"
              style="padding: 7px 0;"
              cursor-spacing="10"
            /> -->
                        <input type="text" v-model="textMsg" @focus="textareaFocus" style="padding: 7px 0;"
                            cursor-spacing="10" />
                    </view>
                    <view class="em" @tap="chooseEmoji">
                        <view class="icon biaoqing" style="display: flex;align-items: center;"></view>
                    </view>
                </view>
            </view>
            <!-- #ifndef H5 -->
            <view class="more" @tap="showMore">
                <view class="icon add"></view>
            </view>
            <!-- #endif -->
            <view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText">
                <view class="btn">发送</view>
            </view>
        </view>
        <!-- 录音UI效果 -->
        <view class="record" :class="recording ? '' : 'hidden'">
            <view class="ing" :class="willStop ? 'hidden' : ''">
                <view class="icon luyin2"></view>
            </view>
            <view class="cancel" :class="willStop ? '' : 'hidden'">
                <view class="icon chehui"></view>
            </view>
            <view class="tis" :class="willStop ? 'change' : ''">{{ recordTis }}</view>
        </view>
        <u-top-tips ref="uTips"></u-top-tips>
    </view>
</template>
<script lang="ts">
    import {
        Component,
        Vue,
        Watch
    } from 'vue-property-decorator';
    import {
        mapActions,
        mapGetters
    } from 'vuex';
    import {
        acceptMessage
    } from '@/mixins/acceptMessage';
    import userInfo from '@/util/getUserInfo.ts';
    let {
        releaseAvar,
        relaseName,
        tags,
        token,
        level,
        sex
    } = userInfo;
    import {
        getInfo
    } from '@/api/user/index';
    import {
        findMessageRecord
    } from '@/api/message/index'
    @Component({
        name: 'MsgChartPage',
        computed: {
            ...mapGetters({
                getMessage: "user/getMessageList"
            }),
        },
        methods: {
            ...mapActions(['sendMessage'])
        },
        mixins: [acceptMessage]
    }) // 装饰器
    export default class MsgChartPage extends Vue {
        @Watch('hideMore')
        watchHeight(val: boolean) {
            if (!val) {
                this.bottom = 500
                this.$nextTick(function() {
                    // 滚动到底
                    this.scrollToView = 'msg' + (this.msgList.length > 0 ? this.msgList[this.msgList
                        .length - 1].id : new Date().getTime());
                    this.scrollAnimation = false
                });
            } else {
                this.bottom = 150
            }
        }
        @Watch('hideEmoji')
        watchHeight(val: boolean) {
            if (!val) {
                this.bottom = 500
                this.$nextTick(function() {
                    // 滚动到底
                    this.scrollToView = 'msg' + (this.msgList.length > 0 ? this.msgList[this.msgList
                        .length - 1].id : new Date().getTime());
                    this.scrollAnimation = false
                });

            } else {
                this.bottom = 150
            }
        }
        private imgLoading: Array < object > = []
        private bottom: number = 150
        // 接收用户信息参数
        private toUser: object = {};
        // 文字消息相关参数
        private textMsg: any = '';
        private isHistoryLoading: any = false;
        private scrollAnimation: any = false;
        private scrollTop: any = 0;
        private scrollToView: any = '';
        private openId = '';
        private msgList: Array < object > = []
        private msgImgList: any = [];
        private myuid: any = uni.getStorageSync('token');
        private id: String = ""
        // 录音相关参数
        private readonly RECORDER: any = uni.getRecorderManager();
        private isVoice: any = false;
        private voiceTis: any = '按住 说话';
        private recordTis: any = '手指上滑 取消发送';
        private recording: any = false;
        private willStop: any = false;
        private initPoint: any = {
            identifier: 0,
            Y: 0
        };
        private recordTimer: any = null;
        private recordLength: any = 0;
        // 播放语音相关参数
        private readonly AUDIO: any = uni.createInnerAudioContext();
        private playMsgid: any = null;
        private VoiceTimer: any = null;
        private popupLayerClass: any = '';
        private hideMore: any = true;
        // 表情相关
        private hideEmoji: any = true;
        private emojiList: any = [
            [{
                    url: '100.gif',
                    alt: '[微笑]'
                },
                {
                    url: '101.gif',
                    alt: '[伤心]'
                },
                {
                    url: '102.gif',
                    alt: '[美女]'
                },
                {
                    url: '103.gif',
                    alt: '[发呆]'
                },
                {
                    url: '104.gif',
                    alt: '[墨镜]'
                },
                {
                    url: '105.gif',
                    alt: '[哭]'
                },
                {
                    url: '106.gif',
                    alt: '[羞]'
                },
                {
                    url: '107.gif',
                    alt: '[哑]'
                },
                {
                    url: '108.gif',
                    alt: '[睡]'
                },
                {
                    url: '109.gif',
                    alt: '[哭]'
                },
                {
                    url: '110.gif',
                    alt: '[囧]'
                },
                {
                    url: '111.gif',
                    alt: '[怒]'
                },
                {
                    url: '112.gif',
                    alt: '[调皮]'
                },
                {
                    url: '113.gif',
                    alt: '[笑]'
                },
                {
                    url: '114.gif',
                    alt: '[惊讶]'
                },
                {
                    url: '115.gif',
                    alt: '[难过]'
                },
                {
                    url: '116.gif',
                    alt: '[酷]'
                },
                {
                    url: '117.gif',
                    alt: '[汗]'
                },
                {
                    url: '118.gif',
                    alt: '[抓狂]'
                },
                {
                    url: '119.gif',
                    alt: '[吐]'
                },
                {
                    url: '120.gif',
                    alt: '[笑]'
                },
                {
                    url: '121.gif',
                    alt: '[快乐]'
                },
                {
                    url: '122.gif',
                    alt: '[奇]'
                },
                {
                    url: '123.gif',
                    alt: '[傲]'
                }
            ],
            [{
                    url: '124.gif',
                    alt: '[饿]'
                },
                {
                    url: '125.gif',
                    alt: '[累]'
                },
                {
                    url: '126.gif',
                    alt: '[吓]'
                },
                {
                    url: '127.gif',
                    alt: '[汗]'
                },
                {
                    url: '128.gif',
                    alt: '[高兴]'
                },
                {
                    url: '129.gif',
                    alt: '[闲]'
                },
                {
                    url: '130.gif',
                    alt: '[努力]'
                },
                {
                    url: '131.gif',
                    alt: '[骂]'
                },
                {
                    url: '132.gif',
                    alt: '[疑问]'
                },
                {
                    url: '133.gif',
                    alt: '[秘密]'
                },
                {
                    url: '134.gif',
                    alt: '[乱]'
                },
                {
                    url: '135.gif',
                    alt: '[疯]'
                },
                {
                    url: '136.gif',
                    alt: '[哀]'
                },
                {
                    url: '137.gif',
                    alt: '[鬼]'
                },
                {
                    url: '138.gif',
                    alt: '[打击]'
                },
                {
                    url: '139.gif',
                    alt: '[bye]'
                },
                {
                    url: '140.gif',
                    alt: '[汗]'
                },
                {
                    url: '141.gif',
                    alt: '[抠]'
                },
                {
                    url: '142.gif',
                    alt: '[鼓掌]'
                },
                {
                    url: '143.gif',
                    alt: '[糟糕]'
                },
                {
                    url: '144.gif',
                    alt: '[恶搞]'
                },
                {
                    url: '145.gif',
                    alt: '[什么]'
                },
                {
                    url: '146.gif',
                    alt: '[什么]'
                },
                {
                    url: '147.gif',
                    alt: '[累]'
                }
            ],
            [{
                    url: '148.gif',
                    alt: '[看]'
                },
                {
                    url: '149.gif',
                    alt: '[难过]'
                },
                {
                    url: '150.gif',
                    alt: '[难过]'
                },
                {
                    url: '151.gif',
                    alt: '[坏]'
                },
                {
                    url: '152.gif',
                    alt: '[亲]'
                },
                {
                    url: '153.gif',
                    alt: '[吓]'
                },
                {
                    url: '154.gif',
                    alt: '[可怜]'
                },
                {
                    url: '155.gif',
                    alt: '[刀]'
                },
                {
                    url: '156.gif',
                    alt: '[水果]'
                },
                {
                    url: '157.gif',
                    alt: '[酒]'
                },
                {
                    url: '158.gif',
                    alt: '[篮球]'
                },
                {
                    url: '159.gif',
                    alt: '[乒乓]'
                },
                {
                    url: '160.gif',
                    alt: '[咖啡]'
                },
                {
                    url: '161.gif',
                    alt: '[美食]'
                },
                {
                    url: '162.gif',
                    alt: '[动物]'
                },
                {
                    url: '163.gif',
                    alt: '[鲜花]'
                },
                {
                    url: '164.gif',
                    alt: '[枯]'
                },
                {
                    url: '165.gif',
                    alt: '[唇]'
                },
                {
                    url: '166.gif',
                    alt: '[爱]'
                },
                {
                    url: '167.gif',
                    alt: '[分手]'
                },
                {
                    url: '168.gif',
                    alt: '[生日]'
                },
                {
                    url: '169.gif',
                    alt: '[电]'
                },
                {
                    url: '170.gif',
                    alt: '[炸弹]'
                },
                {
                    url: '171.gif',
                    alt: '[刀子]'
                }
            ],
            [{
                    url: '172.gif',
                    alt: '[足球]'
                },
                {
                    url: '173.gif',
                    alt: '[瓢虫]'
                },
                {
                    url: '174.gif',
                    alt: '[翔]'
                },
                {
                    url: '175.gif',
                    alt: '[月亮]'
                },
                {
                    url: '176.gif',
                    alt: '[太阳]'
                },
                {
                    url: '177.gif',
                    alt: '[礼物]'
                },
                {
                    url: '178.gif',
                    alt: '[抱抱]'
                },
                {
                    url: '179.gif',
                    alt: '[拇指]'
                },
                {
                    url: '180.gif',
                    alt: '[贬低]'
                },
                {
                    url: '181.gif',
                    alt: '[握手]'
                },
                {
                    url: '182.gif',
                    alt: '[剪刀手]'
                },
                {
                    url: '183.gif',
                    alt: '[抱拳]'
                },
                {
                    url: '184.gif',
                    alt: '[勾引]'
                },
                {
                    url: '185.gif',
                    alt: '[拳头]'
                },
                {
                    url: '186.gif',
                    alt: '[小拇指]'
                },
                {
                    url: '187.gif',
                    alt: '[拇指八]'
                },
                {
                    url: '188.gif',
                    alt: '[食指]'
                },
                {
                    url: '189.gif',
                    alt: '[ok]'
                },
                {
                    url: '190.gif',
                    alt: '[情侣]'
                },
                {
                    url: '191.gif',
                    alt: '[爱心]'
                },
                {
                    url: '192.gif',
                    alt: '[蹦哒]'
                },
                {
                    url: '193.gif',
                    alt: '[颤抖]'
                },
                {
                    url: '194.gif',
                    alt: '[怄气]'
                },
                {
                    url: '195.gif',
                    alt: '[跳舞]'
                }
            ],
            [{
                    url: '196.gif',
                    alt: '[发呆]'
                },
                {
                    url: '197.gif',
                    alt: '[背着]'
                },
                {
                    url: '198.gif',
                    alt: '[伸手]'
                },
                {
                    url: '199.gif',
                    alt: '[耍帅]'
                },
                {
                    url: '200.png',
                    alt: '[微笑]'
                },
                {
                    url: '201.png',
                    alt: '[生病]'
                },
                {
                    url: '202.png',
                    alt: '[哭泣]'
                },
                {
                    url: '203.png',
                    alt: '[吐舌]'
                },
                {
                    url: '204.png',
                    alt: '[迷糊]'
                },
                {
                    url: '205.png',
                    alt: '[瞪眼]'
                },
                {
                    url: '206.png',
                    alt: '[恐怖]'
                },
                {
                    url: '207.png',
                    alt: '[忧愁]'
                },
                {
                    url: '208.png',
                    alt: '[眨眉]'
                },
                {
                    url: '209.png',
                    alt: '[闭眼]'
                },
                {
                    url: '210.png',
                    alt: '[鄙视]'
                },
                {
                    url: '211.png',
                    alt: '[阴暗]'
                },
                {
                    url: '212.png',
                    alt: '[小鬼]'
                },
                {
                    url: '213.png',
                    alt: '[礼物]'
                },
                {
                    url: '214.png',
                    alt: '[拜佛]'
                },
                {
                    url: '215.png',
                    alt: '[力量]'
                },
                {
                    url: '216.png',
                    alt: '[金钱]'
                },
                {
                    url: '217.png',
                    alt: '[蛋糕]'
                },
                {
                    url: '218.png',
                    alt: '[彩带]'
                },
                {
                    url: '219.png',
                    alt: '[礼物]'
                }
            ]
        ];

        //红包相关参数
        private windowsState: any = '';
        private redenvelopeData: any = {
            rid: null, //红包ID
            from: null,
            face: null,
            blessing: null,
            money: null
        };
        // 定义loading
        private loading = false;
        private async findMessageRecord() {
            let res = await findMessageRecord({
                messageId: this.id
            })
            this.msgList = res.data || []
            this.scrollToView ='msg'+this.msgList[this.msgList.length-1].id || ''
        }
        // 获取详情
        private async getInfo(openId: string) {
            let res = await getInfo(openId);
            if (res.code == 200) {
                this.toUser = res.data;
            } else {}
        }
        onLoad(data: any) {
            const jsonData = JSON.parse(decodeURIComponent(data.data));
            this.getInfo(jsonData.openid);
            uni.setNavigationBarTitle({
                title: jsonData.nickName
            });
            this.scrollTop = 9999999;
            this.openId = jsonData.openid
            this.id = jsonData.id
            this.findMessageRecord();
            //语音自然播放结束
            this.AUDIO.onEnded((res: any) => {
                let fs = uni.getFileSystemManager()
                try {
                    fs.unlinkSync(`${wx.env.USER_DATA_PATH}/files/${this.playMsgid}.mp3`)
                } catch (e) {
                    console.log(e, 'e')
                }
                this.playMsgid = null;
            });
            //录音开始事件
            this.RECORDER.onStart((e: any) => {
                this.recordBegin(e);
            });
            //录音结束事件
            this.RECORDER.onStop((e: any) => {
                this.recordEnd(e);
            });
        }
        onShow() {
            this.scrollTop = 9999999;
        }
        // 接受消息(筛选处理)
        private screenMsg(msg: any) {
            //从长连接处转发给这个方法，进行筛选处理
            if (msg.type == 'system') {} else {
                // 用户消息
                switch (msg.type) {
                    case 'text':
                        this.addTextMsg(msg);
                        break;
                    case 'voice':
                        this.addVoiceMsg(msg);
                        break;
                    case 'img':
                        this.addImgMsg(msg);
                        break;
                    case 'redEnvelope':
                        this.addRedEnvelopeMsg(msg);
                        break;
                }
            }
            this.$nextTick(function() {
                // 滚动到底
                this.scrollToView = 'msg' + msg.id;
                this.scrollAnimation = false
            });
        }
        private imgLoad(i) {
            // this.$set(this.imgLoading, i, {
            //     isLoading: true
            // })
            // console.log(this.imgLoading, 'loading')
        }

        //触发滑动到顶部(加载历史信息记录)
        private loadHistory() {
            uni.stopPullDownRefresh();
            if (this.isHistoryLoading) {
                return;
            }
            this.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求
            this.scrollAnimation = false; //关闭滑动动画
            let Viewid = 0;
            if (this.msgList.length > 0) {
                Viewid = this.msgList[this.msgList.length - 1].id; //记住第一个信息ID
            }

            //本地模拟请求历史记录效果
            setTimeout(() => {
                // // 消息列表
                // let list = [{ 8id: '1', type: 'text', fromName: '宋松', fromOpenId: '123', fromAvar: 'https://cdn.uviewui.com/uview/common/logo.png', message: '测试' }];
                // // 获取消息中的图片,并处理显示尺寸
                // for (let i = 0; i < list.length; i++) {
                // 	if (list[i].type == 'user' && list[i].msg.type == 'img') {
                // 		// list[i].msg.content = this.setPicSize(list[i].msg.content)
                // 		// const imgContent: any = list[i].msg.content
                // 		this.msgImgList.unshift(list[i].message);
                // 	}
                // 	list[i].id = Math.floor(Math.random() * 1000 + 1);
                // 	this.msgList.unshift(list[i]);
                // }

                //这段代码很重要，不然每次加载历史数据都会跳到顶部
                this.$nextTick(function() {
                    this.scrollToView = 'msg' + Viewid; //跳转上次的第一行信息位置
                    this.$nextTick(function() {
                        this.scrollAnimation = true; //恢复滚动动画
                    });
                });
                this.isHistoryLoading = false;
            }, 1000);
        }
        // 下拉刷新
        private onPullDownRefresh() {
            // this.loadHistory();
        }
        //压缩图片
        compressImage(src) {
            let that = this
            return new Promise((resolve, reject) => {
                uni.compressImage({
                    src,
                    quality: 50,
                    success: res => {
                        resolve(res.tempFilePath)
                    },
                    fail: err => {
                        reject(err)
                    }
                })
            })

        }
        // 加载初始页面消息
        private getMsgList(openId) {
            
            // 滚动到底部
            this.$nextTick(function() {
                //进入页面滚动到底部
                this.scrollTop = 9999;
                this.$nextTick(function() {
                    this.scrollAnimation = true;
                });
            });
        }
        //处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
        private setPicSize(content: any) {
            // 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
            let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
            let maxH = uni.upx2px(350); //350是定义消息图片最大高度
            if (content.w > maxW || content.h > maxH) {
                let scale = content.w / content.h;
                content.w = scale > 1 ? maxW : maxH * scale;
                content.h = scale > 1 ? maxW / scale : maxH;
            }
            return content;
        }

        //更多功能(点击+弹出)
        private showMore() {
            this.isVoice = false;
            this.hideEmoji = true;
            if (this.hideMore) {
                this.hideMore = false;
                this.openDrawer();
            } else {
                this.hideDrawer();
            }
        }
        // 打开抽屉
        private openDrawer() {
            this.popupLayerClass = 'showLayer';
        }
        // 隐藏抽屉
        private hideDrawer() {
            this.popupLayerClass = '';
            setTimeout(() => {
                this.hideMore = true;
                this.hideEmoji = true;
            }, 150);
        }
        // 选择图片发送
        private chooseImage() {
            this.getImage('album');
        }
        //拍照发送
        private camera() {
            this.getImage('camera');
        }
        // 视频通话
        private videoCall() {
            uni.showToast({
                title: "暂未开放",
                icon: "none"
            })
        }
        // 地图
        private showMap() {
            uni.showToast({
                title: "暂未开放",
                icon: "none"
            })
        }
        //发红包
        private handRedEnvelopes() {
            uni.navigateTo({
                url: 'HM-hand/HM-hand'
            });
            this.hideDrawer();
        }
        //选照片 or 拍照
        private getImage(type: any) {
            this.hideDrawer();
            uni.chooseImage({
                count: 1,
                sourceType: [type],
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                success: res => {
                    for (let i = 0; i < res.tempFilePaths.length; i++) {
                        uni.getImageInfo({
                            src: res.tempFilePaths[i],
                            success: async image => {
                                try {
                                    let img = await this.compressImage(res.tempFilePaths[0])
                                    uni.getFileInfo({
                                        filePath: img,
                                        success: res => {
                                            if (res.size > 307200) {
                                                this.$refs.uTips.show({
                                                    title: '图片太大了哟',
                                                    type: 'error',
                                                    duration: '2300'
                                                })
                                            } else {
                                                uni.getFileSystemManager()
                                                    .readFile({
                                                        filePath: img,
                                                        encoding: 'base64',
                                                        success: r => {
                                                            let base64 =
                                                                'data:image/jpeg;base64,' +
                                                                r.data;
                                                            let msg = {
                                                                url: "[图片]",
                                                                w: image
                                                                    .width,
                                                                h: image
                                                                    .height,
                                                                src: base64
                                                            };
                                                            this.sendMsg(
                                                                msg,
                                                                'img'
                                                            );
                                                        },
                                                        fail: err => {
                                                            console.log(
                                                                err,
                                                                'err'
                                                            )
                                                            this.$refs
                                                                .uTips
                                                                .show({
                                                                    title: '转码失败',
                                                                    type: 'error',
                                                                    duration: '2300'
                                                                })
                                                        }
                                                    })
                                            }
                                        },
                                        fail: err => {
                                            this.$refs.uTips.show({
                                                title: '获取图片失败',
                                                type: 'error',
                                                duration: '2300'
                                            })
                                        }
                                    })

                                } catch (error) {
                                    console.log(error, 'error')
                                    this.$refs.uTips.show({
                                        title: '压缩失败',
                                        type: 'error',
                                        duration: '2300'
                                    })
                                }


                            }
                        });
                    }
                }
            });
        }
        // 选择表情
        private chooseEmoji() {
            this.hideMore = true;
            if (this.hideEmoji) {
                this.hideEmoji = false;
                this.openDrawer();
            } else {
                this.hideDrawer();
            }
        }
        //添加表情
        private addEmoji(em: any) {
            this.textMsg += em.alt;
        }

        //获取焦点，如果不是选表情ing,则关闭抽屉
        private textareaFocus() {
            if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
                this.hideDrawer();
            }
        }
        // 发送文字消息
        private sendText() {
            this.hideDrawer(); //隐藏抽屉
            if (!this.textMsg) {
                return;
            }
            let content = this.replaceEmoji(this.textMsg);
            // let content =(this.textMsg);
            let msg = {
                url: content
            };
            this.sendMsg(msg, 'text', this.textMsg);
            this.textMsg = ''; //清空输入框
        }
        //替换表情符号为图片
        private replaceEmoji(str: any) {
            let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item: any, index: any) => {

                for (let i = 0; i < this.emojiList.length; i++) {
                    let row = this.emojiList[i];
                    for (let j = 0; j < row.length; j++) {
                        let EM = row[j];
                        if (EM.alt == item) {
                            //在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径
                            //比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
                            let onlinePath = 'https://songhan.top/emoji/';
                            let imgstr = '<img style="vertical-align: middle;" src="' + onlinePath + EM
                                .url + '">';
                            return imgstr;
                        }
                    }
                }
            });
            return '<div style="line-height: 25px;">' + replacedStr + '</div>';
        }
        private goToInfo(id){
            uni.navigateTo({
                url:"/mine/pages/info?openId="+id
            })
        }
        // 发送消息
        private sendMsg(content: any, type: any, standbyMessage: string = "") {
            //实际应用中，此处应该提交长连接，模板仅做本地处理。
            var nowDate = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + "/" + new Date()
                .getDate() +
                ' ' + new Date().getHours() + ':' + new Date().getMinutes();
            let types = ["img", 'voice']
            let typesList = ["[图片]", "[语音]"]
            let msg = {
                id: new Date().getTime(),
                type,
                message: content.url,
                length: content.length,
                sendTime: nowDate,
                toName: this.toUser.nickName,
                toAvar: this.toUser.avatarUrl,
                toOpenId: this.toUser.openid,
                fromName: relaseName,
                fromAvar: releaseAvar,
                fromOpenId: token,
                w: content.w,
                h: content.h,
                standbyMessage: types.indexOf(type) != -1 ? typesList[types.indexOf(type)] : standbyMessage,
                base64: types.includes(type) ? content.src : ""
            };
            this.sendMessage(msg);
            // this.storeMessages(msg)
            // 发送消息
            // this.screenMsg(msg);
        }

        // 添加文字消息到列表
        private addTextMsg(msg: any) {
            this.msgList.push(msg);
        }
        // 添加语音消息到列表
        private addVoiceMsg(msg: any) {
            this.msgList.push(msg);
        }
        // 添加图片消息到列表
        private addImgMsg(msg: any) {
            this.msgImgList.push(msg.message);
            this.msgList.push(msg);
        }
        private addRedEnvelopeMsg(msg: any) {
            this.msgList.push(msg);
        }
        // 添加系统文字消息到列表
        private addSystemTextMsg(msg: any) {
            this.msgList.push(msg);
        }
        // 添加系统红包消息到列表
        private addSystemRedEnvelopeMsg(msg: any) {
            this.msgList.push(msg);
        }
        private sendSystemMsg(content: any, type: any) {
            let lastid = this.msgList[this.msgList.length - 1].msg.id;
            lastid++;
            let row = {
                type: 'system',
                msg: {
                    id: lastid,
                    type: type,
                    content: content
                }
            };
            this.screenMsg(row);
        }
        private acceptMessage(msg) {
            this.screenMsg(msg)
        }
        // 预览图片
        private showPic(msg: string) {
            uni.previewImage({
                indicator: 'none',
                current: msg,
                urls: this.msgImgList
            });
        }
        // 播放语音
        private playVoice(msg: any) {
            let fs = uni.getFileSystemManager();
            try {
                fs.accessSync(`${wx.env.USER_DATA_PATH}/files`)
            } catch (err) {
                console.log(err,'err')
                fs.mkdirSync(`${wx.env.USER_DATA_PATH}/files`)
            }
            try {
                fs.writeFileSync(`${wx.env.USER_DATA_PATH}/files/${msg.id}.mp3`, (msg.base64.slice(22)), 'base64')
                this.playMsgid = this.playMsgid == msg.id ? null : msg.id;
                if (this.playMsgid) {
                    this.AUDIO.src = `${wx.env.USER_DATA_PATH}/files/${msg.id}.mp3`;
                    this.$nextTick(function() {
                        this.AUDIO.play();
                    });
                } else {
                    this.$nextTick(() => {
                        this.AUDIO.stop()
                    })
                    fs.unlinkSync(`${wx.env.USER_DATA_PATH}/files/${msg.id}.mp3`)
                }
            } catch (e) {
                console.log(e,'e')
                uni.showToast({
                    title: "播放失败",
                    icon: "none",
                    duration: 2000
                })
            }





        }
        // 录音开始
        private voiceBegin(e: any) {
            if (e.touches.length > 1) {
                return;
            }
            this.initPoint.Y = e.touches[0].clientY;
            this.initPoint.identifier = e.touches[0].identifier;
            this.RECORDER.start({
                format: 'mp3'
            }); //录音开始,
        }
        //录音开始UI效果
        private recordBegin(e: any) {
            this.recording = true;
            this.voiceTis = '松开 结束';
            this.recordLength = 0;
            this.recordTimer = setInterval(() => {
                this.recordLength++;
            }, 1000);
        }
        // 录音被打断
        private voiceCancel() {
            this.recording = false;
            this.voiceTis = '按住 说话';
            this.recordTis = '手指上滑 取消发送';
            this.willStop = true; //不发送录音
            this.RECORDER.stop(); //录音结束
        }
        // 录音中(判断是否触发上滑取消发送)
        private voiceIng(e: any) {
            if (!this.recording) {
                return;
            }
            let touche = e.touches[0];
            //上滑一个导航栏的高度触发上滑取消发送
            if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
                this.willStop = true;
                this.recordTis = '松开手指 取消发送';
            } else {
                this.willStop = false;
                this.recordTis = '手指上滑 取消发送';
            }
        }
        // 结束录音
        private voiceEnd(e: any) {
            if (!this.recording) {
                return;
            }
            this.recording = false;
            this.voiceTis = '按住 说话';
            this.recordTis = '手指上滑 取消发送';
            this.RECORDER.stop(); //录音结束
        }
        //录音结束(回调文件)
        private recordEnd(e: any) {
            clearInterval(this.recordTimer);
            console.log(this.willStop, 'willStop')
            if (!this.willStop) {
                let msg = {}
                uni.getFileSystemManager().readFile({
                    filePath: e.tempFilePath,
                    encoding: 'base64',
                    success: r => {
                        let base64 = 'data:audio/mp3;base64,' +
                            r.data;
                        msg = {
                            url: "[语音]",
                            src: base64,
                            length: ""
                        };
                        let min: any = parseInt(String(this.recordLength / 60));
                        let sec: any = this.recordLength % 60;
                        min = min < 10 ? '0' + min : min;
                        sec = sec < 10 ? '0' + sec : sec;
                        msg.length = min + ':' + sec;
                        console.log(msg, 'msg')
                        this.sendMsg(msg, 'voice');
                    },
                    fail: err => {
                        uni.showToast({
                            title: "发送失败",
                            icon: "none",
                            duration: 2000
                        })
                        console.log(err, 'err')
                    }
                })

            } else {
                console.log('取消发送录音');
            }
            this.willStop = false;
        }
        // 切换语音/文字输入
        private switchVoice() {
            this.hideDrawer();
            this.isVoice = this.isVoice ? false : true;
        }
        private discard() {
            return;
        }
    }
</script>

<style lang="scss" scoped>
    page {
        background-color: #e5e5e5;
    }

    .hidden {
        display: none !important;
    }

    .popup-layer {
        &.showLayer {
            transform: translate3d(0, -42vw, 0);
        }

        transition: all 0.15s linear;
        width: 750upx;
        height: 42vw;
        padding: 20upx 2%;
        background-color: #f3f3f3;
        border-top: solid 1upx #ddd;
        position: fixed;
        z-index: 20;
        top: 100%;

        .emoji-swiper {
            height: 40vw;

            swiper-item {
                display: flex;
                align-content: flex-start;
                flex-wrap: wrap;

                view {
                    width: 13vw;
                    height: 13vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    image {
                        width: 8.4vw;
                        height: 8.4vw;
                    }
                }
            }
        }

        .more-layer {
            width: 100%;
            height: 42vw;

            .list {
                width: 100%;
                display: flex;
                flex-wrap: wrap;

                .box {
                    width: 18vw;
                    height: 18vw;
                    border-radius: 20upx;
                    background-color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 2.8vw 2vw 2.8vw;

                    .icon {
                        font-size: 70upx;
                    }
                }
            }
        }
    }

    .input-box {
        width: 750upx;
        min-height: 140upx;

        padding: 0 1%;
        padding-bottom: 40upx;
        background-color: #f2f2f2;
        display: flex;
        position: fixed;
        z-index: 20;
        bottom: -2upx;

        &.showLayer {
            transform: translate3d(0, -42vw, 0);
        }

        transition: all 0.15s linear;
        border-bottom: solid 1upx #ddd;

        .voice,
        .more {
            flex-shrink: 0;
            width: 90upx;
            height: 100upx;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .send {
            //H5发送按钮左边距
            /* #ifdef H5 */
            margin-left: 20upx;
            /* #endif */
            flex-shrink: 0;
            width: 100upx;
            height: 100upx;
            display: flex;
            align-items: center;

            .btn {
                width: 90upx;
                height: 56upx;
                display: flex;
                justify-content: center;
                align-items: center;
                background: linear-gradient(to right, #4998ee, #087af0);
                color: #fff;
                border-radius: 6upx;
                font-size: 24upx;
            }
        }

        .textbox {
            width: 100%;
            min-height: 70upx;
            margin-top: 15upx;

            .voice-mode {
                width: calc(100% - 2upx);
                height: 68upx;
                border-radius: 70upx;
                border: solid 1upx #cdcdcd;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 28upx;
                background-color: #fff;
                color: #555;

                &.recording {
                    background-color: #e5e5e5;
                }
            }

            .text-mode {
                width: 100%;
                min-height: 70upx;
                display: flex;
                background-color: #fff;
                border-radius: 40upx;

                .box {
                    width: 100%;
                    padding-left: 30upx;
                    min-height: 70upx;
                    display: flex;
                    align-items: center;

                    textarea {
                        width: 100%;
                    }
                }

                .em {
                    flex-shrink: 0;
                    width: 80upx;
                    padding-left: 10upx;
                    height: 70upx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }

    .record {
        width: 40vw;
        height: 40vw;
        position: fixed;
        top: 55%;
        left: 30%;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 20upx;

        .ing {
            width: 100%;
            height: 30vw;
            display: flex;
            justify-content: center;
            align-items: center;

            // 模拟录音音效动画
            @keyframes volatility {
                0% {
                    background-position: 0% 130%;
                }

                20% {
                    background-position: 0% 150%;
                }

                30% {
                    background-position: 0% 155%;
                }

                40% {
                    background-position: 0% 150%;
                }

                50% {
                    background-position: 0% 145%;
                }

                70% {
                    background-position: 0% 150%;
                }

                80% {
                    background-position: 0% 155%;
                }

                90% {
                    background-position: 0% 140%;
                }

                100% {
                    background-position: 0% 135%;
                }
            }

            .icon {
                background-image: linear-gradient(to bottom, #087af0, #fff 50%);
                background-size: 100% 200%;
                animation: volatility 1.5s ease-in-out -1.5s infinite alternate;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: 150upx;
                color: #087af0;
            }
        }

        .cancel {
            width: 100%;
            height: 30vw;
            display: flex;
            justify-content: center;
            align-items: center;

            .icon {
                color: #fff;
                font-size: 150upx;
            }
        }

        .tis {
            width: 100%;
            height: 10vw;
            display: flex;
            justify-content: center;
            font-size: 28upx;
            color: #fff;

            &.change {
                color: #087af0;
            }
        }
    }

    .content {
        width: 100%;

        .msg-list {
            width: 96%;
            padding: 0 2%;
            position: absolute;
            top: 0;
            bottom: 150upx;

            .loading {
                //loading动画
                display: flex;
                justify-content: center;

                @keyframes stretchdelay {

                    0%,
                    40%,
                    100% {
                        transform: scaleY(0.6);
                    }

                    20% {
                        transform: scaleY(1);
                    }
                }

                .spinner {
                    margin: 20upx 0;
                    width: 60upx;
                    height: 100upx;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    view {
                        background-color: #087af0;
                        height: 50upx;
                        width: 6upx;
                        border-radius: 6upx;
                        animation: stretchdelay 1.2s infinite ease-in-out;
                    }

                    .rect2 {
                        animation-delay: -1.1s;
                    }

                    .rect3 {
                        animation-delay: -1s;
                    }

                    .rect4 {
                        animation-delay: -0.9s;
                    }

                    .rect5 {
                        animation-delay: -0.8s;
                    }
                }
            }

            .row {
                .system {
                    display: flex;
                    justify-content: center;

                    view {
                        padding: 0 30upx;
                        height: 50upx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #c9c9c9;
                        color: #fff;
                        font-size: 24upx;
                        border-radius: 40upx;
                    }

                    .red-envelope {
                        image {
                            margin-right: 5upx;
                            width: 30upx;
                            height: 30upx;
                        }
                    }
                }

                &:first-child {
                    margin-top: 20upx;
                }

                padding: 20upx 0;

                .my .left,
                .other .right {
                    width: 100%;
                    display: flex;

                    .bubble {
                        max-width: 70%;
                        min-height: 50upx;
                        border-radius: 10upx;
                        padding: 15upx 20upx;
                        display: flex;
                        align-items: center;
                        font-size: 32upx;
                        word-break: break-word;

                        &.img {
                            background-color: transparent;
                            padding: 0;
                            overflow: hidden;

                            image {
                                max-width: 350upx;
                                max-height: 350upx;
                            }
                        }

                        &.red-envelope {
                            background-color: transparent;
                            padding: 0;
                            overflow: hidden;
                            position: relative;
                            justify-content: center;
                            align-items: flex-start;

                            image {
                                width: 250upx;
                                height: 313upx;
                            }

                            .tis {
                                position: absolute;
                                top: 6%;
                                font-size: 26upx;
                                color: #9c1712;
                            }

                            .blessing {
                                position: absolute;
                                bottom: 14%;
                                color: #e9b874;
                                width: 80%;
                                text-align: center;
                                overflow: hidden;
                                // 最多两行
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 2;
                            }
                        }

                        &.voice {
                            .icon {
                                font-size: 40upx;
                                display: flex;
                                align-items: center;
                            }

                            .icon:after {
                                content: ' ';
                                width: 53upx;
                                height: 53upx;
                                border-radius: 100%;
                                position: absolute;
                                box-sizing: border-box;
                            }

                            .length {
                                font-size: 28upx;
                            }
                        }
                    }
                }

                .my .right,
                .other .left {
                    flex-shrink: 0;
                    width: 80upx;
                    height: 80upx;

                    image {
                        width: 80upx;
                        height: 80upx;
                        border-radius: 10upx;
                    }
                }

                .my {
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;

                    .left {
                        min-height: 80upx;

                        align-items: center;
                        justify-content: flex-end;

                        .bubble {
                            background-color: #087af0;
                            color: #fff;

                            &.voice {
                                .icon {
                                    color: #fff;
                                }

                                .length {
                                    margin-right: 20upx;
                                }
                            }

                            &.play {
                                @keyframes my-play {
                                    0% {
                                        transform: translateX(80%);
                                    }

                                    100% {
                                        transform: translateX(0%);
                                    }
                                }

                                .icon:after {
                                    border-left: solid 10upx #087af0;
                                    animation: my-play 1s linear infinite;
                                }
                            }
                        }
                    }

                    .right {
                        margin-left: 15upx;
                    }
                }

                .other {
                    width: 100%;
                    display: flex;

                    .left {
                        margin-right: 15upx;
                    }

                    .right {
                        flex-wrap: wrap;

                        .username {
                            width: 100%;
                            height: 45upx;
                            font-size: 24upx;
                            color: #999;
                            display: flex;

                            .name {
                                margin-right: 50upx;
                            }
                        }

                        .bubble {
                            background-color: #fff;
                            color: #333;

                            &.voice {
                                .icon {
                                    color: #333;
                                }

                                .length {
                                    margin-left: 20upx;
                                }
                            }

                            &.play {
                                @keyframes other-play {
                                    0% {
                                        transform: translateX(-80%);
                                    }

                                    100% {
                                        transform: translateX(0%);
                                    }
                                }

                                .icon:after {
                                    border-right: solid 10upx rgba(255, 255, 255, 0.8);

                                    animation: other-play 1s linear infinite;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .windows {
        .mask {
            position: fixed;
            top: 100%;
            width: 100%;
            height: 100%;
            z-index: 1000;
            background-color: rgba(0, 0, 0, 0.6);
            opacity: 0;
            transition: opacity 0.2s ease-out;
        }

        .layer {
            position: fixed;
            width: 80%;
            height: 70%;
            left: 10%;
            z-index: 1001;
            border-radius: 20upx;
            overflow: hidden;
            top: 100%;
            transform: scale3d(0.5, 0.5, 1);
            transition: all 0.2s ease-out;
        }

        &.show {
            display: block;

            .mask {
                top: 0;
                opacity: 1;
            }

            .layer {
                transform: translate3d(0, -85vh, 0) scale3d(1, 1, 1);
            }
        }

        &.hide {
            display: block;

            .mask {
                top: 0;
                opacity: 0;
            }

            .layer {
                //transform: translate3d(0,-85vh,0) scale3d(.5,.5,1);
            }
        }
    }

    .open-redenvelope {
        width: 100%;
        height: 70vh;
        background-color: #cf3c35;
        position: relative;

        .top {
            width: 100%;
            background-color: #fe5454;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            border-radius: 0 0 100% 100%;
            box-shadow: inset 0 -20upx 0 #9c1712;

            .close-btn {
                width: 100%;
                height: 80upx;
                display: flex;
                justify-content: flex-end;
                margin-bottom: 30upx;

                .icon {
                    color: #9c1712;
                    margin-top: 10upx;
                    margin-right: 10upx;
                }
            }

            image {
                width: 130upx;
                height: 130upx;
                border: solid 12upx #cf3c35;
                border-radius: 100%;

                margin-bottom: -65upx;
            }

            margin-bottom: 65upx;
        }

        .from,
        .blessing,
        .money,
        .showDetails {
            width: 90%;
            padding: 5upx 5%;
            display: flex;
            justify-content: center;
            font-size: 32upx;
            color: #fff;
        }

        .money {
            font-size: 100upx;
            color: #f8d757;
            display: flex;
            padding-top: 20upx;
        }

        .showDetails {
            position: absolute;
            bottom: 20upx;
            align-items: center;
            font-size: 28upx;
            color: #f8d757;

            .icon {
                font-size: 26upx;
                color: #f8d757;
            }
        }
    }
</style>
