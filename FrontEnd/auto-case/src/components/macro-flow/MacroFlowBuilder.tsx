// src/components/macro-flow/MacroFlowBuilder.tsx

import React, { useState } from 'react';
import MacroStepItem from './MacroStepItem';
import { Zap, ListChecks } from 'lucide-react';
import type { IMicroTestCaseSummary, MacroFlowStep } from '@/types/macro-types';

interface MacroFlowBuilderProps {
    steps: MacroFlowStep[];
    onRemoveStep: (stepId: string) => void;
    onAddStep: (microCase: IMicroTestCaseSummary) => void;
    // onReorder: (dragId: string, hoverId: string) => void;
}

const MacroFlowBuilder: React.FC<MacroFlowBuilderProps> = ({ steps, onRemoveStep,onAddStep }) => {

    const [isDraggingOver, setIsDraggingOver] = useState(false);

    // --- Logic Kéo Thả (Drop) ---

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isDraggingOver) {
            setIsDraggingOver(true);
        }
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);

        // ⭐ LẤY DỮ LIỆU TỪ SỰ KIỆN KÉO THẢ
        const microCaseDataString = e.dataTransfer.getData('application/json');
        
        if (microCaseDataString) {
            try {
                // Parse dữ liệu JSON đã được lưu trong handleDragStart
                const microCase = JSON.parse(microCaseDataString) as IMicroTestCaseSummary;
                
                // ⭐ GỌI HÀM CALLBACK TỪ COMPONENT CHA
                // (Chuyển đổi type để phù hợp với hàm onAddStep)
                onAddStep(microCase); 
                
                console.log('Successfully dropped and added step:', microCase.testCaseName);

            } catch (error) {
                console.error('Error parsing microCase data on drop:', error);
            }
        } else {
             console.warn('No microCase data found in drop event.');
        }
    };

    // --- Render ---

    return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                <ListChecks size={20} className="mr-2 text-indigo-600" /> Trình tự Macro Flow
            </h2>

            <div
                className={`min-h-[200px] p-4 rounded transition border-2 border-dashed ${isDraggingOver
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-300 bg-gray-50'
                    } flex flex-col justify-center items-center space-y-3`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop} // Vẫn giữ onDrop để kích hoạt hành động Drop
            >
                {steps.length === 0 ? (
                    <>
                        <Zap size={36} className="text-gray-400 mb-2" />
                        <p className="text-gray-500 font-medium">
                            Kéo và thả các Micro Case từ Toolbox vào đây.
                        </p>
                    </>
                ) : (
                    <div className="w-full space-y-3">
                        {steps.map((step) => (
                            <MacroStepItem
                                key={step.stepId}
                                step={step}
                                onRemove={onRemoveStep} // Dùng props onRemoveStep
                            />
                        ))}
                    </div>
                )}
            </div>
            {steps.length > 0 && (
                <p className="text-sm text-gray-600 mt-4 font-medium">
                    Tổng cộng: {steps.length} bước đã được thêm.
                </p>
            )}
        </div>
    );
};

export default MacroFlowBuilder;