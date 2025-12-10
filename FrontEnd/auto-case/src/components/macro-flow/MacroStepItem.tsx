// src/components/macro-flow/MacroStepItem.tsx

import React from 'react';
import type { MacroFlowStep } from '../../types/macro-types';
import { Edit3, GripVertical, Trash } from 'lucide-react';

interface MacroStepItemProps {
    step: MacroFlowStep;   
    onRemove: (stepId: string) => void;
}

const MacroStepItem: React.FC<MacroStepItemProps> = ({ step,  onRemove }) => {
    
    return (
        <div 
            className="flex items-start bg-white p-4 border border-gray-200 rounded shadow-sm hover:shadow-md transition duration-150"
            // draggable 
        >
            
            {/* Thanh Kéo (Drag Handle) - Giữ lại để sắp xếp */}
            <div className="text-gray-400 mr-4 mt-1 cursor-grab flex-shrink-0">
                <GripVertical size={24} />
            </div>

            {/* ⭐ KHÔNG CÓ SỐ THỨ TỰ Ở ĐÂY NỮA ⭐ */}

            {/* Nội dung Bước */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-base text-gray-800 truncate">{step.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                    Micro Case ID: {step.microCaseId.substring(0, 8)}...
                </p>
                {/* Thông tin config inputs sau này sẽ hiện ở đây */}
            </div>

            {/* Hành động */}
            <div className="flex space-x-2 ml-4 flex-shrink-0">
               
                <button
                    onClick={() => onRemove(step.stepId)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition"
                    title="Xóa bước này"
                >
                    <Trash size={18} />
                </button>
            </div>
        </div>
    );
};

export default MacroStepItem;