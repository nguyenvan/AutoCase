import React, { useRef } from "react";
import { useDesignStore } from "../../store/useDesignStore";
import type { ComponentNode } from "../../types/design-types";
import { Trash2 } from "lucide-react";
// ❗ THÊM IMPORT DND HOOKS
import { useDrag, useDrop } from "react-dnd";

// Định nghĩa loại item DND
const ItemTypes = {
  NODE: 'node',
  TOOLBOX_ITEM: 'toolbox-item'
};

// Khai báo kiểu Props mới
type Props = {
  node: ComponentNode;
 onClick: (e: React.MouseEvent) => void; // Chấp nhận sự kiện chuột

};

const RenderNode: React.FC<Props> = ({ node, onClick }) => {
  // ❗ LẤY ACTION REORDER TỪ STORE
  const { removeComponent, selectedId, reorderComponent } = useDesignStore();

  const selected = selectedId === node.id;
  const isDisabled = node.props.isDisable ?? false;

  const name = node.props.name || node.type.charAt(0).toUpperCase() + node.type.slice(1);

  // Ref để gắn các handler DND
  const ref = useRef<HTMLDivElement>(null);

  // --- LOGIC DND SẮP XẾP LẠI (Reordering DND Logic) ---

  // 1. useDrag (Cho phép kéo node hiện tại)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NODE,
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

  // --- LOGIC QUẢN LÝ SỐ THỨ TỰ ---
  if (node.props.isVisible === false) {
    return null;
  }
 

  // --- KẾT THÚC LOGIC QUẢN LÝ SỐ THỨ TỰ ---

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
      style={isDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}
    >
      {/* 📌 HIỂN THỊ SỐ THỨ TỰ */}
    

      {/* Remove button */}
      <button
        className="absolute top-[-10px] right-[-10px] p-1 rounded-full bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-150 z-20 shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          removeComponent(node.id);
        }}
        title={`Remove ${name}`}
      >
        <Trash2 size={14} strokeWidth={2.5} />
      </button>

      {/* --- RENDER CÁC CONTROL (Giữ nguyên) --- */}
      {/* Input Field */}
      {node.type === "input" && (
        <input
          className="border p-2 w-full bg-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder={node.props.placeholder || name}
          disabled={isDisabled}
          type={node.props.type || "text"}
        />
      )}
      {/* Button */}
      {node.type === "button" && (
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-150 text-sm"
          disabled={isDisabled}
        >
          {name || "Button"}
        </button>
      )}

      {/* Link */}
      {node.type === "link" && (
        <a
          href={node.props.href || "#"}
          className={`text-blue-600 underline text-sm ${isDisabled ? 'text-gray-500 cursor-not-allowed' : 'hover:text-blue-800'}`}
          style={{ pointerEvents: isDisabled ? "none" : "auto" }}
        >
          {name || "Link"}
        </a>
      )}

      {/* Grid / Table */}
      {node.type === "grid" && (
        <div className="border border-gray-400 p-2 bg-white rounded text-sm text-gray-700">
          <p className="font-semibold mb-1">{name || "Grid Table"}</p>
          <div className="text-xs text-gray-500">
            {node.props.rowCount} Rows | {node.props.headerColumns?.length || 3} Columns
          </div>
        </div>
      )}

      {/* Dropdown (Select/ComboBox) */}
      {node.type === "dropdown" && (
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">{name}:</label>
          <select
            className="border p-2 rounded bg-white text-sm w-fit"
            disabled={isDisabled}
            value={node.props.valueField || node.props.defaultOption}
          >
            <option value="" disabled>Select an option</option>
            <option value="opt1">Option 1</option>
            <option value="opt2">Option 2</option>
            <option value="opt3">Option 3</option>
          </select>
        </div>
      )}

      {/* Toggle (Checkbox/Radio Button) */}
      {node.type === "toggle" && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={node.props.isChecked ?? false}
            disabled={isDisabled}
            style={{ pointerEvents: 'none' }}
          />
          <label className="text-sm text-gray-700">{name || "Toggle Control"}</label>
        </div>
      )}

      {/* Render children recursively (Quan trọng: truyền lại indexRef) */}
      {node.children && node.children.length > 0 && (
        <div className="mt-3 ml-3 border-l border-dashed pl-3 border-gray-400">
          {node.children.map((childNode) => (
            <RenderNode key={childNode.id} node={childNode} onClick={onClick}  />
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderNode;