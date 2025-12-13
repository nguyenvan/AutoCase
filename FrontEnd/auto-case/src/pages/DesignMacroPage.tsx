import DesignMarcoCanvas from "@/components/macro-test-case/DesignMacroCanvas";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
export const DesignMacroPage = () => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 h-full">
        <DndProvider backend={HTML5Backend}>
          <div className="flex-1 h-full p-4">
            <DesignMarcoCanvas />
          </div>
        </DndProvider>
      </div>
    </div>
  );
};
