// src/components/macro-flow/MacroFlowToolbox.tsx

import React, { useEffect, useState } from 'react';
import { Search, Loader2, RefreshCw } from 'lucide-react';
import type { ITestCaseListItem } from '@/interfaces/TestCaseInterfaces';

const BACKEND_URL = 'http://localhost:5000'; // URL của Design Manager Service

// interface MacroFlowToolboxProps {
//     onMicroCaseDrop: (microCase: IMicroTestCaseSummary) => void;
// }

const MacroFlowToolbox: React.FC = () => { // Bỏ MacroFlowToolboxProps
    const [microCases, setMicroCases] = useState<ITestCaseListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    
    // Hàm gọi API để lấy danh sách
    const fetchMicroCases = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BACKEND_URL}/api/design/micro`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định.' }));
                throw new Error(errorData.message || 'Không thể tải danh sách Micro Test Case');
            }
            const data: ITestCaseListItem[] = await response.json();
            setMicroCases(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch API khi component mount
    useEffect(() => {
        fetchMicroCases();
    }, []);

    // --- Logic Kéo (Drag) ---
    // Giờ phải lưu ID và cả JSON của item để Builder có thể lấy chi tiết khi thả
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, microCase: ITestCaseListItem) => {
        //const id = (microCase as any)._id || (microCase as any).id;
        
        // Truyền ID để Builder biết item nào được thả
       // e.dataTransfer.setData('microCaseId', id); 
        // Truyền cả object dưới dạng JSON (tùy chọn, nhưng tiện lợi hơn cho Builder)
        e.dataTransfer.setData('application/json', JSON.stringify(microCase)); 
        
        // ... (Logic tạo ảnh kéo giả) ...
    };
    
    // --- Logic Lọc ---
    const filteredCases = microCases.filter(mc => {
        const caseName = (mc as any).name || ''; 
        const caseDesc = (mc as any).description || '';
        const term = searchTerm.toLowerCase();
        
        return caseName.toLowerCase().includes(term) || caseDesc.toLowerCase().includes(term);
    });

    // --- Render Nội dung dựa trên trạng thái (như cũ) ---
    // ... (Phần render trạng thái loading, error, filtering không thay đổi) ...

    let content;

    if (loading) {
        content = (
            <div className="flex justify-center items-center p-8 text-blue-600">
                <Loader2 size={24} className="animate-spin mr-2"/> Đang tải Micro Cases...
            </div>
        );
    } else if (error) {
        content = (
            <div className="p-4 text-center text-red-600 border border-red-300 bg-red-50 rounded">
                <p className='font-medium mb-2'>Lỗi tải dữ liệu:</p>
                <p className='text-sm italic'>{error}</p>
                <button onClick={fetchMicroCases} className='mt-3 flex items-center justify-center mx-auto text-sm text-red-700 hover:text-red-900'>
                    <RefreshCw size={14} className='mr-1'/> Thử lại
                </button>
            </div>
        );
    } else if (filteredCases.length === 0) {
        content = (
            <p className="text-gray-400 text-sm p-2 text-center border border-dashed rounded">
                {searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}".` : 'Không tìm thấy Micro Case nào.'}
            </p>
        );
    } else {
        content = (
            <div className="space-y-2">
                {filteredCases.map((mc) => {
                    const id = (mc as any)._id || (mc as any).id;
                    const name = (mc as any).name || 'Unnamed Case';
                    const description = (mc as any).description || 'Chưa có mô tả';

                    return (
                        <div
                            key={id}
                            className="p-3 bg-blue-50 border border-blue-200 rounded cursor-grab hover:bg-blue-100 transition duration-150 shadow-sm"
                            draggable 
                            onDragStart={(e) => handleDragStart(e, mc)} // Truyền cả object
                        >
                            <p className="font-semibold text-sm text-blue-800">{name}</p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
                            <p className="text-xs text-gray-400 mt-1">ID: {id.substring(0, 8)}...</p>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="p-3 bg-white border border-gray-200 rounded shadow-md h-full flex flex-col">
            <h3 className="font-bold text-lg mb-3 text-gray-700">
                Micro Cases Có Sẵn ({microCases.length})
            </h3>
            
            <div className='relative mb-4 shrink-0'>
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm Micro Case..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-8 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search size={16} className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'/>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {content}
            </div>
        </div>
    );
};

export default MacroFlowToolbox;