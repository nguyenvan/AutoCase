import React from 'react';
import { useNavigate } from 'react-router-dom'; // ⭐ Import useNavigate
import { Edit, Link as LinkIcon, Plus, Trash } from 'lucide-react';

// Giả định dữ liệu cứng cho Macro Flow vì Backend API chưa có
const dummyMacroFlows = [
    { _id: 'm1', name: 'Đăng nhập và Tạo đơn hàng', steps: 4, createdAt: new Date().toISOString() },
    { _id: 'm2', name: 'Reset Mật khẩu', steps: 3, createdAt: new Date().toISOString() },
];

const MacroFlowListPage: React.FC = () => {
    // ⭐ Khởi tạo hook useNavigate
    const navigate = useNavigate();

    const handleNew = () => {
        // Chuyển hướng đến trang tạo Macro Flow mới
        console.log('Chuyển hướng đến trang tạo Macro Flow...');
        // ⭐ Dùng navigate để chuyển hướng đến path đã định nghĩa
        navigate('/macro-design');
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <LinkIcon className="mr-3" size={28} /> Quản lý Macro Test Cases (Flow)
            </h2>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleNew}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    <Plus size={18} className="mr-1" /> Tạo Macro Flow
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Flow</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số bước</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dummyMacroFlows.map((flow) => (
                            <tr key={flow._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{flow.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{flow.steps} Micro Cases</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {new Date(flow.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => alert(`Chỉnh sửa Flow: ${flow.name}`)} className="text-blue-600 hover:text-blue-900 mr-3 p-1">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => alert(`Xóa Flow: ${flow.name}?`)} className="text-red-600 hover:text-red-900 p-1">
                                        <Trash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MacroFlowListPage;