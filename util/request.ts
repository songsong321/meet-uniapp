import store from "@/store/"
import {baseUrl} from "@/util/util"
export default class Request {
	constructor(url) {
		this.baseUrl = this.baseUrl + url;
	}
	// 前缀域名
	private baseUrl: string=baseUrl.indexOf("songhan.top")>=0 ?'https://'+baseUrl:'http://'+baseUrl;
	// private baseUrl: string = 'https://songhan.top/my_applets/';
    
	// get请求
	public get(url: string, params: any, isToken: boolean = true): Promise {
		uni.showLoading({
			title: '加载中'
		});
		let headers: object = isToken ? { token: uni.getStoreageSync('token') || '' } : {};
		return new Promise((resolve, reject) => {
			if (isToken && !uni.getStorageSync('token')) {
				uni.showLoading({
					title: '请先登录',
					icon: 'none'
				});

				uni.hideLoading();
				reject('请登录');
			}
			uni.request({
				url: this.baseUrl + url,
				data: params,
				method: 'GET',
				headers,
				success: (res: any) => {
					uni.hideLoading();
					resolve(res.data);
				},
				fail: (error: any) => {
					uni.hideLoading();
					reject(error);
				}
			});
		});
	}
	// post请求
	public post(url: string, params: any = {}, isToken: boolean = true,isLoading:boolean = true): Promise {
		let token = uni.getStorageSync('token') || store.state.user.token ;
		if (isToken && !token) {
			uni.showToast({
				title: '请先登录',
				icon: 'none',
			});
			setTimeout(()=>{
				uni.switchTab({
					url: '/pages/mine/index'
				});
			},3000)
			return;
		}
        if(isLoading){
            uni.showLoading({
			title: '加载中'
		});
        }
		let header: object = isToken ? { 'Content-Type': 'application/x-www-form-urlencoded', token } : { 'Content-Type': 'application/x-www-form-urlencoded' };
		return new Promise((resolve, reject) => {
			if (isToken && !uni.getStorageSync('token')) {
				uni.showLoading({
					title: '请先登录',
					icon: 'none',
                    duration:2000
				});
				uni.hideLoading();
				reject({ code: 400, message: '请登录', data: null });
			}
			uni.request({
				url: this.baseUrl + url,
				data: params,
				method: 'POST',
				header,
				success: (res: any) => {
					uni.hideLoading();
                    if(res.data.code===200){
                        resolve(res.data);
                    }else{
                        uni.showToast({
                        	title: res.data.message,
                        	icon: 'none',
                            duration:2000,
                        });
                        reject(res.data.message)
                    }
					
				},
				fail: (error: any) => {
                    
                    uni.$u.toast("网络超时啦",2000)
					uni.hideLoading();
					reject(error);
				}
			});
		});
	}
}
