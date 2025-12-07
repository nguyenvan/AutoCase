// src/models/ComponentNode.ts
import { Schema } from 'mongoose';

// Interface cho Component Node
export interface IComponentNode {
    id: string; // ID duy nhất của Component
    type: string; // Loại component (input, button, grid...)
    props: Record<string, any>; // Thuộc tính linh hoạt (xpath, name, isDisable...)
    children?: IComponentNode[]; // Tự tham chiếu đệ quy
}

// Schema cho Component Node
export const ComponentNodeSchema: Schema<IComponentNode> = new Schema({
    id: { type: String, required: true },
    type: { type: String, required: true, index: true },
    props: { type: Object, default: {} },
    // children sẽ được thêm sau
}, { _id: false, timestamps: false });

// Tự tham chiếu đệ quy
ComponentNodeSchema.add({
    children: [ComponentNodeSchema]
});