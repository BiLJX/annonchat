import JsonResponse from "lib/Response";
import { upload, uploadPfpToCloud } from "lib/upload.lib";
import { User } from "models/User.model";
import sharp from "sharp";
import { Controller } from "types/controller";

export const uploadPfp: Controller = async(req, res) => {
    upload(req, res, async err=>{
        const { user_id } = res.locals.user
        const jsonResponse = new JsonResponse(res);
        try {
            if(err) return jsonResponse.serverError();
            const file = (req.files as Express.Multer.File[])[0];
            if(!file) return jsonResponse.clientError("No file provided");
            if(!file.mimetype.includes("image")) return jsonResponse.clientError("Unsupported image type");
            const buffer = await sharp(file.buffer).jpeg({quality: 70}).toBuffer();
            const url = await uploadPfpToCloud(user_id, buffer);
            await User.findOneAndUpdate({user_id}, {
                $set: {
                    pfp_url: url
                }
            })
            jsonResponse.success({pfp_url: url});
        } catch (error) {
            return jsonResponse.serverError();
        }
    })
}