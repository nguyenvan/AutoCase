import DesignCanvas from "../components/design-canvas/DesignCanvas";
import PropertyPanel from "../components/property-panel/PropertyPanel";
export const DesignPage = () => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 h-full">
        {/* IMPORTANT: Make sure parent of DesignCanvas is full height */}
        <div className="flex-1 h-full p-4">
          <DesignCanvas />
        </div>
        <div className="w-80 border-l">
          <PropertyPanel />
        </div>
      </div>
    </div>
  );
};
