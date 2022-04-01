export default {
	namespaced: true,
	state: {
		userInfo: {
			
		},
		token:"",
        message:[],
        messageList:[]
	},
	mutations: {
		SET_KEY(state,{key,value}){
			state[key] = value
		},
		
	},
	getters: {
        getMessage(state){
            return state.message;
        },
        getMessageList(state){
            return state.messageList;
        },
		getUserInfo(state){
			return state.userInfo;
		},
		getToken(state){
			return state.token;
		}
	},
	actions: {
		setKey({commit},obj){
			commit("SET_KEY",obj)
		},
		// 刷新消息icon
		resetMessage(){
            let msgList = uni.getStorageSync("message") ? JSON.parse(uni.getStorageSync("message")) : [];
            let noticeList = uni.getStorageSync("noticeArr") ? JSON.parse(uni.getStorageSync("noticeArr")) : [];
            let bigArr = [...msgList,...noticeList]
		    let unreadTotalNum = bigArr.length>0? bigArr.map(ele => ele.unreadNum).reduce((pre, cur) => pre + cur):0
		    if(unreadTotalNum>0){
		    	if (unreadTotalNum <= 99) {
		    		uni.hideTabBarRedDot({
		    			index: 2
		    		})
		    		uni.setTabBarBadge({
		    			index: 2,
		    			text: unreadTotalNum + ""
		    		})
		    	
		    	} else {
		    		uni.removeTabBarBadge({
		    			index: 2
		    		})
		    		uni.showTabBarRedDot({
		    			index: 2
		    		})
		    	}
		    }else{
		    	uni.removeTabBarBadge({
		    		index: 2
		    	})
		    	uni.hideTabBarRedDot({
		    		index: 2
		    	})
		    }
		}
	}
};
