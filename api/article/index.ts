import Request from "@/util/request"
let request:Request = new Request("article");
export const findAll = (data,isLoading:boolean)=>request.post("/findAll",data,true,isLoading)
export const saveArticle =(data:any)=>request.post("/save",data) 
export const likeArticle = (data:any)=>request.post("/like",data)
export const loveArticle = (data:any)=>request.post("/love",data)
export const findMineRelease = (data:object)=>request.post("/findMineRelease",data)
export const findMineLike = (data:object)=>request.post("/findMineLike",data)
export const findMineLove = (data:object)=>request.post("/findMineLove",data)
export const getFocusOnArticleList = (data:object,isLoading:boolean)=>request.post("/getFocusOnArticleList",data,true,isLoading)