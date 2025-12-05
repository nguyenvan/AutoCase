import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import type { ComponentNode } from "../../types/design-types";
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

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "toolbox-item",
    drop: (item: { type: string }) => {
      const newComponent: ComponentNode = {
        id: crypto.randomUUID(),
        type: item.type as ComponentNode["type"],
        props: {
          name: "",
          xpath: "",
          valueField: "",
          isRequired: false,
          isDisable: false,
          isVisible: true,
          errorMessage: "",
        },
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;
