<template>
	<view class="flex-column">
		<view class="sex-block flex-row">
			<view class="flex-column" @click="checkSex(1)">
				<image src="../../static/sex1.png" mode="widthFix"></image>
				<view>男孩纸</view>
				<view class="num">共{{ numMan }}张纸条</view>
			</view>
			<view class="flex-column" @click="checkSex(2)">
				<image src="../../static/sex2.png" mode="widthFix"></image>
				<view>女孩纸</view>
				<view class="num">共{{ numWoman }}张纸条</view>
			</view>
		</view>
		
	</view>
</template>

<script>
    
	export default {
		
        props:{
          numMan:{
              type:Number,
              default:0
          } ,
           numWoman:{
               type:Number,
               default:0
           }
        },
		methods: {
			checkSex(sex){
				this.$emit('sexchange', sex);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sex-block{
        
		position: absolute;
        top: 360rpx;
        left: 0;
        right: 0;
        margin: auto;
		width: 90%;
		background-color: #fff;
		border-radius: 30rpx;
		justify-content: space-around;
        padding: 200rpx 30rpx;
        display: flex;
		image{
			width: 180rpx;
		}
		.num{
			font-size: 22rpx;
			color:#a1a1a1;
		}
	}
	.my-info{
		position: absolute;
		top: 1000rpx;
		width: 90%;
		justify-content: space-around;
		text-decoration:underline;
	}
	.flex-column{
        text-align: center;
    }
</style>
