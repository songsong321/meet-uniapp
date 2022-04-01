import Request from "@/util/request"
let request:Request = new Request("message");
export const findMessageAll = (data:object = {})=>request.post("/findAll",data)
export const findMessageRecord = (data:object = {})=>request.post("/findMessageRecord",data)