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
  //const globalIndexRef = useRef(0);
  
  // Logic DND để thêm component mới từ Toolbox
  const [{ isOver }, drop] = useDrop(() => ({
    // Chấp nhận loại item từ Toolbox
    accept: "toolbox-item",
    drop: (item: { type: string }) => {
      // Khởi tạo thuộc tính mặc định
      const defaultProps: BaseProps = {
        name: "",
        xpath: "",
        valueField: "",
        isRequire: false, // Giả định BaseProps có isRequire
        isRequired: false,
        isDisable: false,
        isVisible: true,
        errorMessage: "",
        // Thêm các thuộc tính mặc định khác nếu cần
      };
      
      const newComponent: ComponentNode = {
        id: crypto.randomUUID(),
        type: item.type as ComponentNode["type"],
        props: defaultProps,
        children: [],
      };
      addComponent(newComponent);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [addComponent]); // Dependency: addComponent

  // Gắn vùng thả vào dropRef
  drop(dropRef);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-gray-50 h-full">

      {/* ⭐ TEST CASE NAME + SAVE BUTTON */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <label className="font-medium w-40 text-gray-700">Test Case Name:</label>
          <input
            value={testCaseName}
            onChange={(e) => setTestCaseName(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder="Enter test case name"
          />
        </div>

        <button
          onClick={saveDesign}
          className="ml-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-150 shadow-md"
        >
          💾 Save Test Case
        </button>
      </div>

      {/* --- TWO COLUMN LAYOUT --- */}
      <div className="flex h-full gap-4">

        {/* LEFT COLUMN – TOOLBOX */}
        <div className="w-[180px] border border-gray-300 rounded bg-white p-2 h-fit">
          <Toolbox />
        </div>

        {/* RIGHT COLUMN – DESIGN AREA (Vùng thả) */}
        <div
          ref={dropRef}
          className={`flex-1 min-h-[500px] border border-gray-300 p-4 bg-white rounded shadow-sm transition duration-150
            ${isOver ? "bg-blue-50 border-blue-500 border-2" : "border-gray-300"}`}
        >
          {components.length === 0 && (
            <p className="text-gray-400 text-center pt-10">
              Drag items from the Toolbox here to start building your test case...
            </p>
          )}

          {/* ✅ RESET INDEX NGAY TRƯỚC VÒNG LẶP MAP */}
          {/* Đảm bảo bộ đếm được reset về 0 trước khi quá trình đếm đệ quy bắt đầu */}
        

          {components.map((c) => (
            <RenderNode
              key={c.id}
              node={c}
              onClick={() => setSelected(c.id)}
              // TRUYỀN THAM CHIẾU BỘ ĐẾM VÀO COMPONENT ĐỆ QUY
              //indexRef={globalIndexRef} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;