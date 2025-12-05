import React from "react";
import { useDesignStore } from "../../store/useDesignStore";
import type { ComponentNode } from "../../types/design-types";

type Props = {
  node: ComponentNode;
  onClick: () => void;
};

const RenderNode: React.FC<Props> = ({ node, onClick }) => {
  const { removeComponent, selectedId } = useDesignStore();
  const selected = selectedId === node.id;

  return (
    <div

      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative border p-3 rounded mb-2 cursor-pointer ${selected ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
    >

      {/* Remove button */}
      {(
        <button
          className="absolute top-1 right-1 text-red-500 font-bold"
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(node.id);
          }}
        >
          ✕
        </button>
      )}

      {node.type === "input" && (
        <input
          className="border p-2 w-full"
          placeholder={node.props.name || "Input"}
          disabled={node.props.isDisable}
        />
      )}

      {node.type === "button" && (
        <button className="px-3 py-1 rounded bg-blue-600 text-white">
          {node.props.name || "Button"}
        </button>
      )}

      {node.type === "link" && (
        <a className="text-blue-600 underline" style={{ pointerEvents: node.props.isDisable ? "none" : "auto" }}>
          {node.props.name || "Link"}
        </a>
      )}

      {node.type === "grid" && (
        <div className="border p-2 bg-gray-50">
          <p>{node.props.name || "Grid Table"}</p>
        </div>
      )}
    </div>
  );
};

export default RenderNode;