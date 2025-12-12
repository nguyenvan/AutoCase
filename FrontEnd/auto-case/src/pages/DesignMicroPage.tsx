import DesignCanvas from "@/components/micro-test-case/DesignCanvas";
import PropertyPanel from "../components/micro-test-case/PropertyPanel";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
export const DesignPage = () => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 h-full">
        <DndProvider backend={HTML5Backend}>
          <div className="flex-1 h-full p-4">
            <DesignCanvas />
          </div>
        </DndProvider>
        <div className="w-80 border-l">
          <PropertyPanel />
        </div>
      </div>
    </div>
  );
};
