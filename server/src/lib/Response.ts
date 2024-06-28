import { Response } from "express";

export default class JsonResponse {
    constructor(private res: Response){}
    
    public success(data: any = {}, message: string = "success"){
        this.res.status(200).json({
            error: false,
            status: 200,
            data,
            message
        })
    }
    public serverError(message: string = "Internal Server Error", data: any = null){
        this.res.status(200).json({
            error: true,
            status: 500,
            data,
            message
        })
    }
    public notFound(message: string){
        this.res.status(200).json({
            error: true,
            status: 404,
            data: null,
            message
        })
    }
    public notAuthorized(message: string = "Not authorized"){
        this.res.status(200).json({
            error: true,
            status: 401,
            data: null,
            message
        })
    }
    public clientError(message: string, data: any = null){
        this.res.status(200).json({
            error: true,
            status: 400,
            data,
            message
        })
    }
}