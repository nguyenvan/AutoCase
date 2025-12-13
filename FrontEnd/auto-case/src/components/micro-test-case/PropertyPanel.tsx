import React from 'react';
import { useDesignStore } from '../../store/useDesignStore';
import type { BaseProps, ComponentNode } from '../../types/design-types';
import { COMMON_PROPS, CONTROL_PROPERTIES } from '@/utils/constants';

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
}

interface CheckboxGroupProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, type = 'text' }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      className="border border-gray-300 rounded p-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);


const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, checked, onChange }) => (
  <div className="flex items-center mb-3">
    <input
      id={`checkbox-${label.replace(/\s/g, '')}`}
      type="checkbox"
      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <label htmlFor={`checkbox-${label.replace(/\s/g, '')}`} className="ml-2 text-sm font-medium text-gray-700">
      {label}
    </label>
  </div>
);



// --- Component Chính: PropertyPanel ---

const PropertyPanel: React.FC = () => {

  const { selectedId, components, updateProps } = useDesignStore();
  if (!selectedId) {
    return <div className="p-4 text-gray-500">Vui lòng chọn một Component</div>;
  }

  // Ép kiểu để sử dụng Index Signature
  const component = components.find((c) => c.id === selectedId) as ComponentNode | undefined;

  if (!component) {
    return <div className="p-4 text-red-500">Không tìm thấy Component</div>;
  }

  const props: BaseProps = component.props || {};
  const componentType = component.type;

  const handleChange = (key: string, value: any) => {
    updateProps(component.id, {
      ...props,
      [key]: value,
    });
  };

  const specificFields = CONTROL_PROPERTIES[componentType] || [];

  return (
    <div className="p-4 border-l border-gray-300 w-80 bg-gray-50 overflow-y-auto h-full">
      <h3 className="font-bold mb-4 text-lg text-gray-800 border-b pb-2">
        🛠️ Property ({componentType.toUpperCase()})
      </h3>

      {/* 1. Render Thuộc tính Chung (Name, Xpath) */}
      {COMMON_PROPS.map((field) => (
        <InputGroup
          key={field.key}
          label={field.label}
          // Sử dụng Index Signature để truy cập props[field.key]
          value={props[field.key] ?? field.defaultValue ?? ''}
          onChange={(value) => handleChange(field.key as string, value)}
        />
      ))}

      <hr className="my-4" />

      {/* 2. Render Thuộc tính Đặc thù theo loại Component */}
      {specificFields.map((field) => {
        const currentValue = props[field.key] ?? field.defaultValue;

        if (field.type === 'boolean') {
          return (
            <CheckboxGroup
              key={field.key}
              label={field.label}
              checked={!!currentValue}
              onChange={(checked) => handleChange(field.key as string, checked)}
            />
          );
        }

        if (field.type === 'text' || field.type === 'number') {
          return (
            <InputGroup
              key={field.key}
              label={field.label}
              value={currentValue ?? ''}
              onChange={(value) => handleChange(field.key as string, value)}
              type={field.type}
            />
          );
        }

        if (field.type === 'select' && field.options) {
          return (
            <div key={field.key} className="mb-3">
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <select
                className="border border-gray-300 rounded p-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                value={currentValue}
                onChange={(e) => handleChange(field.key as string, e.target.value)}
              >
                {field.options.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        return null;
      })}

      {specificFields.length === 0 && (
        <p className="text-sm text-gray-500">No specific attributes are defined for this Component type.</p>
      )}
    </div>
  );
};

export default PropertyPanel;