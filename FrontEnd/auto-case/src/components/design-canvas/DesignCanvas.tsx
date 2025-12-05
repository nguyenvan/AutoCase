import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import type { ComponentNode, BaseProps } from "../../types/design-types";
import { useDesignStore } from "../../store/useDesignStore";
import RenderNode from "./RenderNode";
import { Toolbox } from "../toolbox/Toolbox";

const DesignCanvas: React.FC = () => {
  const {
    components,
    addComponent,
    setSelected,
    testCaseName,
    setTestCaseName,
    saveDesign,
  } = useDesignStore();

  const dropRef = useRef<HTMLDivElement>(null);
  
  // 1. Khởi tạo Tham chiếu Bộ đếm Toàn cục
  const globalIndexRef = useRef(0);
  
  // THAY ĐỔI TẠI ĐÂY:
  // Nếu số thứ tự là 2, 4, 6... (tăng 2 lần) và bạn muốn 1, 3, 5..., 
  // hãy thử reset về 0 (như cũ). 
  // Nếu bạn muốn 1, 2, 3... (tăng 1 lần), hãy thử reset về -1.
  globalIndexRef.current = 0;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "toolbox-item",
    drop: (item: { type: string }) => {
      // Khởi tạo thuộc tính mặc định cho BaseProps
      const defaultProps: BaseProps = {
        name: "",
        xpath: "",
        valueField: "",
        isRequired: false,
        isDisable: false,
        isVisible: true,
        errorMessage: "",
      };
      
      const newComponent: ComponentNode = {
        id: crypto.randomUUID(),
        type: item.type as ComponentNode["type"],
        // Sử dụng các thuộc tính mặc định
        props: defaultProps,
        children: [],
      };
      addComponent(newComponent);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(dropRef);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-gray-50 h-full">

      {/* ⭐ TEST CASE NAME + SAVE BUTTON */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <label className="font-medium w-40">Test Case Name:</label>
          <input
            value={testCaseName}
            onChange={(e) => setTestCaseName(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            placeholder="Enter test case name"
          />
        </div>

        <button
          onClick={saveDesign}
          className="ml-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Test Case
        </button>
      </div>

      {/* ⭐ TWO COLUMN LAYOUT */}
      <div className="flex h-full gap-4">

        {/* LEFT COLUMN – TOOLBOX */}
        <div className="w-[180px] border border-gray-300 rounded bg-white p-2">
          <Toolbox />
        </div>

        {/* RIGHT COLUMN – DESIGN AREA */}
        <div
          ref={dropRef}
          className={`flex-1 min-h-[500px] border border-gray-300 p-4 bg-white rounded shadow-sm 
            ${isOver ? "bg-blue-50" : ""}`}
        >
          {components.length === 0 && (
            <p className="text-gray-400">Drag items here…</p>
          )}

          {components.map((c) => (
            <RenderNode
              key={c.id}
              node={c}
              onClick={() => setSelected(c.id)}
              // 2. TRUYỀN THAM CHIẾU BỘ ĐẾM VÀO COMPONENT ĐỆ QUY
              indexRef={globalIndexRef} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;