import {baseUrl} from "@/util/util"
export default class websocket {
  constructor({ heartCheck, isReconnection }) {
    // 是否连接
    this._isLogin = false;
    // 当前网络状态
    this._netWork = true;
    // 是否人为退出
    this._isClosed = false;
    // 心跳检测频率
    this._timeout = 10000;
    this._timeoutObj = null;
    // 当前重连次数
    this._connectNum = 0;
    // 心跳检测和断线重连开关，true为启用，false为关闭
    this._heartCheck = heartCheck;
    this._isReconnection = isReconnection;
    this._onSocketOpened();
  }
  // 心跳重置
  _reset() {
    clearTimeout(this._timeoutObj);
    return this;
  }
  // 心跳开始
  _start() {
    let _this = this;
    this._timeoutObj = setInterval(() => {
      uni.sendSocketMessage({
        // 心跳发送的信息应由前后端商量后决定
        data: JSON.stringify({
          base64: "",
          fromAvar: "https://thirdwx.qlogo.cn/mmopen/vi_32/AcJM5WNhE043BL98ZubHF28ibQgdElDHBpJoic2Rvt4K3icHpRevvFiaAcKlBG3dOhXFQicO49HS8DQcBm0PNvjlqiag/132",
          fromName: "是黄优秀呀.",
          fromOpenId: "oceGf4jM3BIK6OS5mRpRtS_i81Rg",
          length: "0",
          message: "<div style=line-height: 25px;>哈喽</div>",
          sendTime: "2022-3-2 9:54",
          standbyMessage: "哈喽",
          toAvar: "https://thirdwx.qlogo.cn/mmopen/vi_32/IgQVNoW5cFS78ibWp3ftZppRgwnpHX2tOWbIC0DaWTgk29Qo2lpncib6I8JklF4RCcxBxoiboPpIPYiaf3szib9PJ5A/132",
          toName: "宋松",
          toOpenId: "oceGf4jg6N63HMX8Rptr-TCRK_j4",
          type: "heart"
        }),
        success(res) {
            
        },
        fail(err) {
          console.log(err)
          _this._reset().initWebSocket()
        }
      });
    }, this._timeout);
  }
  // 监听websocket连接关闭
  onSocketClosed(options) {
    uni.onSocketClose(err => {
      console.log('当前websocket连接已关闭,错误信息为:' + JSON.stringify(err));
      // 停止心跳连接
      if (this._heartCheck) {
        this._reset();
      }
      // 关闭已登录开关
      this._isLogin = false;
      // 检测是否是用户自己退出小程序
      if (!this._isClosed) {
        // 进行重连
        if (this._isReconnection) {
          this._reConnect(options)
        }
      }
      
    })
  }
  // 检测网络变化
  onNetworkChange(options) {
    uni.onNetworkStatusChange(res => {
      console.log('当前网络状态:' + res.isConnected);
      if (!this._netWork) {
        this._isLogin = false;
        // 进行重连
        if (this._isReconnection) {
          this._reConnect(options)
        }
      }
    })
  }
  _onSocketOpened() {
    uni.onSocketOpen(res => {
      console.log('websocket已打开');
      // 打开已登录开关
      this._isLogin = true;
      // 发送心跳
      if (this._heartCheck) {
        this._reset()._start();
      }	  
      // 打开网络开关
      this._netWork = true;
    })
  }
  // 接收服务器返回的消息
  onReceivedMsg(callBack) {
    uni.onSocketMessage(msg => {
        callBack(msg)
    })
  }
  // 建立websocket连接
  initWebSocket(options={}) {
     if(!options.url){
         let token = uni.getStorageSync("token") || ''
         options.url = baseUrl.indexOf('songhan.top')>=0?"wss://"+baseUrl+"chat/"+token: "ws://"+baseUrl+"chat/"+token
     } 
    let _this = this;
    if (this._isLogin) {
      console.log("您已经登录了");
    } else {
      // 检查网络
      uni.getNetworkType({
        success(result) {
          if (result.networkType != 'none') {
            // 开始建立连接
            uni.connectSocket({
              url: options.url,
              success(res) {
                if (typeof options.success == "function") {
                  options.success(res)
                } else {
                  console.log('参数的类型必须为函数')
                }
              },
              fail(err) {
                if (typeof options.fail == "function") {
                  options.fail(err)
                } else {
                  console.log('参数的类型必须为函数')
                }
              }
            })
          } else {
            console.log('网络已断开');
            _this._netWork = false;
            // 网络断开后显示model
            uni.showModal({
              title: '网络错误',
              content: '请重新打开网络',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        }
      })
    }
  }
  // 发送websocket消息
  sendWebSocketMsg(options) {
    uni.sendSocketMessage({
      data: options.data,
      success(res) {
        if (typeof options.success == "function") {
          options.success(res)
        } else {
          console.log('参数的类型必须为函数')
        }
      },
      fail(err) {
        if (typeof options.fail == "function") {
          options.fail(err)
        } else {
          console.log('参数的类型必须为函数')
        }
      }
    })
  }
  // 重连方法，会根据时间频率越来越慢
  _reConnect(options) {
      console.log("执行重连")
    let timer, _this = this;
    if (this._connectNum < 20) {
      timer = setTimeout(() => {
        this.initWebSocket(options)
      }, 3000)
      this._connectNum += 1;
    } else if (this._connectNum < 50) {
      timer = setTimeout(() => {
        this.initWebSocket(options)
      }, 10000)
      this._connectNum += 1;
    } else {
      timer = setTimeout(() => {
        this.initWebSocket(options)
      }, 450000)
      this._connectNum += 1;
    }
  }
  // 关闭websocket连接
  closeWebSocket(){
    uni.closeSocket();
    this._isClosed = true;
  }
}
