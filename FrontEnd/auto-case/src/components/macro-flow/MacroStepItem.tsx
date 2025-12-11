// src/components/macro-flow/MacroStepItem.tsx (Tạo hoặc cập nhật)

import React, { useRef, useState } from 'react';
import { Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import type { MacroFlowStep } from '@/types/macro-types';

interface MacroStepItemProps {
    step: MacroFlowStep;
    index: number; // ⭐ BẮT BUỘC: Index của item trong mảng
    onRemove: (stepId: string) => void;
    // ⭐ PROP MỚI: Callback để cập nhật mảng
    onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const MacroStepItem: React.FC<MacroStepItemProps> = ({ step, index, onRemove, onReorder }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);
    
    // --- Logic Kéo và Thả giữa các Item ---

    // 1. Khi bắt đầu kéo item này
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        // Lưu index của item đang kéo
        e.dataTransfer.setData('stepIndex', String(index)); 
        
        // Cần tạo ảnh kéo giả hoặc sử dụng ảnh mặc định
        setTimeout(() => {
            // Hiệu ứng làm mờ item đang kéo
            if(itemRef.current) itemRef.current.style.opacity = '0.4';
        }, 0); 
    };

    // 2. Khi item đang được kéo đi qua item này
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Ngăn chặn sự kiện nổi lên Builder

        if (!itemRef.current) return;

        const dragIndex = Number(e.dataTransfer.getData('stepIndex'));
        const hoverIndex = index;

        // Nếu item đang kéo là chính item này, bỏ qua
        if (dragIndex === hoverIndex) {
            return;
        }

        // ⭐ QUAN TRỌNG: Gọi hàm reorder
        // Chúng ta gọi reorder liên tục để tạo hiệu ứng chuyển động khi kéo
        onReorder(dragIndex, hoverIndex); 

        // Sau khi reorder, cập nhật lại dataTransfer để lần kéo tiếp theo vẫn đúng
        // (Đây là kỹ thuật cần thiết khi không dùng DND)
        e.dataTransfer.setData('stepIndex', String(hoverIndex)); 
    };
    
    // 3. Khi kết thúc kéo
    const handleDragEnd = () => {
        setIsDragging(false);
        if(itemRef.current) itemRef.current.style.opacity = '1';
    };

    // 4. Khi drop xảy ra (đã được xử lý trong handleDragOver)
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
    }
    
    return (
        <div 
            ref={itemRef}
            className={`bg-white border border-gray-300 rounded shadow-md transition duration-200 ${isDragging ? 'opacity-40 border-indigo-500' : 'hover:shadow-lg'}`}
            // ⭐ EVENTS KÉO THẢ MỚI
            draggable 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop} // Bắt buộc phải có onDrop để kích hoạt onDragOver trên một số trình duyệt
        >
            <div className="flex items-center justify-between p-3 cursor-move">
                <div className="flex items-center space-x-2 w-full">
                    <GripVertical size={20} className="text-gray-400 flex-shrink-0 cursor-grab" />
                    <span className="font-semibold text-sm text-gray-800 flex-shrink-0">Bước {index + 1}:</span>
                    
                    <span className="truncate text-sm text-indigo-700 font-medium flex-1">
                        {step.name}
                    </span>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Nút mở rộng */}
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 text-gray-500 hover:text-indigo-600 transition"
                    >
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    
                    {/* Nút xóa */}
                    <button
                        type="button"
                        onClick={() => onRemove(step.stepId)}
                        className="p-1 text-red-500 hover:text-red-700 transition"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Nội dung chi tiết (Input Data) */}
            {isExpanded && (
                <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
                    <p className='font-medium mb-1'>Dữ liệu đầu vào (Input Data):</p>
                    <pre className='whitespace-pre-wrap p-2 bg-white border rounded'>
                        {JSON.stringify(step.inputData || {}, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default MacroStepItem;