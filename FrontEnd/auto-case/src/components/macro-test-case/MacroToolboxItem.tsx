import { icons } from "lucide-react";
import type { FC } from "react";
import { useDrag } from "react-dnd";

interface MacroToolboxItemProps {
  id: string;
  name: string;
  description: string;
  type: string;

  icon: keyof typeof icons;
}

export const MacroToolboxItem: FC<MacroToolboxItemProps> = ({ id, name, description, type, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    id: id,
    type: "toolbox-item",
    item: {
      type: type, // Vẫn giữ type cho mục đích DND
      microCaseId: id, // ID Micro Case thực tế
      microName: name, // Tên Micro Case
      description: description // Mô tả
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const Icon = icons[icon];
  return drag(
    <div
      className={`flex items-center gap-2 px-3 py-2 border rounded cursor-grab bg-white shadow-sm hover:bg-gray-100
       ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <Icon size={16} />
      <span className="text-sm">{name}</span>

    </div>
  );
};