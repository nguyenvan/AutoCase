import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ITestCaseListItem } from '../interfaces/TestCaseInterfaces'; // Đảm bảo đường dẫn đúng
import { ListTree, Edit, Trash, Plus } from 'lucide-react';
import { API_URL } from '@/utils/constants';


const MacroCaseListPage: React.FC = () => {
    const [microCases, setMicroCases] = useState<ITestCaseListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Hàm gọi API để lấy danh sách
    const fetchMicroCases = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/design/macro`);
            if (!response.ok) {
                throw new Error('Không thể tải danh sách Macro Test Case');
            }
            const data: ITestCaseListItem[] = await response.json();
            setMicroCases(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Hàm XỬ LÝ XÓA
    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa Test Case: "${name}" không?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/design/macro/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Xóa thất bại.');
            }

            // Xóa thành công
            alert(`✅ Đã xóa thành công Test Case "${name}".`);

            // Cập nhật lại danh sách bằng cách gọi lại hàm fetch
            fetchMicroCases();

        } catch (err) {
            console.error("Lỗi xóa:", (err as Error).message);
            alert(`❌ Lỗi xóa Test Case: ${(err as Error).message}`);
        }
    };

    useEffect(() => {
        fetchMicroCases();
    }, []);

    const handleEdit = (id: string) => {
        // Chuyển hướng đến trang Design để chỉnh sửa
        // /design/:id
        navigate(`/macro-design/${id}`);
    };

    const handleNew = () => {
        // Chuyển hướng đến trang Design mới
        navigate('/macro-design');
    };

    // --- RENDER LOGIC ---
    if (loading) return <div className="p-8 text-center text-blue-600">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Lỗi: {error}</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <ListTree className="mr-3" size={28} /> Micro Test Cases Management
            </h2>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleNew}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                    <Plus size={18} className="mr-1" /> Add
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Test Case</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {microCases.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    Chưa có Micro Test Case nào được lưu.
                                </td>
                            </tr>
                        ) : (
                            microCases.map((testCase) => (
                                <tr key={testCase._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{testCase.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{testCase.description || '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {new Date(testCase.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(testCase._id)} className="text-blue-600 hover:text-blue-900 mr-3 p-1">
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(testCase._id, testCase.name)} // ⬅️ GỌI HÀM XÓA
                                            className="text-red-600 hover:text-red-900 p-1"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MacroCaseListPage;