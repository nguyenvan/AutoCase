// src/components/macro-flow/MacroFlowBuilder.tsx

import React, { useState } from 'react';
import MacroStepItem from './MacroStepItem';
import { Zap, ListChecks } from 'lucide-react';
import type { MacroFlowStep, IMicroTestCaseSummary } from '@/types/macro-types';

interface MacroFlowBuilderProps {
    steps: MacroFlowStep[];
    onRemoveStep: (stepId: string) => void;
    onAddStep: (microCase: IMicroTestCaseSummary) => void;
    onReorder: (dragIndex: number, hoverIndex: number) => void;   
}

const MacroFlowBuilder: React.FC<MacroFlowBuilderProps> = ({ steps,  onRemoveStep, onAddStep ,onReorder}) => {

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

        const microCaseDataString = e.dataTransfer.getData('application/json');
        
        if (microCaseDataString) {
            try {
                const microCase = JSON.parse(microCaseDataString) as IMicroTestCaseSummary;
                onAddStep(microCase); 
                console.log('Successfully dropped and added step:', (microCase as any).name);
            } catch (error) {
                console.error('Error parsing microCase data on drop:', error);
            }
        }
    };

    // --- Render ---

    return (
        // ⭐ CONTAINER CHÍNH: Dùng h-full để chiếm hết chiều cao của container cha (khu vực Design)
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-inner h-full flex flex-col"> 
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center flex-shrink-0">
                <ListChecks size={20} className="mr-2 text-indigo-600" /> Trình tự Macro Flow
            </h2>

            {/* ⭐ VÙNG KÉO THẢ: Sử dụng flex-1 để chiếm hết không gian còn lại (full height) */}
            <div
                className={`flex-1 p-4 rounded transition border-2 border-dashed ${isDraggingOver
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-300 bg-gray-50'
                    } flex flex-col  items-center space-y-3 overflow-y-auto`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {steps.length === 0 ? (
                    <>
                        <Zap size={36} className="text-gray-400 mb-2" />
                        <p className="text-gray-500 font-medium">
                            Kéo và thả các Micro Case từ Toolbox vào đây.
                        </p>
                    </>
                ) : (
                    <div className="w-full space-y-3 p-1"> {/* Thêm padding nhỏ bên trong */}
                        {steps.map((step, index) => ( // ⭐ QUAN TRỌNG: LẶP QUA MẢNG VÀ LẤY INDEX
                            <MacroStepItem
                                key={step.stepId}
                                step={step}
                                index={index} // ⭐ TRUYỀN INDEX
                                onRemove={onRemoveStep}
                                onReorder={onReorder} // ⭐ TRUYỀN HÀM REORDER
                            />
                        ))}
                    </div>
                )}
            </div>
            
             {/* Footer, nếu có, sẽ là flex-shrink-0 */}
             {steps.length > 0 && (
                <p className="text-sm text-gray-600 mt-4 font-medium flex-shrink-0">
                    Tổng cộng: {steps.length} bước đã được thêm.
                </p>
            )}
        </div>
    );
};

export default MacroFlowBuilder;