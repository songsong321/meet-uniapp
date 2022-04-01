<template>
    <view class="l-barrage" style="height:100%">
        <view class="online">当前在线人数{{onLineNum}}</view>
        <block v-for="(item,index) in items" :key="index">

            <!-- #ifdef H5 -->
            <text v-if="item.display" class="aon" :style="{top: `${item.top}px`,color: item.color}">
                {{item.text}}
            </text>
            <!-- #endif -->

            <!-- #ifndef H5 -->
            <text v-if="item.display" class="aon" :style="{top: `${item.top}px`,color: item.color,
				  animation: `mymove ${Number(item.time)}s linear forwards`
				  }">
                {{item.text}}
            </text>
            <!-- #endif -->

        </block>
    </view>
</template>

<script lang="ts">
    let cycle;

    // 弹幕字体颜色
    function getRandomColor(): string {
        let rgb = []
        for (let i = 0; i < 3; ++i) {
            let color = Math.floor(Math.random() * 256).toString(16)
            color = color.length == 1 ? '0' + color : color
            rgb.push(color)
        }
        return '#' + rgb.join('')
    }
    import {
        Component,
        Vue,
        Prop
    } from 'vue-property-decorator';
    @Component({
        name: "barrage"
    })
    export default class Barrage extends Vue {
        // prop
        // 弹幕时间
        @Prop({
            type: Number,
            default: 10
        }) readonly minTime ? : number;
        @Prop({
            type: Number,
            default: 18
        }) readonly maxTime ? : number;
        @Prop({
            type: Number,
            default: 60
        }) readonly minTop ? : number;
        @Prop({
            type: Number,
            default: 300
        }) readonly maxTop ? : number;
        @Prop({
            type: Number,
            default: 0
        }) readonly onLineNum ? : number;
        // data
        private items ? : Array < Object > = [];

        // methods
        // 添加一条
        private add(text: string = "", time: number = Math.ceil(Math.floor(Math.random() * (this.maxTime - this
            .minTime + 1) + this.minTime))): void {
            this.items.push({
                text,
                time,
                top: Math.ceil(Math.random() * (this.maxTop - this.minTop + 1) + this.minTop),
                color: getRandomColor(),
                display: 1,
            });
        }
        // 开始
        private start(data ? : Array < Object > = []): void {
            this.items = [];
            cycle && (clearInterval(cycle));
            let i = 0,
                len = data.length;

            cycle = setInterval(() => {
                let time = 5;
                // #ifndef H5
                time = Math.ceil(Math.floor(Math.random() * (this.maxTime - this.minTime + 1) + this
                    .minTime));
                // #endif

                if (i < len) {
                    this.add(data[i], time);
                    i++;
                } else {
                    clearInterval(cycle);
                    setTimeout(() => {
                        this.$emit("end", {});
                    }, time * 1000)
                }
            }, 500)
        }

    }
</script>

<style>
    .aon {
        position: fixed;
        white-space: nowrap;

        animation: mymove 5s linear forwards;
        animation-timing-function: linear;
        -webkit-animation-timing-function: linear;
        animation-fill-mode: forwards;
        font-family: "Cascadia";
        font-weight: bold;
        font-size: 34upx;
    }

    .l-barrage {
        z-index: 3;
        width: 100%;

    }

    @keyframes mymove {
        from {
            left: 100%;
        }

        to {
            left: -200%;
            opacity: 0
        }
    }

    @-moz-keyframes mymove

    /* Firefox */
        {
        from {
            left: 100%;
        }

        to {
            left: -200%;
            opacity: 0
        }
    }

    @-webkit-keyframes mymove

    /* Safari and Chrome */
        {
        from {
            left: 100%;
        }

        to {
            left: -200%;
            opacity: 0
        }
    }

    @-o-keyframes mymove

    /* Opera */
        {
        from {
            left: 100%;
        }

        to {
            left: -200%;
            opacity: 0
        }
    }

    .online {
        color: white;
        position: relative;
        top: 50upx;
        left: 50upx;
        padding-left: 40upx
    }

    .online::before {
        content: "";
        display: block;
        width: 20upx;
        height: 20upx;
        background-color: #00ff33;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }
</style>
