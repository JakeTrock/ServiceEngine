import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const mongoURL = process.env.MONGO_URL;

export default mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
