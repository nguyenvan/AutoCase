import React from "react";
import { useDesignStore } from "../../store/useDesignStore";
import type { ComponentNode } from "../../types/design-types"; // Đảm bảo import đúng

type Props = {
  node: ComponentNode;
  onClick: () => void;
};

const RenderNode: React.FC<Props> = ({ node, onClick }) => {
  const { removeComponent, selectedId } = useDesignStore();
  const selected = selectedId === node.id;

  // Sử dụng một số thuộc tính phổ biến
  const name = node.props.name || node.type.charAt(0).toUpperCase() + node.type.slice(1);
  const isDisabled = node.props.isDisable ?? false;

  // Render dựa trên trạng thái hiển thị
  if (node.props.isVisible === false) {
    return null; // Không render nếu isVisible là false
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative border p-3 rounded mb-2 cursor-pointer ${
        selected ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      // Thêm trạng thái disabled trực quan cho khối container
      style={isDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}
    >
      {/* Remove button */}
      <button
        className="absolute top-1 right-1 text-red-500 font-bold hover:text-red-700 z-10"
        onClick={(e) => {
          e.stopPropagation();
          removeComponent(node.id);
        }}
        title={`Remove ${name}`}
      >
        ✕
      </button>

      {/* --- RENDER CÁC CONTROL --- */}

      {/* Input Field */}
      {node.type === "input" && (
        <input
          className="border p-2 w-full bg-white text-sm"
          placeholder={node.props.placeholder || name}
          disabled={isDisabled}
          type={node.props.type || "text"} // Sử dụng type từ props
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

      {/* --- CONTROL BỔ SUNG --- */}
      
      {/* Dropdown (Select/ComboBox) */}
      {node.type === "dropdown" && (
        <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">{name}:</label>
            <select
                className="border p-2 rounded bg-white text-sm w-fit"
                disabled={isDisabled}
                value={node.props.valueField || node.props.defaultOption}
            >
                {/* Mô phỏng các tùy chọn */}
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
                type="checkbox" // Giả định là checkbox (hoặc có thể dùng radio nếu có groupName)
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={node.props.isChecked ?? false} // Sử dụng isChecked
                disabled={isDisabled}
                // Dùng pointerEvents: none để ngăn chặn toggle thay đổi trạng thái khi click
                style={{ pointerEvents: 'none' }} 
            />
            <label className="text-sm text-gray-700">{name || "Toggle Control"}</label>
        </div>
      )}
      
      {/* Render children recursively (nếu cần) */}
      {node.children && node.children.length > 0 && (
        <div className="mt-3 ml-3 border-l border-dashed pl-3">
          {node.children.map((childNode) => (
            <RenderNode key={childNode.id} node={childNode} onClick={onClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderNode;