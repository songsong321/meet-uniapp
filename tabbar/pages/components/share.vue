<template>
	<view>
        <!--<tui-bottom-popup :show="show" @close="close" :zIndex="99999">
            <view class="tui-modal-box" >
                <view :style="{width:width?width:'100%'}" style="position: absolute;top: 0;right: 0;">
                    <view><image src="/static/images/share/point_bg.png" style="width: 100%;" mode="widthFix" /></view>
                    <view><image src="/static/images/share/point_btn.png" style="width: 50%;" mode="widthFix" /></view>
                </view>
            </view>
        </tui-bottom-popup>-->
        <!--<view class="cu-modal" :class="{'show':show}" >
            <view :style="{width:width?width:'100%'}" style="position: absolute;top: 0;right: 0;">
                <view><image src="/static/images/share/point_bg.png" style="width: 100%;" mode="widthFix" /></view>
                <view><image src="/static/images/share/point_btn.png" style="width: 50%;" mode="widthFix" /></view>
            </view>
        </view>-->

        <view class="tui-alert-mask" :class="[show?'tui-alert-mask-show':'']"  >
            <view :style="{width:width?width:'100%'}" style="position: absolute;top: 0;right: 0;">
                <view>
                    <image src="../../../static/MyApplets/img/point_bg.png" style="width: 100%;" mode="widthFix" />
                </view>
                <view @click="close" style="text-align: center;">
                    <image src="../../../static/MyApplets/img/point_btn.png" style="width: 60%;" mode="widthFix" />
                </view>
            </view>
        </view>
	</view>
</template>

<script>
	export default {
		name: 'pointShare',
		props: {
			show: {
				type: Boolean,
				default: true
			},
			width: {
				type: String,
				default: '100%'
			},
		},
		methods: {
			close() {
				this.$emit("close",{})
			},
			
		}
	}
</script>

<style scoped>
    .tui-alert-mask1 {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 99996;
        transition: all 0.3s ease-in-out;
        opacity: 0;
        visibility: hidden;
    }
    .tui-alert-mask {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1110;
        opacity: 0;
        outline: 0;
        text-align: center;
        -ms-transform: scale(1.185);
        transform: scale(1.185);
        backface-visibility: hidden;
        perspective: 2000upx;
        background: rgba(0, 0, 0, 0.6);
        transition: all 0.3s ease-in-out 0s;
        pointer-events: none;
    }
    .tui-alert-mask-show {
        opacity: 1;
        transition-duration: 0.3s;
        -ms-transform: scale(1);
        transform: scale(1);
        overflow-x: hidden;
        overflow-y: auto;
        pointer-events: auto;
    }
    .tui-alert-mask-show1 {
        visibility: visible;
        opacity: 1;
    }
</style>
