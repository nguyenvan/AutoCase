import React from "react";
import { useDesignStore } from "../../store/useDesignStore";
import type { ComponentNode } from "../../types/design-types";
import { Trash2 } from "lucide-react";

// Khai báo kiểu Props mới
type Props = {
  node: ComponentNode;
  onClick: () => void;
  // Tham chiếu mutable (useRef) để quản lý số thứ tự toàn cục
  indexRef: React.MutableRefObject<number>; 
};

const RenderNode: React.FC<Props> = ({ node, onClick, indexRef }) => {
  const { removeComponent, selectedId } = useDesignStore();
  const selected = selectedId === node.id;
  const isDisabled = node.props.isDisable ?? false;

  // Lấy ra tên control, ưu tiên name, nếu không có thì dùng loại control
  const name = node.props.name || node.type.charAt(0).toUpperCase() + node.type.slice(1);

  // --- LOGIC QUẢN LÝ SỐ THỨ TỰ ---
  
  // 1. Kiểm tra trạng thái hiển thị
  // KHÔNG làm gì nếu control bị ẩn (không render, không tăng index)
  if (node.props.isVisible === false) {
    return null; // Không render
} 
  // 2. TĂNG BỘ ĐẾM: Chỉ tăng khi control được render (isVisible != false)
  indexRef.current += 1;
  const sequentialIndex = indexRef.current/2;

  // --- KẾT THÚC LOGIC QUẢN LÝ SỐ THỨ TỰ ---

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative border p-3 rounded mb-2 cursor-pointer ${
        selected ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      style={isDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}
    >
      {/* 📌 HIỂN THỊ SỐ THỨ TỰ */}
      <span className="absolute top-1 left-1 text-xs font-mono bg-blue-500 text-white px-1 py-0.5 rounded z-10">
          #{sequentialIndex}
      </span>

      {/* Remove button */}
      <button
        className="absolute top-1 right-1 text-red-500 font-bold hover:text-red-700 z-10"
        onClick={(e) => {
          e.stopPropagation();
          removeComponent(node.id);
        }}
        title={`Remove ${name}`}
      >
        <Trash2 size={14} />
      </button>

      {/* --- RENDER CÁC CONTROL --- */}
      {/* (Phần render JSX của các control giữ nguyên như lần trước) */}

      {/* Input Field */}
      {node.type === "input" && (
        <input
          className="border p-2 w-full bg-white text-sm"
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
        <div className="mt-3 ml-3 border-l border-dashed pl-3">
          {node.children.map((childNode) => (
            // TRUYỀN LẠI indexRef để children tiếp tục sử dụng bộ đếm toàn cục
            <RenderNode key={childNode.id} node={childNode} onClick={onClick} indexRef={indexRef} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderNode;