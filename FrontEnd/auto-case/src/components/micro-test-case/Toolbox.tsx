import React from "react";
import { ToolboxItem } from "./ToolboxItem";

export const Toolbox: React.FC = () => {
  return (
    <div className="w-40 p-3 border rounded-lg bg-gray-50 shadow-md h-fit">
      <h3 className="font-semibold text-sm mb-3 text-gray-800">🛠️ Toolbox</h3>

      <div className="flex flex-col gap-2">
        {/* 1. Input Field */}
        <ToolboxItem type="input" label="Input Field" icon="TextCursorInput" />
        
        {/* 2. Button */}
        <ToolboxItem type="button" label="Button" icon="Square" />
        
        {/* 3. Link */}
        <ToolboxItem type="link" label="Link" icon="Link" />
        
        {/* 4. Grid / Table */}
        <ToolboxItem type="grid" label="Grid / Table" icon="Table" />
        
        {/* --- CÁC CONTROL CÒN THIẾU --- */}
        
        {/* 5. Toggle (Checkbox/Radio Button) */}
        {/* Sử dụng CheckSquare hoặc ToggleLeft để đại diện cho trạng thái bật/tắt */}
        <ToolboxItem type="toggle" label="Checkbox/Radio" icon="ToggleLeft" /> 
        
        {/* 6. Dropdown (Select/ComboBox) */}
        {/* Sử dụng List or ChevronDown để đại diện cho danh sách thả xuống */}
        <ToolboxItem type="dropdown" label="Dropdown" icon="ListChecks" /> 
      </div>
    </div>
  );
};