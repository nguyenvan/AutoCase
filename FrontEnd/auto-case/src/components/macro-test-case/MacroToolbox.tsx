import React, { useEffect, useState } from "react";
import type { ITestCaseListItem } from "@/interfaces/TestCaseInterfaces";
import { API_URL } from "@/utils/constants";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { MacroToolboxItem } from "./MacroToolboxItem";
export const MacroToolbox: React.FC = () => {
  const [microCases, setMicroCases] = useState<ITestCaseListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Hàm gọi API để lấy danh sách
  const fetchMicroCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/design/micro`);
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

  // --- Logic Lọc ---
  const filteredCases = microCases.filter(mc => {
    const caseName = (mc as any).name || '';
    const caseDesc = (mc as any).description || '';
    const term = searchTerm.toLowerCase();

    return caseName.toLowerCase().includes(term) || caseDesc.toLowerCase().includes(term);
  });

  // Fetch API khi component mount
  useEffect(() => {
    fetchMicroCases();
  }, []);

  let content;

  if (loading) {
    content = (
      <div className="flex justify-center items-center p-8 text-blue-600">
        <Loader2 size={24} className="animate-spin mr-2" /> Loading Micro Cases...
      </div>
    );
  } else if (error) {
    content = (
      <div className="p-4 text-center text-red-600 border border-red-300 bg-red-50 rounded">
        <p className='font-medium mb-2'>Erro load data:</p>
        <p className='text-sm italic'>{error}</p>
        <button onClick={fetchMicroCases} className='mt-3 flex items-center justify-center mx-auto text-sm text-red-700 hover:text-red-900'>
          <RefreshCw size={14} className='mr-1' /> Try again
        </button>
      </div>
    );
  } else if (filteredCases.length === 0) {
    content = (
      <p className="text-gray-400 text-sm p-2 text-center border border-dashed rounded">
        {searchTerm ? `No results found for "${searchTerm}".` : 'No Micro Cases found.'}
      </p>
    );
  } else {
    content = (
      <div className="space-y-2">
        {filteredCases.map((mc) => {
          const id = (mc as any)._id || (mc as any).id;
          const name = (mc as any).name || 'Unnamed Case';
          const description = (mc as any).description || 'No description';

          return (
            <MacroToolboxItem type="captions" name={name} description={description} id={id} icon="Captions" />
          );
        })}
      </div>
    );
  }

  return (
    <div className="p-3 bg-white border border-gray-200 rounded shadow-md h-full flex flex-col">
      <h3 className="font-bold text-lg mb-3 text-gray-700">
        Micro Cases ({microCases.length})
      </h3>

      <div className='relative mb-4 shrink-0'>
        <input
          type="text"
          placeholder="Tìm kiếm Micro Case..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-8 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search size={16} className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' />
      </div>

      <div className="flex-1 overflow-y-auto">
        {content}
      </div>
    </div>
  );
};