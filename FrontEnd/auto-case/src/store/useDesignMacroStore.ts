import { create } from "zustand";
import type { ComponentMacroNode } from "../types/design-types";
import { API_URL } from "@/utils/constants";

// --- 1. Định nghĩa Interface cho dữ liệu nhận từ Backend (IMicroTestCase) ---
// Đây là interface tối thiểu cần thiết để tải dữ liệu chỉnh sửa
interface IMacroTestCase {
  _id: string;
  name: string;
  description?: string;
  // Đảm bảo kiểu dữ liệu trong store khớp với Backend response
  components: ComponentMacroNode[];
  testData?: Record<string, any>;
  // Có thể có các trường khác như testData, v.v.
}

// --- 2. Định nghĩa Initial State (để dùng cho reset) ---
const initialState = {
  components: [] as ComponentMacroNode[],
  links: [] as any[], // Giả định links là mảng rỗng (hoặc nên định nghĩa kiểu cụ thể)
  selectedId: null as string | null,
  testCaseName: "",
  description: "",
  canvasData: {} as Record<string, any>, // Dùng Record<string, any> thay vì {}
  loading: false,
  error: null as string | null,
};

// --- 3. Định nghĩa DesignStore Type (Sửa lỗi TS2322 và bổ sung thiếu sót) ---
type DesignMacroStore = typeof initialState & {
  // --- Actions ---
  setTestCaseName: (value: string) => void;
  setDescription: (value: string) => void;
  addComponent: (component: ComponentMacroNode) => void;
  removeComponent: (id: string) => void;
  setSelected: (id: string | null) => void; 
  reorderComponent: (dragId: string, hoverId: string) => void;

  // ⭐ Đã sửa: Thêm chữ ký hàm và kiểu trả về cho saveDesign
  saveDesign: (caseId: string | undefined) => Promise<boolean>;

  // ⭐ Đã thêm: Hàm tải dữ liệu cho Edit
  fetchDesignForEdit: (caseId: string) => Promise<IMacroTestCase | null>;

  // ⭐ Đã thêm: Hàm reset state
  resetState: () => void;
};

export const useDesignMacroStore = create<DesignMacroStore>((set, get) => ({
 
  // -------------------------
  // Initial State (Sử dụng initialState)
  // -------------------------
  ...initialState,

  // -------------------------
  // Reset State
  // -------------------------
  resetState: () => set(initialState),

  // -------------------------
  // Test Case Name Setter (Giữ nguyên)
  // -------------------------
  setTestCaseName: (value) => set(() => ({ testCaseName: value })),
  // -------------------------
  // Description Setter
  // -------------------------
  setDescription: (value) =>
    set(() => ({
      description: value,
    })),
  // -------------------------
  // Add Component (Giữ nguyên)
  // -------------------------
  addComponent: (component) =>
    set((state) => ({ components: [...state.components, component] })),

  // -------------------------
  // Remove Component (Giữ nguyên)
  // -------------------------
  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  // -------------------------
  // Select Component (Giữ nguyên)
  // -------------------------
  setSelected: (id) => set({ selectedId: id }),

 

  // -------------------------
  // Reorder Component (Giữ nguyên)
  // -------------------------
  reorderComponent: (dragId, hoverId) =>
    set((state) => {
      const components = [...state.components];
      const dragIndex = components.findIndex(c => c.id === dragId);
      const hoverIndex = components.findIndex(c => c.id === hoverId);

      if (dragIndex === -1 || hoverIndex === -1) return state;

      const [draggedItem] = components.splice(dragIndex, 1);
      components.splice(hoverIndex, 0, draggedItem);

      return { components };
    }),

  // -------------------------
  // Save Design (Giữ nguyên logic)
  // -------------------------  
  saveDesign: async (caseId: string | undefined) => {
    const state = get();
  
    // Chuẩn hóa payload
    const payload = {
      name: state.testCaseName,
      description: state.description,
      components: state.components, // Dùng components thay vì canvasData
    };

    // Kiểm tra dữ liệu bắt buộc trước khi gửi API
    if (!payload.name.trim() || payload.components.length === 0) {
      alert("⚠️ Vui lòng nhập Tên Test Case và thiết kế nội dung.");
      return false;
    }

    const method = caseId ? 'PUT' : 'POST';
    const url = caseId
      ? `${API_URL}/api/design/micro/${caseId}`
      : `${API_URL}/api/design/micro`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || `Lưu thất bại. Status: ${response.status}`);
      }

      const result = await response.json();

      if (method === 'POST') {
        alert(`✅ Tạo Micro Test Case mới thành công: ${result.name}`);
      } else {
        alert(`✅ Cập nhật Micro Test Case "${result.name}" thành công!`);
      }

      return true;
    } catch (error) {
      console.error("Lỗi khi lưu/cập nhật:", error);
      alert(`❌ Lỗi khi lưu/cập nhật: ${(error as Error).message}`);
      return false;
    }
  },

  // -------------------------
  // Fetch Design For Edit
  // -------------------------
  fetchDesignForEdit: async (caseId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/design/micro/${caseId}`);

      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu Test Case.');
      }

      const data: IMacroTestCase = await response.json();

      // ⭐ Map dữ liệu tải về vào store state
      set({
        testCaseName: data.name,
        description: data.description || "",
        components: data.components || [], // Đảm bảo luôn là mảng
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  }
}));