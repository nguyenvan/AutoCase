// src/store/useMacroFlowStore.ts

import { create } from 'zustand';
import React from 'react'; // Cần thiết cho useEffect trong hook tiện ích
import { type MacroFlow, type MacroFlowStep, type IMicroTestCaseSummary } from '../types/macro-types';
// Giả định bạn có tiện ích tạo ID duy nhất
// import { generateId } from '@/utils/idGenerator'; 
const generateId = () => Math.random().toString(36).substring(2, 9);

// Định nghĩa trạng thái ban đầu của Macro Flow
const initialMacroFlowState: MacroFlow = {
    name: '',
    description: '',
    steps: [],
    status: 'Draft',
};

// Định nghĩa State cho Store
interface MacroFlowState extends MacroFlow {
    // State Data
    availableMicroCases: IMicroTestCaseSummary[];
    loading: boolean; // Trạng thái tải Micro Cases
    saving: boolean; // Trạng thái lưu Macro Flow
    error: string | null;

    // Actions Cập nhật thông tin cơ bản
    setFlowName: (name: string) => void;
    setDescription: (desc: string) => void;
    setLoading: (isLoading: boolean) => void;

    // Actions Quản lý Steps
    addStep: (microCase: IMicroTestCaseSummary) => void;
    removeStep: (stepId: string) => void;
    reorderSteps: (dragId: string, hoverId: string) => void;

    // Actions API
    fetchAvailableMicroCases: () => Promise<void>;
    //loadMacroFlow: (id: string) => Promise<void>;
    //saveMacroFlow: (id?: string) => Promise<boolean>;
   // resetFlow: () => void;
}

export const useMacroFlowStore = create<MacroFlowState>((set, get) => ({
    // --- State Khởi tạo ---
    ...initialMacroFlowState,
    availableMicroCases: [],
    loading: false,
    saving: false,
    error: null,

    // --- Actions Cập nhật cơ bản ---
    setFlowName: (name) => set({ name }),
    setDescription: (description) => set({ description }),
    setLoading: (isLoading) => set({ loading: isLoading }),
    resetFlow: () => set(initialMacroFlowState),

    // --- Actions Quản lý Steps ---
    addStep: (microCase) => set((state) => {
        const newStep: MacroFlowStep = {
            stepId: generateId(),
            microCaseId: microCase.id,
            name: microCase.testCaseName,
            inputData: {},
        };
        return { steps: [...state.steps, newStep] };
    }),

    removeStep: (stepId) => set((state) => ({
        steps: state.steps.filter(step => step.stepId !== stepId),
    })),

    reorderSteps: (dragId, hoverId) => set((state) => {
        const steps = [...state.steps];
        const dragIndex = steps.findIndex(s => s.stepId === dragId);
        const hoverIndex = steps.findIndex(s => s.stepId === hoverId);

        if (dragIndex === -1 || hoverIndex === -1) return state;

        const [draggedItem] = steps.splice(dragIndex, 1);
        steps.splice(hoverIndex, 0, draggedItem);

        return { steps };
    }),

    // // --- Logic API ---

    // // 1. Lấy danh sách Micro Cases có sẵn
    fetchAvailableMicroCases: async () => {
        // set({ loading: true, error: null });
        // try {
        //     debugger
        //     const response = await fetch('/api/design/micro');
        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         throw new Error(errorData.msg || 'Failed to fetch available micro cases.');
        //     }

        //     const rawCases = await response.json();
        //     const cases: IMicroTestCaseSummary[] = rawCases.map((c: any) => ({
        //         id: c._id,
        //         testCaseName: c.name,
        //         description: c.description || '',
        //     }));

        //     set({ availableMicroCases: cases, loading: false });

        // } catch (err) {
        //     const error = err as Error;
        //     console.error(error.message);
        //     set({ loading: false, error: 'Không thể tải danh sách Micro Cases.' });
        // }
    },

    // // 2. Tải Macro Flow để chỉnh sửa (Logic mock)
    // loadMacroFlow: async (id) => {
    //     // set({ loading: true, error: null });
    //     // try {
    //     //     const response = await fetch(`/api/design/macro/${id}`);
    //     //     if (!response.ok) {
    //     //         const errorData = await response.json();
    //     //         throw new Error(errorData.msg || 'Failed to load Macro Flow.');
    //     //     }

    //     //     const flowData = await response.json() as MacroFlow & { _id: string };

    //     //     set({
    //     //         id: flowData._id,
    //     //         name: flowData.name,
    //     //         description: flowData.description,
    //     //         steps: flowData.steps,
    //     //         status: flowData.status,
    //     //         loading: false
    //     //     });

    //     // } catch (err) {
    //     //     const error = err as Error;
    //     //     console.error(`Error loading flow ${id}:`, error.message);
    //     //     set({ loading: false, error: 'Không thể tải chi tiết Macro Flow này.' });
    //     // }
    // },

    // 3. Lưu/Cập nhật Macro Flow
    // saveMacroFlow: async (id) => {
    //     set({ saving: true, error: null });
    //     const state = get();

    //     // Tạo payload chỉ chứa dữ liệu cần thiết cho API
    //     const payload: Omit<MacroFlow, 'id'> = {
    //         name: state.name,
    //         description: state.description,
    //         steps: state.steps,
    //         status: state.status,
    //     };

    //     const method = id ? 'PUT' : 'POST';
    //     const url = id ? `/api/design/macro/${id}` : '/api/design/macro';

    //     try {
    //         const response = await fetch(url, {
    //             method: method,
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(payload),
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.msg || 'Failed to save Macro Flow.');
    //         }

    //         const result = await response.json();

    //         set({ saving: false, id: result.id || id });
    //         return true;

    //     } catch (err) {
    //         const error = err as Error;
    //         console.error(error.message);
    //         set({ saving: false, error: `Lỗi lưu Flow: ${error.message}` });
    //         return false;
    //     }
    // }
}));


// --- Hook Tiện ích: useMicroCaseData (Sử dụng trong MacroFlowToolbox) ---
export const useMicroCaseData = () => {
    
    // Logic fetch chỉ chạy một lần khi mount
    React.useEffect(() => {
        // Lấy toàn bộ trạng thái và actions hiện tại (snapshot)
        const state = useMacroFlowStore.getState();

        // Kiểm tra: nếu chưa có data VÀ không đang fetch
        if (state.availableMicroCases.length === 0 && !state.loading) {
            console.log("MacroFlowToolbox: Initial fetching micro cases...");
            
            // ⭐ GỌI ACTION TỪ SNAPSHOT CỦA STORE
            state.fetchAvailableMicroCases(); 
        }
    // ⭐ Mảng dependency RỖNG: Đảm bảo hook chỉ chạy MỘT LẦN khi component mount
    }, []); 
    
    // Trả về data cho component sử dụng (sẽ re-render khi store thay đổi)
    return useMacroFlowStore(state => ({
        availableMicroCases: state.availableMicroCases,
        loading: state.loading,
        error: state.error
    }));
};