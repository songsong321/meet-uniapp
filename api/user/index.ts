import Request from "@/util/request"
let request:Request = new Request("user");
export const login = (params:any,isToken:boolean):Promise=>request.post("/login",params,isToken)
export const signIn = ():Promise=>request.post("/signIn")
export const getInfo = (openId:string):Promise=>request.post("/getInfo",{openId})
export const focusOn = (params:object):Promise=>request.post("/focusOn",params)
export const getFocusOnList = (params:object,isLoading:boolean=true):Promise=>request.post("/getFocusOnList",params,true,isLoading)
export const getFocusOnForMe = (params:object):Promise=>request.post("/getFocusOnForMe",params)
export const editUser = (params:object):Promise=>request.post("/editUser",params)
export const getLikeOrLoveMeList = (params:object):Promise=>request.post("/getLikeOrLoveMeList",params)
export const findUserByRandom = (params:object):Promise=>request.post("/findUserByRandom",params)
export const findPaperLen = (params:object):Promise=>request.post("/findPaperLen",params)
export const savePaper = (params:object):Promise=>request.post("/savePaper",params)
export const findPaper = (params:object):Promise=>request.post("/findPaper",params)
export const setUserGold = (params:object):Promise=>request.post("/setUserGold",params)
export const setUserType = (params:object):Promise=>request.post("/setUserType",params)
export const getUsers = (params:object,isLoading:boolean=false):Promise=>request.post("/getUsers",params,true,isLoading)
export const isProduction = (params:object):Promise=>request.post("/isProduction",params,false,false)

