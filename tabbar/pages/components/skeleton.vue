<template>
    <view>
        <view class="u-skeleton" style="min-height: 400upx;padding: 0 30upx;">
            <view style="display: flex;align-items: center;width:100%">
                <view class="u-skeleton-circle" style="width: 100upx;height: 100upx;"></view>
                <view style="width:calc(100% - 190upx);height: 100upx;margin-left: 10upx;">
                    <view class="u-skeleton-fillet" style="width: 100upx;height: 30upx;margin-top: 20upx;"></view>
                    <view class="u-skeleton-fillet" style="width: 100upx;height: 30upx;margin-top: 5upx;"></view>
                </view>
                <view class="u-skeleton-fillet" style="width: 80upx;height:40upx;float: right;"></view>
            </view>
            <view class="u-skeleton-fillet" style="width: 100%;height: 100upx;margin-top: 20upx;"></view>
            <view style="display: flex;align-items: center;margin-top: 10upx;">
                <view class="u-skeleton-circle" style="width: 60upx;height: 60upx;"></view>
                <view class="u-skeleton-fillet" style="width: 40upx;height: 20upx;"></view>
            </view>
            <view style="display: flex;width: 100%;justify-content: space-between;margin-top: 10upx;">
                <view style="display: flex;align-items: center;">
                    <view class="u-skeleton-circle" style="width: 60upx;height: 60upx;"></view>
                    <view class="u-skeleton-fillet" style="width: 40upx; height: 30upx; margin-left: 4upx;"></view>
                </view>
                <view style="display: flex;align-items: center;">
                    <view class="u-skeleton-circle" style="width: 60upx;height: 60upx;"></view>
                    <view class="u-skeleton-fillet" style="width: 40upx; height: 30upx; margin-left: 4upx;"></view>
                </view>
                <view style="display: flex;align-items: center;">
                    <view class="u-skeleton-circle" style="width: 60upx;height: 60upx;"></view>
                    <view class="u-skeleton-fillet" style="width: 40upx; height: 30upx; margin-left: 4upx;"></view>
                </view>
            </view>
        </view>
        <u-skeleton :loading="true" :animation="true" bgColor="#FFF"></u-skeleton>
    </view>
</template>

<script>
</script>

<style>
</style>
