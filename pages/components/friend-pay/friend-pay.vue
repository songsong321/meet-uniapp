<template>
	<view class="flex-column">
		<view class="sex-block flex-column">
			<view class="btn flex-row-center" @click="toPay">
				获取一张纸条 1金币
			</view>
			<view class="remark flex-row-center">
				仅需1金币，即可邂逅美好的TA
			</view>
			
			<view class="back-btn flex-row">
				<view @click="backFn">返回上一步</view>
				<view class="right" @click="putMsg">放入一张纸条</view>
			</view>
		</view>
        <u-toast ref="uToast" />
	</view>
</template>

<script>
	import {findPaper} from '@/api/user/index'
	export default {
		props: {
			sex: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				sexIndex: 1,
			}
		},
		mounted() {
			var me = this;
			me.sexIndex = me.sex
		},
		methods: {
			async findPaper(){
				let res = await findPaper({sex:this.sex})
                if(typeof res.data=='string'){
                    this.$refs.uToast.show({
                        title: res.data,
                        type: 'success',
                    
                    })
                }else{
                    this.$emit("paysuccess", {
                    	navIndex: 2,
                    	sexIndex: this.sexIndex,
                        content:res.data.content
                    })
                }
			},
			toPay() {
				this.findPaper()
			},
			getRandMember() {
				var me = this;
				me.$emit("paysuccess", {
					navIndex: 2,
					sexIndex: me.sexIndex,
				})
			},
			getWeChatCode() {
				
			},
			putMsg(){
				var me = this;
				me.$emit("putmsg", {
					navIndex: 3,
					sexIndex: me.sexIndex
				})
			},
			backFn() {
				this.$emit("changenav", 0)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sex-block {
        position: absolute;
		top: 360rpx;
		left: 0;
		right: 0;
		margin: auto;
		width: 90%;
		background-color: #fff;
		border-radius: 30rpx;
		justify-content: space-around;
		padding: 100rpx 30rpx;
		padding-top: 140rpx;
        text-align: center;
		.remark-li {
			color: #a1a1a1;
			font-size: 24rpx;
			margin-bottom: 10rpx;
			margin-top: 30rpx;
		}

		.li {
			width: 90%;
            margin: 0 auto;
			background-color: #f2edfc;
			border-radius: 200rpx;
			padding: 30rpx;
			margin-top: 30rpx;
            text-align: left;
			image {
				width: 24rpx;
                height: 24rpx;
			}

			.text1 {
				width: 90%;
				margin-left: 20rpx;
				color: #a1a1a1;
			}

			.text2 {
				width: 90%;
				margin-left: 20rpx;
			}
		}

		.btn {
			width: 90%;
            margin: 0 auto;
			margin-top: 80rpx;
			background-color: #FFD800;
			padding: 30rpx;
			border-radius: 200rpx;
			font-weight: bold;
            
		}

		.remark {
			color: #a1a1a1;
			font-size: 24rpx;
			margin-top: 20rpx;
		}

		.back-btn {
			width: 100%;
			color: #a1a1a1;
			font-size: 24rpx;
			margin-top: 50rpx;
			text-decoration: underline;
            display: flex;
			justify-content: space-between;
			.right{
				color: #FF0000;
			}
		}
	}
    .flex-row-center{
        text-align: center;
    }
</style>
