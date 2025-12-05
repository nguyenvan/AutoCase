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

  saveDesign: () => void;
};

export const useDesignStore = create<DesignStore>((set) => ({
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
  // Save Design
  // -------------------------
  saveDesign: () =>
    set((state) => {
      const payload = {
        testCaseName: state.testCaseName,
        components: state.components,
        links: state.links,
      };

      console.log("Saving design:", JSON.stringify(payload, null, 2));
      return state;
    }),
}));
