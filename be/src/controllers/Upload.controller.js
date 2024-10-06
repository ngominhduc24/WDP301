import asyncHandler from "../utils/async-handler.js"
import response from "../utils/response.js";

const UploadController = {
    upload : asyncHandler(async (req,res,next) => {
        const upload = await uploadService.upload(req);
        if (upload) return res.status(200).json(response.successResponse(200,upload))
        else return res.status(500).json(response.errorResponse(500))
    }),
    
}

export default UploadController