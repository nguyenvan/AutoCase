import React, { useRef } from "react";
import type { ComponentMacroNode } from "../../types/design-types";
import { icons, Trash2 } from "lucide-react";
// ❗ THÊM IMPORT DND HOOKS
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "@/utils/constants";
import { useDesignMacroStore } from "@/store/useDesignMacroStore";

// Khai báo kiểu Props mới
type MacroProps = {
  node: ComponentMacroNode;
  onClick: (e: React.MouseEvent) => void; // Chấp nhận sự kiện chuột

};

const MacroRenderNode: React.FC<MacroProps> = ({ node, onClick }) => {
  // ❗ LẤY ACTION REORDER TỪ STORE
  const { removeComponent, selectedId, reorderComponent } = useDesignMacroStore();

  const selected = selectedId === node.id;
  const name = node.microName || "Macro Component";

  // Ref để gắn các handler DND
  const ref = useRef<HTMLDivElement>(null);

  // --- LOGIC DND SẮP XẾP LẠI (Reordering DND Logic) ---

  // 1. useDrag (Cho phép kéo node hiện tại)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NODE,
    name: name,
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [node.id]);


  // 2. useDrop (Cho phép thả node khác vào node hiện tại)
  const [{ isOverCurrent }, drop] = useDrop(() => ({
    accept: ItemTypes.NODE,
    // Hàm hover sẽ được gọi khi một item cùng loại (NODE) được kéo qua
    hover(item: { id: string }, monitor) {
      if (!ref.current) return;
      const dragId = item.id;
      const hoverId = node.id;

      if (dragId === hoverId) return;

      // Chỉ thực hiện sắp xếp lại khi node đang được kéo qua (shallow: true)
      if (monitor.isOver({ shallow: true })) {
        // Gọi action reorder từ Zustand Store
        reorderComponent(dragId, hoverId);
      }
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  }), [node.id, reorderComponent]); // Dependency: node.id và reorderComponent


  // Gắn cả hai DND handler vào ref
  drag(drop(ref));

  const Icon = icons["Captions"];
  return (
    <div
      // ❗ GẮN REF DND
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      // ❗ THÊM CLASS CHO DND (Kéo và Thả)
      className={`relative border p-3 rounded mb-2 cursor-move transition-all duration-100 ${selected ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-300 hover:border-gray-400"
        } 
      ${isDragging ? "opacity-0" : "opacity-100"} 
      ${isOverCurrent ? "border-dashed border-2 border-red-500" : ""}`}

    >

      {/* Remove button */}
      <button
        className="absolute top-2.5 right-2.5 p-1 rounded-full bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-150 z-20 shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          removeComponent(node.id);
        }}
        title={`Remove ${name}`}
      >
        <Trash2 size={14} strokeWidth={2.5} />
      </button>

      <div className="flex items-center space-x-2">
        <Icon size={16} />
        <label className="text-sm text-gray-700">{node.microName || "Toggle Control"}</label>
      </div>

    </div>
  );
};

export default MacroRenderNode;