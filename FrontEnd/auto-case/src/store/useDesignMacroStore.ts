import { create } from "zustand";
import type { ComponentMacroNode } from "../types/design-types";
import { API_URL } from "@/utils/constants";

// --- 1. Định nghĩa Interface cho dữ liệu Backend (IMacroTestCase) ---
// Thêm IFlowStep tương tự như Backend (dùng cho việc map ngược)
interface IFlowStep {
  sequence: number;
  microTestCaseId: IPopulatedMicroCase; // LÀ OBJECT CHỨA TÊN VÀ ID
  repeat: number;
}
// Interface cho Micro Case đã được populate (chỉ chứa các trường cần thiết)
interface IPopulatedMicroCase {
  _id: string;
  name: string;
  description?: string;
}
// Đây là interface tối thiểu cần thiết để tải dữ liệu chỉnh sửa
interface IMacroTestCaseResponse {
  _id: string;
  name: string;
  description?: string;
  // Khi tải về từ Backend (chế độ Edit), nó trả về flow
  flow: IFlowStep[];
}

// --- 2. Định nghĩa Initial State (Giữ nguyên) ---
const initialState = {
  components: [] as ComponentMacroNode[],
  links: [] as any[],
  selectedId: null as string | null,
  testCaseName: "",
  description: "",
  canvasData: {} as Record<string, any>,
  loading: false,
  error: null as string | null,
};

// --- 3. Định nghĩa DesignStore Type (Giữ nguyên) ---
type DesignMacroStore = typeof initialState & {
  // --- Actions ---
  setTestCaseName: (value: string) => void;
  setDescription: (value: string) => void;
  addComponent: (component: ComponentMacroNode) => void;
  removeComponent: (id: string) => void;
  setSelected: (id: string | null) => void;
  reorderComponent: (dragId: string, hoverId: string) => void;

  saveDesign: (caseId: string | undefined) => Promise<boolean>;

  // Đã sửa kiểu trả về
  fetchDesignForEdit: (caseId: string) => Promise<IMacroTestCaseResponse | null>;

  resetState: () => void;
};

export const useDesignMacroStore = create<DesignMacroStore>((set, get) => ({

  ...initialState,

  resetState: () => set(initialState),

  setTestCaseName: (value) => set(() => ({ testCaseName: value })),

  setDescription: (value) =>
    set(() => ({
      description: value,
    })),

  addComponent: (component) =>
    set((state) => ({ components: [...state.components, component] })),

  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  setSelected: (id) => set({ selectedId: id }),

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

  // --------------------------------
  // ⭐ SỬA LOGIC SAVE DESIGN (ÁNH XẠ DỮ LIỆU)
  // --------------------------------  
  saveDesign: async (caseId: string | undefined) => {
    const state = get();

    // ⭐ BƯỚC 1: Ánh xạ Components thành Flow Steps
    const flowPayload: IFlowStep[] = state.components
      .map((comp, index) => {
        // Giả định:
        // 1. comp.microCaseId chứa ID MongoDB của MicroTestCase
        // 2. repeat nên được quản lý (hiện tại chưa có UI, mặc định là 1)
        // 3. sequence là vị trí trong mảng (index + 1)

        const microCaseId = (comp as any).microCaseId || comp.id; // Lấy ID Micro Case
        if (!microCaseId) {
          console.warn(`Component ID ${comp.id} thiếu microCaseId.`);
          return null;
        }

        return {
          sequence: index + 1,
          microTestCaseId: microCaseId,
          repeat: (comp as any).repeat || 1, // Nếu có logic repeat trong ComponentMacroNode
        } as IFlowStep;
      })
      .filter((step): step is IFlowStep => step !== null); // Lọc bỏ các phần tử lỗi

    // Chuẩn hóa payload cho API MacroTestCase
    const payload = {
      name: state.testCaseName,
      description: state.description,
      flow: flowPayload, // ⭐ Gán mảng flow đã được ánh xạ
    };

    // Kiểm tra dữ liệu bắt buộc trước khi gửi API
    if (!payload.name.trim() || payload.flow.length === 0) {
      alert("⚠️ Vui lòng nhập Tên Test Case và thiết kế Flow (kéo ít nhất một Micro Case).");
      return false;
    }

    const method = caseId ? 'PUT' : 'POST';
    const url = caseId
      ? `${API_URL}/api/design/macro/${caseId}`
      : `${API_URL}/api/design/macro`;

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
        alert(`✅ Tạo Macro Test Case mới thành công: ${result.name}`);
      } else {
        alert(`✅ Cập nhật Macro Test Case "${result.name}" thành công!`);
      }

      return true;
    } catch (error) {
      console.error("Lỗi khi lưu/cập nhật:", error);
      alert(`❌ Lỗi khi lưu/cập nhật: ${(error as Error).message}`);
      return false;
    }
  },

  // -----------------------------------------
  // SỬA LOGIC FETCH DESIGN FOR EDIT (ÁNH XẠ NGƯỢC)
  // -----------------------------------------
  fetchDesignForEdit: async (caseId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/design/macro/${caseId}`);

      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu Test Case.');
      }

      const data: IMacroTestCaseResponse = await response.json();

      // BƯỚC 2: Ánh xạ Flow Steps thành Components (dùng cho Frontend)
      const componentsFromFlow: ComponentMacroNode[] = data.flow.map(step => ({
        // ID của Component trong Frontend (ID tạm thời)
        id: `${step.microTestCaseId._id}-${step.sequence}`,

        // ID Micro Case thực tế (cần để lưu lại)
        microCaseId: step.microTestCaseId._id,

        // ⭐ CẬP NHẬT: Lấy TÊN Micro Case đã được populate
        microName: step.microTestCaseId.name,

        type: "macro"
      }));

      // Map dữ liệu tải về vào store state
      set({
        testCaseName: data.name,
        description: data.description || "",
        components: componentsFromFlow,
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