// src/models/MicroTestCase.ts
import mongoose, { Document, Schema } from 'mongoose';
import { ComponentNodeSchema, IComponentNode } from './ComponentNode';

// Interface cho Micro Test Case Document
export interface IMicroTestCase extends Document {
    name: string;
    description?: string;
    components: IComponentNode[];
    testData: Record<string, any>; // Lưu trữ Test Data
    createdAt: Date;
    updatedAt: Date;
}

const MicroTestCaseSchema: Schema<IMicroTestCase> = new Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        unique: true // Đảm bảo tính duy nhất
    },
    description: { type: String },
    components: {
        type: [ComponentNodeSchema], 
        default: []
    },
    testData: {
        type: Object, 
        default: {}
    },
}, { 
    timestamps: true // Tự động thêm createdAt và updatedAt
});

export const MicroTestCase = mongoose.model<IMicroTestCase>('MicroTestCase', MicroTestCaseSchema);