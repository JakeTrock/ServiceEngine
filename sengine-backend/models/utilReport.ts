import mongoose, { Schema } from 'mongoose';
import { utilReport } from '../types/types';

const utilReportSchema = new Schema({
   reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Report author ID is required']
    },
    reason: { 
        type: 'string',
        required: [true, 'Reason is required']
    },
    util: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'util',
        required: [true, 'Report util ID is required']
    }
},
{
    timestamps: true,
});

export default mongoose.model<utilReport>('utilReport', utilReportSchema);
