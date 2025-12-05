import { icons } from "lucide-react";
import type { FC } from "react";
import { useDrag } from "react-dnd";
interface ToolboxItemProps {
  type: string;
  label: string;
   icon: keyof typeof icons;
}

export const ToolboxItem: FC<ToolboxItemProps> = ({ type, label, icon  }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "toolbox-item",
    item: { type },
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
       <span className="text-sm">{label}</span>
    </div>
  );
};
