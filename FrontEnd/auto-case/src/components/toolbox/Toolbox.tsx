import React from "react";
import { ToolboxItem } from "./ToolboxItem";

export const Toolbox: React.FC = () => {
  return (
    <div className="w-40 p-3 border rounded-lg bg-gray-50 shadow-md h-fit">
      <h3 className="font-semibold text-sm mb-3">Toolbox</h3>

      <div className="flex flex-col gap-2">
        <ToolboxItem type="input" label="Input Field" icon="Form" />
        <ToolboxItem type="button" label="Button" icon="Square" />
        <ToolboxItem type="link" label="Link" icon="Link" />
        <ToolboxItem type="grid" label="Grid" icon="Table" />
      </div>
    </div>
  );
};
