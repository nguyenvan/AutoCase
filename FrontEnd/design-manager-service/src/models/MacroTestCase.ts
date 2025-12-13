// src/models/MacroTestCase.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface cho một bước trong Flow
export interface IFlowStep {
    sequence: number;
    microTestCaseId: Types.ObjectId; // Tham chiếu ID của MicroTestCase
    repeat: number;
}

// Schema cho một bước trong Flow
const FlowStepSchema: Schema<IFlowStep> = new Schema({
    sequence: { type: Number, required: true },
    microTestCaseId: { 
        type: Schema.Types.ObjectId,
        ref: 'MicroTestCase', // Tham chiếu đến MicroTestCase
        required: true 
    },
     repeat: { type: Number, required: true },
}, { _id: false, timestamps: false });

// Interface cho Macro Test Case Document
export interface IMacroTestCase extends Document {
    name: string;
    description?: string;
    flow: IFlowStep[];
    createdAt: Date;
    updatedAt: Date;
}

const MacroTestCaseSchema: Schema<IMacroTestCase> = new Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        unique: true
    },
    description: { 
        type: String, 
        trim: true,
        maxlength: 500 // Giới hạn độ dài
    },
    flow: {
        type: [FlowStepSchema],
        default: []
    },
}, { 
    timestamps: true 
});

export const MacroTestCase = mongoose.model<IMacroTestCase>('MacroTestCase', MacroTestCaseSchema);