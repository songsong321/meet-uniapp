<template>
		<view class="scene" :style="{color:colortext,fontSize:fontSize}" @touchstart.stop.prevent="touchstartscene" @touchend.stop.prevent="touchendscene" @touchmove.stop.prevent="touchmovescene">
			<view class="box" :style="oDiv">
				<view class="ring">
					<view class="ringtext" @touchend="gettext(item)" :style="{transform:item.style}" v-for="(item,index) in liviews" :key="index">{{item.text}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			automaticRotate: {
				type: Number,
				default:4 //自动滚动速度，越高滚动越慢,0不滚动，设置负数，则反方向滚动
			},
			manualRotate:{
				type: Number,
				default:10 //手动滑动滚动速度，越高滑动越慢,0不滚动，设置负数，则反方向滚动
			},
			text:{
				type: String,
				default:"鍖楀浗椋庡厜鍖楀浗椋庡厜鍖楀浗椋庡厜鍖楀浗椋庡厜鍖楀浗椋庡厜鍖楀浗椋庡厜鍖楀浗椋庡厜" //默认文字，长度不低于42
			},
			radius:{
				type: Number,
				default:250 //球的半径大小
			},
			colortext:{
				type: String,
				default:'#003333' //字体颜色
			},
			fontSize:{
				type: String,
				default:'20rpx' //字体大小
			},
            listData:{
                type:Array,
                default:[]
            }
		},
		data() {
			return {
				liview:[],
				liviews:[],
            
				oDiv:{},
				iTimer:"",
				clickX:"",
				clickY:"",
				disX:0,
				disY:0,
				angleX:0,
				angleY:0
			}
		},
		methods: {
            editData(){
              this.liview.forEach((item,index)=>{
                  item.text =this.listData[index]? this.listData[index].nickName || '':""
                  item.openid =this.listData[index]? this.listData[index].openid || '':null
              })
            },
			setCss3(obj,attrObj,that) {
			   for (var i in attrObj) {
			 	  obj.style= attrObj[i]
				  that.liviews.push(obj)
			   }
			},
			gettext(item){
                if(item.openid){
                    uni.navigateTo({
                        url:"/mine/pages/info?openId="+item.openid
                    })
                }
			},
			touchstartscene(ev){
				clearInterval(this.iTimer);
				var e = ev || event;
				 this.clickX = e.touches[0].clientX;
				this.clickY = e.touches[0].clientY;
				this.disY = 0
				this.disX = 0
			},
			touchendscene(){
				this.angleX = this.angleX-this.disY;
				this.angleY = this.angleY+this.disX;
				if(this.disY==0 && this.disX==0){
					this.disX = -50;
				}
				this.iTimer = setInterval(()=>{
					this.angleX -= this.disY/100;
					this.angleY += this.disX/100;
					this.oDiv = "transform: rotateX("+ this.angleX +"deg) rotateY("+ this.angleY +"deg)" 
				},60);
			},
			touchmovescene(ev){
				var e = ev || event;
				this.disX = (e.touches[0].clientX - this.clickX)/this.manualRotate
				this.disY = (e.touches[0].clientY - this.clickY)/this.manualRotate
				this.oDiv = "transform: rotateX("+ (this.angleX-this.disY) +"deg) rotateY("+ (this.angleY+this.disX) +"deg)"
			},
		},
        watch:{
            listData:{
                handler(val){
                    this.editData()
                }
            }
        },
		created() {
           
		     var r = this.radius
		     var circleArr = [];
		     var coneArr = [];
		     var coneNum = 0;
		     var wordNum = -1;
		     var liNub = 0;
		     var theta = 0;
		     var phi = 0;
		     var layer = 0;
		     var num = 0;
		     var iTimer2 = 0;
		     var columnH = 0;
		     var columnNum = 0;
		 	  
		         for(var i=4; i<13; i++){
		             num = i*i + (i+1)*(i+1);
		             if(num >= this.text.length){
		                 layer = (i-1)*2+1;
		                 break;
		 
		             }
		             layer = (i-1)*2+1;
		 
		         }
		 
		         for(var i=0; i<layer; i++){
		 
		             if(i<(layer+1)/2){
		 
		                 wordNum+=2;
		 
		             }else{
		 
		                 wordNum-=2;
		 
		             }
		             circleArr.push(wordNum);
		 
		         }
		 
		 
		         num = 0;
		         for(var i=0; i<circleArr.length; i++){
		 
		             theta = Math.PI/circleArr.length;
		             phi = 2*Math.PI/circleArr[i];
		             for(var j=0; j<circleArr[i]; j++){
						 var li = {}
						 li.text = this.text[num]
		                 num++;
		                 drawCircle(li,theta,phi,i,j);
						this.liview.push(li)
		             }
		 
		         }
		  
		 
		         for(var i=0; i<this.liview.length; i++){
		 
		             coneNum += 2*i+1;
		             if(coneNum>this.liview.length){
		 
		                 coneNum -= 2*i+1;
		                 break;
		 
		             }
		             coneArr.push(2*i+1);
		         }
		 
		         for(var i=0; i<coneArr.length; i++){
		 
		             phi = 2*Math.PI/coneArr[i];
		             for(var j=0; j<coneArr[i]; j++){
		 
		                 drawCone(this.liview[liNub],phi,i,j);
		                 liNub++;
		 
		             }
		
		         }
		 
		         liNub = 0;
		         columnH = Math.floor(this.liview.length/(circleArr.length-2));
		         columnNum = columnH*(circleArr.length-2);
		         for(var i=0; i<circleArr.length-1; i++){
		 
		             phi = 2*Math.PI/columnH;
		             for(var j=0; j<columnH; j++){
		 
		                 drawColumn(this.liview[liNub],phi,i,j);
		                 drawColumn2(this.liview[liNub],phi,i,j);
		                 liNub++;
		 
		             }
		 
		         }
				  
		         for(var i=0; i<this.liview.length; i++){
		             this.setCss3(this.liview[i],{transform:'translate3D('+ this.liview[i].circleX +'rpx,'+ this.liview[i].circleY +'rpx,'+ this.liview[i].circleZ +'rpx) rotateY('+ this.liview[i].circlePhi +'rad) rotateX('+ (this.liview[i].circleTheta-Math.PI/2) +'rad)'},this);
		         }
		 
		    
		 
			 function drawCircle(obj,theta,phi,i,j){
		         obj.circleX = r*Math.sin(theta*i)*Math.sin(phi*j) + r;
		         obj.circleY = -r*Math.cos(theta*i) + r;
		         obj.circleZ = r*Math.sin(theta*i)*Math.cos(phi*j);
		         obj.circleTheta = theta*(circleArr.length-i);
		         obj.circlePhi = phi*j;
		         obj.bigCircleX = (r+2000)*Math.sin(theta*i)*Math.sin(phi*j) + r;
		         obj.bigCircleY = -(r+2000)*Math.cos(theta*i) + r;
		         obj.bigCircleZ = (r+2000)*Math.sin(theta*i)*Math.cos(phi*j);
		         obj.maxX = obj.bigCircleX;
		         obj.maxY = obj.bigCircleY;
		         obj.maxZ = obj.bigCircleZ;
		         obj.maxTheta = obj.circleTheta;
		         obj.maxPhi = obj.circlePhi;
		 
		     }
		     function drawColumn(obj,phi,i,j){
		 
		         obj.columnX = r/1.5*Math.sin(phi*j) + r;
		         obj.columnY = (2*r/(circleArr.length-2))*i + 50;
		         obj.columnZ = (r/1.5*Math.cos(phi*j)).toFixed(2);
		         obj.columnPhi = phi*j;
		         obj.bigColumnX = (r+2000)/1.5*Math.sin(phi*j) + r;
		         obj.bigColumnY = (2*(r+2000)/(circleArr.length-2))*i + 50-2000;
		         obj.bigColumnZ = ((r+2000)/1.5*Math.cos(phi*j)).toFixed(2);
		 
		     }
		     function drawColumn2(obj,phi,i,j){
		         obj.column2X = r/1.5*Math.sin(phi*j+i*Math.PI/180*8) + r;
		         obj.column2Y = (2*r/(circleArr.length-2))*i + 50;
		         obj.column2Z = (r/1.5*Math.cos(phi*j+i*Math.PI/180*8)).toFixed(2);
		         obj.column2Phi = phi*j+i*Math.PI/180*8;
		         obj.bigColumn2X = (r+2000)/1.5*Math.sin(phi*j+i*Math.PI/180*8) + r;
		         obj.bigColumn2Y = (2*(r+2000)/(circleArr.length-2))*i + 50-2000;
		         obj.bigColumn2Z = ((r+2000)/1.5*Math.cos(phi*j+i*Math.PI/180*8)).toFixed(2);
		 
		     }
		     function drawCone(obj,phi,i,j){
		 
		         obj.coneX = (2*r/coneArr.length)*i*Math.tan(30*Math.PI/180)*Math.sin(phi*j) + r;
		         obj.coneY = (2*r/coneArr.length)*i + 50;
		         obj.coneZ = (2*r/coneArr.length)*i*Math.tan(30*Math.PI/180)*Math.cos(phi*j);
		         obj.coneTheta = Math.PI/6;
		         obj.conePhi = phi*j;
		         obj.bigConeX = (2*(r+2000)/coneArr.length)*i*Math.tan(30*Math.PI/180)*Math.sin(phi*j) + r;
		         obj.bigConeY = (2*(r+2000)/coneArr.length)*i + 50-2000;
		         obj.bigConeZ = (2*(r+2000)/coneArr.length)*i*Math.tan(30*Math.PI/180)*Math.cos(phi*j);
		 
		     }
			var my = 0
			var mx = 0
		     this.iTimer = setInterval(()=>{
				 my -= 3
				 this.angleY = my/this.automaticRotate
		         this.angleX = mx/this.automaticRotate
				this.oDiv = "transform: rotateX("+ this.angleX +"deg) rotateY("+ this.angleY +"deg)"
		     },60);
            
		}
       
	}
</script>

<style>

.scene {
	width: 500rpx;
	height: 500rpx;
	margin: 60upx auto;
	perspective: 900px;
	-webkit-perspective: 900px;
	position: relative;
	transform-style: preserve-3d;
	-webkit-transform-style: preserve-3d;
}

.box {
	width: 100%;
	height: 100%;
	position: relative;
	transform-style: preserve-3d;
	-webkit-transform-style: preserve-3d;
	perspective-origin: center 250px;
}

.ring {
	width: 100%;
	height: 100%;
	transform-style: preserve-3d;
	-webkit-transform-style: preserve-3d;
	position: absolute;
}

.ringtext {
	line-height: 30px;
	text-align: center;
	
	position: absolute;
	margin-top: -25px;
	margin-left: -15px;
	transition: all .6s;
    padding-left: 20rpx;
}
.ringtext::before{
    content: "";
    display: block;
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    background-color: #66FF66;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
.ringtext.all {
	transition: all .6s cubic-bezier(.75,.25,1,1);
}

.ringtext.one {
	transition: transform .6s cubic-bezier(0,0,.25,.75);
}

 
</style>
