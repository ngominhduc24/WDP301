import Image from "../models/Upload.model"

const uploadService = {
    upload: async (req) => {
        try {
            const image = new Image({
                imageName: req.file.mimetype,
                ImageData: req.file.buffer
            })
            await image.save()
            return image;
        } catch (error) {
            throw error
        }
    }
}