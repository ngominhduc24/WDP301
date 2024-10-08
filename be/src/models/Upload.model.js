import mongoose from 'mongoose';

const Upload = new mongoose.Schema({
    imageName: {
        type: String,
    },
    imageData: {
        type: String,
    }
});

const Image = mongoose.model('Upload', Upload);

export default Image