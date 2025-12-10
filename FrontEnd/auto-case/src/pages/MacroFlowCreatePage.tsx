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

    // Hàm thêm bước (Truyền xuống Builder)
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

    // Hàm xóa bước (Truyền xuống Builder)
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
        
        // Reset state sau khi lưu
        setFlowState(initialMacroFlowState); 
        navigate('/macro-cases');
    };

    return (
        <div className="flex h-full min-h-screen bg-gray-50">
            
            {/* Cột 1: TOOLBOX (Không cần props state flow, chỉ cần fetch data và truyền hàm addStep) */}
            <div className="w-80 p-4 border-r border-gray-200 flex-shrink-0">
                {/* Toolbox giờ phải nhận hàm addStep để thêm bước khi thả */}
                <MacroFlowToolbox /> 
            </div>

            {/* Cột 2: FLOW BUILDER (Nhận toàn bộ state flow và setters) */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">

                    <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                        <LinkIcon className="mr-3" size={28} /> Tạo Macro Test Case Mới
                    </h1>

                    <form onSubmit={handleSave}>
                        
                        {/* 1. Khu vực Thông tin Cơ bản (Header) */}
                        <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-md mb-6 space-y-4">
                            <h2 className="text-xl font-semibold text-gray-700">Thông tin Cơ bản</h2>
                            <div>
                                <label htmlFor="flow-name" className="block text-sm font-medium text-gray-700 mb-1">Tên Macro Flow <span className="text-red-500">*</span></label>
                                <input
                                    id="flow-name"
                                    type="text"
                                    value={flowState.name}
                                    onChange={(e) => setFlowName(e.target.value)}
                                    className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ví dụ: FULL_PURCHASE_FLOW"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="flow-desc" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea
                                    id="flow-desc"
                                    value={flowState.description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Mô tả luồng người dùng từ đầu đến cuối"
                                />
                            </div>
                        </div>

                        {/* 2. Khu vực Xây dựng Luồng (Steps) */}
                        <div className="mb-6">
                        <MacroFlowBuilder 
                            steps={flowState.steps}
                            onRemoveStep={removeStep}
                            onAddStep={addStep}
                        />
                    </div>

                        {/* 3. Footer và Action Buttons */}
                        <div className="flex justify-between items-center py-4 border-t border-gray-200 mt-4">
                            <div className="space-x-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/macro-cases')}
                                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                                >
                                    <X size={18} className="mr-1"/> Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={!flowState.name.trim() || flowState.steps.length === 0}
                                    className={`flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition ${
                                        !flowState.name.trim() || flowState.steps.length === 0
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                    }`}
                                >
                                    <Save size={18} className="mr-1"/> 
                                    Lưu Macro Flow
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MacroFlowCreatePage;