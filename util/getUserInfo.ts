let userInfo:object =uni.getStorageSync("userInfo")? JSON.parse(uni.getStorageSync("userInfo")) : {}

export default {
	releaseAvar:userInfo.avatarUrl || null,
	relaseName:userInfo.nickName || null,
	tags:userInfo.tags || null,
	token:uni.getStorageSync("token") || '',
	level:userInfo.level || null,
	sex:userInfo.gender || null
}