import { create } from "zustand";
import type { ComponentNode } from "../types/design-types";

type DesignStore = {
  // --- Design Data ---
  components: ComponentNode[];
  links: [];

  // --- UI State ---
  selectedId: string | null;

  // --- Test Case Info ---
  testCaseName: string;
  setTestCaseName: (value: string) => void;

  // --- Actions ---
  addComponent: (component: ComponentNode) => void;
  removeComponent: (id: string) => void;
  setSelected: (id: string | null) => void;
  updateProps: (id: string, newProps: Record<string, any>) => void;
  reorderComponent: (dragId: string, hoverId: string) => void;
  saveDesign: () => void;
};

export const useDesignStore = create<DesignStore>((set, get) => ({
  // -------------------------
  // Initial State
  // -------------------------
  components: [],
  links: [],
  selectedId: null,
  testCaseName: "",

  // -------------------------
  // Test Case Name Setter
  // -------------------------
  setTestCaseName: (value) =>
    set(() => ({
      testCaseName: value,
    })),

  // -------------------------
  // Add Component
  // -------------------------
  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
    })),

  // -------------------------
  // Remove Component
  // -------------------------
  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  // -------------------------
  // Select Component
  // -------------------------
  setSelected: (id) => set({ selectedId: id }),

  // -------------------------
  // Update Props
  // -------------------------
  updateProps: (id, newProps) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c
      ),
    })),
  // -------------------------
  // Reorder Component (Hành động Sắp xếp lại)
  // -------------------------
  reorderComponent: (dragId, hoverId) =>
    set((state) => {
      // Logic sắp xếp lại mảng (move item)
      const components = [...state.components];
      const dragIndex = components.findIndex(c => c.id === dragId);
      const hoverIndex = components.findIndex(c => c.id === hoverId);

      if (dragIndex === -1 || hoverIndex === -1) return state;

      // Di chuyển phần tử
      const [draggedItem] = components.splice(dragIndex, 1);
      components.splice(hoverIndex, 0, draggedItem);

      return { components };
    }),
  // -------------------------
  // Save Design
  // -------------------------
  saveDesign: () => {
    const state = get(); // Lấy state hiện tại bằng get()

    const name = state.testCaseName.trim();

    // 1. Kiểm tra điều kiện bắt buộc
    if (!name) {
      alert("⚠️ Vui lòng nhập Tên Test Case trước khi lưu.");
      return;
    }
    if (state.components.length === 0) {
      alert("⚠️ Design Area không được để trống.");
      return;
    }

    // 2. Chuẩn bị Payload
    const payload = {
      name: name,
      components: state.components,
      // Bạn có thể thêm testData và description nếu có form nhập liệu riêng
      // testData: state.testData || {}, 
      // description: state.description || "",
    };
    const BACKEND_URL = 'http://localhost:5000'; // ⬅️ ĐỊNH NGHĨA BACKEND URL  
    // 3. Gọi API Backend (POST request)
    fetch(`${BACKEND_URL}/api/design/micro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async response => {
        const data = await response.json();

        if (!response.ok) {
          // Xử lý lỗi từ Backend (ví dụ: trùng tên Test Case - status 409)
          const errorMessage = data.msg || `Lỗi HTTP! Status: ${response.status}`;
          throw new Error(errorMessage);
        }
        return data;
      })
      .then(data => {
        console.log("Design saved successfully! ID:", data.id);
        alert(`✅ Lưu Test Case thành công! ID: ${data.id}`);

        // Tùy chọn: Sau khi lưu thành công, bạn có thể reset selectedId
        set({ selectedId: null });
      })
      .catch(error => {
        console.error("Lỗi khi lưu thiết kế:", error.message);
        alert(`❌ Lỗi lưu: ${error.message}`);
      });
  }
}));
