import React from "react";
import { useDesignStore } from "../../store/useDesignStore";

const PropertyPanel: React.FC = () => {
  const { selectedId, components, updateProps } = useDesignStore();

  if (!selectedId) return <div className="p-4">Select a component</div>;

  const component = components.find((c) => c.id === selectedId);
  if (!component) return <div className="p-4">No component found</div>;

  const props = component.props || {};

  const handleChange = (key: string, value: any) => {
    updateProps(component.id, {
      ...props,
      [key]: value,
    });
  };

  return (
    <div className="p-4 border-l border-gray-300 w-80 bg-white">
      <h3 className="font-bold mb-4">Properties</h3>

      {/* Shared properties */}
      <label className="block text-sm font-medium">Name</label>
      <input
        className="border p-2 w-full mb-3"
        value={props.name ?? ""}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <label className="block text-sm font-medium">Xpath</label>
      <input
        className="border p-2 w-full mb-3"
        value={props.xpath ?? ""}
        onChange={(e) => handleChange("xpath", e.target.value)}
      />

      {/* Component-specific properties */}
      {component.type === "input" && (
        <>
          <label className="block text-sm font-medium">Value Field</label>
          <input
            className="border p-2 w-full mb-3"
            value={props.valueField ?? ""}
            onChange={(e) => handleChange("valueField", e.target.value)}
          />

          <label className="block text-sm font-medium">Error Message</label>
          <input
            className="border p-2 w-full mb-3"
            value={props.errorMessage ?? ""}
            onChange={(e) => handleChange("errorMessage", e.target.value)}
          />

          {/* Boolean fields */}
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={props.isRequired ?? false}
              onChange={(e) => handleChange("isRequired", e.target.checked)}
            />
            <span className="ml-2">Is Required</span>
          </div>
        </>
      )}

      {(component.type === "input" ||
        component.type === "button" ||
        component.type === "link" ||
        component.type === "grid") && (
          <>
            {/* ValueField for Button + Link */}
            {(component.type === "button" ||
              component.type === "link") && (
                <>
                  <label className="block text-sm font-medium">Value Field</label>
                  <input
                    className="border p-2 w-full mb-3"
                    value={props.valueField ?? ""}
                    onChange={(e) => handleChange("valueField", e.target.value)}
                  />
                </>
              )}

            {/* Shared booleans */}
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={props.isDisable ?? false}
                onChange={(e) => handleChange("isDisable", e.target.checked)}
              />
              <span className="ml-2">Is Disable</span>
            </div>

            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={props.isVisible ?? true}
                onChange={(e) => handleChange("isVisible", e.target.checked)}
              />
              <span className="ml-2">Is Visible</span>
            </div>
          </>
        )}
    </div>
  );
};

export default PropertyPanel;
