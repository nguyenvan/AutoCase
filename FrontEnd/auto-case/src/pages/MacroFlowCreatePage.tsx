// src/pages/MacroFlowCreatePage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as LinkIcon, Save, X } from 'lucide-react';

// Giả định các types được import
import type { MacroFlowStep, IMicroTestCaseSummary } from '../types/macro-types';

// Import các component con (chúng ta sẽ chuyển chúng thành UI thuần)
import MacroFlowToolbox from '../components/macro-flow/MacroFlowToolbox';
import MacroFlowBuilder from '../components/macro-flow/MacroFlowBuilder';

// --- Khởi tạo State ---
const initialMacroFlowState = {
    name: '',
    description: '',
    steps: [] as MacroFlowStep[],
};

const MacroFlowCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [flowState, setFlowState] = useState(initialMacroFlowState);

    // --- Handlers Cập nhật State ---

    const setFlowName = (name: string) => {
        setFlowState(prev => ({ ...prev, name }));
    };

    const setDescription = (description: string) => {
        setFlowState(prev => ({ ...prev, description }));
    };

    // Hàm thêm bước
    const addStep = (microCase: IMicroTestCaseSummary) => {
        const generateId = () => Math.random().toString(36).substring(2, 9);

        const newStep: MacroFlowStep = {
            stepId: generateId(),
            microCaseId: microCase.id || (microCase as any)._id,
            name: (microCase as any).testCaseName || (microCase as any).name,
            inputData: {},
        };
        setFlowState(prev => ({
            ...prev,
            steps: [...prev.steps, newStep]
        }));
    };
    // ⭐ HÀM MỚI: Sắp xếp lại vị trí các bước
    const reorderStep = (dragIndex: number, hoverIndex: number) => {
        setFlowState(prev => {
            const newSteps = [...prev.steps];
            const [movedStep] = newSteps.splice(dragIndex, 1); // Cắt bước đang kéo
            newSteps.splice(hoverIndex, 0, movedStep); // Chèn vào vị trí mới

            console.log(`Reordering steps: ${dragIndex} -> ${hoverIndex}`);
            return {
                ...prev,
                steps: newSteps,
            };
        });
    };
    // Hàm xóa bước
    const removeStep = (stepId: string) => {
        setFlowState(prev => ({
            ...prev,
            steps: prev.steps.filter(step => step.stepId !== stepId)
        }));
    };

    // Hàm xử lý Lưu (Mock)
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!flowState.name.trim() || flowState.steps.length === 0) {
            alert("Vui lòng nhập tên và thêm ít nhất một bước.");
            return;
        }

        console.log("Saving Macro Flow:", flowState);
        alert(`Macro Flow "${flowState.name}" đã được lưu thành công! (Logic API bị bỏ qua)`);

        setFlowState(initialMacroFlowState);
        navigate('/macro-cases');
    };

    return (
        // Container chính: Chiều cao bằng màn hình (h-screen) và xếp chồng (flex-col)
        <div className="flex flex-col h-screen bg-gray-50">

            {/* 1. KHU VỰC HEADER (Chiều cao cố định) */}
            <form onSubmit={handleSave} className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <LinkIcon className="mr-3 text-indigo-600" size={24} /> Tạo Macro Test Case
                        </h1>

                        {/* Action Buttons */}
                        <div className="space-x-3 flex items-center">
                            <button
                                type="button"
                                onClick={() => navigate('/macro-cases')}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                            >
                                <X size={18} className="mr-1" /> Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={!flowState.name.trim() || flowState.steps.length === 0}
                                className={`flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition ${!flowState.name.trim() || flowState.steps.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                    }`}
                            >
                                <Save size={18} className="mr-1" />
                                Lưu Macro Flow
                            </button>
                        </div>
                    </div>

                    {/* Form input */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label htmlFor="flow-name" className="block text-xs font-medium text-gray-700">Tên Macro Flow <span className="text-red-500">*</span></label>
                            <input
                                id="flow-name"
                                type="text"
                                value={flowState.name}
                                onChange={(e) => setFlowName(e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded-md shadow-sm text-sm"
                                placeholder="Ví dụ: FULL_PURCHASE_FLOW"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="flow-desc" className="block text-xs font-medium text-gray-700">Mô tả</label>
                            <input
                                id="flow-desc"
                                type="text"
                                value={flowState.description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded-md shadow-sm text-sm"
                                placeholder="Mô tả luồng người dùng"
                            />
                        </div>
                    </div>
                </div>
            </form>

            {/* 2. KHU VỰC DESIGN (Toolbox và Builder) - Chiếm hết không gian còn lại (flex-1) */}
            <div className="flex-1 flex overflow-hidden">

                {/* TOOLBOX (Bên trái) - Đặt h-full cho nội dung bên trong component Toolbox để nó kéo dài. */}
                <div className="w-80 p-4 border-r border-gray-200 shrink-0 overflow-y-auto">
                    {/* Component MacroFlowToolbox cần có height: 100% bên trong nó. */}
                    <MacroFlowToolbox />
                </div>

                {/* BUILDER (Bên phải) - Chiếm hết chiều rộng còn lại */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto h-full">
                        {/* Component MacroFlowBuilder cần có height: 100% bên trong nó. */}
                        <MacroFlowBuilder
                            steps={flowState.steps}
                            onRemoveStep={removeStep}
                            onAddStep={addStep}
                            onReorder={reorderStep}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MacroFlowCreatePage;