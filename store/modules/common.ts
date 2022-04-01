import {baseUrl} from "@/util/util"
import websocket from "@/util/websocket.js"
export default {
	state: {
		webSocket:null,
		message:[],
        websocket:new websocket({heartCheck:true,isReconnection:true}),
    },
	
	mutations: {
		SET_WEBSOCKET(state){
            let token = uni.getStorageSync("token") || ''
            let url = baseUrl.indexOf('songhan.top')>=0?"wss://"+baseUrl+"chat/"+token: "ws://"+baseUrl+"chat/"+token
            state.websocket.initWebSocket({
		  url,
		  success(res) {  },
		  fail(err) {
              console.log(err)
              uni.showToast({
                  title:err,
                  icon:"none",
                  duration:2000
              })
               }
		})
            
			// if(state.webSocket==null){
			// 	state.webSocket = uni.connectSocket({
			// 		url:"ws://"+baseUrl+"chat/"+token,
			// 	})		
			// 	uni.onSocketOpen(function (res) {
			// 	  console.log('WebSocket连接已打开！');
			// 	});
			// }
			
			
		},
		SEND_MESSAGE(state,msg){
            let token = uni.getStorageSync("token") || ''
			let length = msg.type=="voice"?msg.length:0;
            let userInfo:object =uni.getStorageSync("userInfo")? JSON.parse(uni.getStorageSync("userInfo")) : {}
            let {avatarUrl,nickName,tags,level,sex} = userInfo;
			let {type,toName,toAvar,toOpenId,message,sendTime,standbyMessage,base64,w,h} = msg
			let msgObj = {
				fromName:nickName,
				fromAvar:avatarUrl,
				fromOpenId:token,
				length,
				type,
				toName,
				toAvar,
				toOpenId,
				message,
				sendTime,
                standbyMessage,
                base64,
                w,
                h
			}
            state.websocket.sendWebSocketMsg({
            				data: JSON.stringify(msgObj),
            				success(res) {
            					console.log('发送成功',res)
            				},
            				fail(err) {
            					console.log('进入房间失败',err)
            				}
            			}) 
			// uni.sendSocketMessage({
			// 	data:JSON.stringify(msgObj)
			// })
		},
		
	},
	getters:{
		myWebsocket:state=>{
			return state.websocket;
		},
		
	},
	actions: {
		openWebsocket({commit}){
            let token = uni.getStorageSync("token") || ''
			if(token){
				commit("SET_WEBSOCKET")
			}
			
		},
		sendMessage({commit},obj){
			commit("SEND_MESSAGE",obj)
		},
		
	}
}
