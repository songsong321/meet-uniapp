<template>
    <view>
        <u-cell-group>
            <u-cell-item title="头像" @click='changeHead'>
                <u-image width='100rpx' height='100rpx' slot="right-icon" :src="form.avatarUrl" shape="circle">
                </u-image>
            </u-cell-item>
            <u-cell-item title="昵称">
                <u-field :border-bottom="false" class="my_field" v-model="form.nickName" slot='right-icon'></u-field>
            </u-cell-item>
            <u-cell-item title="性别" :value="form.gender==1?'男生':form.gender==2?'女生':'保密'" @click='selectSex'>
            </u-cell-item>
            <u-cell-item title="个人描述">
                <u-field :border-bottom="false" v-model="form.info" label=" " placeholder="请输入描述" type="textarea">
                </u-field>
            </u-cell-item>
        </u-cell-group>
        <view style="width: 500upx;margin: 40upx auto;">
            <u-button type="primary" @click="submit">保存</u-button>
        </view>

    </view>
</template>
<script>
    import {
        getInfo,
        editUser
    } from "@/api/user/index"
    import {
        baseUrl
    } from "@/util/util"
    export default {
        data() {
            return {
                form: {

                },
                headImg: '',

            };
        },
        methods: {
            submit() {
                if (this.headImg) {
                    uni.uploadFile({
                        url: baseUrl.indexOf('songhan.top') >= 0 ? 'https://' + baseUrl + 'upload' : 'http://' +
                            baseUrl + 'upload',
                        filePath: this.headImg,
                        fileType: "image",
                        name: "file",
                        success:res=> {
                            this.form.avatarUrl = res.data
                            this.editUser()
                        },
                        fail(err) {
                            uni.showToast({
                                title: "上传失败",
                                icon: "none",
                                duration: 2000
                            })
                        }
                    })
                } else {
                    this.editUser()
                }


            },
            changeHead() {
                uni.chooseImage({
                    count: 1,
                    success: (res) => {
                        this.form.avatarUrl = res.tempFilePaths[0];
                        this.headImg = res.tempFilePaths[0]
                    }
                });
            },
            selectSex() {
                const arr = ['保密', '男生', '女生', ]
                uni.showActionSheet({
                    itemList: arr,
                    success: (res) => {
                        this.form.gender = res.tapIndex
                    },
                    fail: function(res) {
                        console.log(res.errMsg);
                    }
                });
            },
            change(e) {
                this.birthday = e.result
            },
            async editUser() {
                let res = await editUser(this.form);
                if(res.code==200){
                    uni.showToast({
                        title:"修改成功"
                    })
                }
            },
            /**
             * 获取用户详情
             */
            async getInfo() {
                let token = uni.getStorageSync("token")
                let res = await getInfo(token)
                if (res.code === 200) {
                    this.form = res.data || {}
                }
            }
        },
        created() {
            this.getInfo()
        },
    };
</script>

<style scoped lang="scss">
    .editUser {
        width: 85%;
        margin: 10rpx auto;
    }

    ::v-deep .my_field .u-flex-1 {
        text-align: right !important;
    }
</style>
