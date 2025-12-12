import React from 'react';
import { useDesignStore } from '../../store/useDesignStore';
// Import tất cả các kiểu đã định nghĩa của bạn từ file types/control.ts
import type { BaseProps, ComponentNode } from '../../types/design-types';

// --- Component Phụ Trợ (Giữ nguyên) ---

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
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

interface CheckboxGroupProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

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

// --- Cấu hình Thuộc tính theo Control Type ---

type PropertyConfig = {
  key: keyof BaseProps | string;
  label: string;
  type: 'text' | 'boolean' | 'number' | 'select'; // Thêm 'select' cho Dropdown/Type
  defaultValue?: any;
  options?: string[]; // Cho select input
};

const COMMON_PROPS: PropertyConfig[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'xpath', label: 'XPath / Selector', type: 'text' },
];

const CONTROL_PROPERTIES: { [key: string]: PropertyConfig[] } = {
  // --- InputProps ---
  input: [
    { key: 'valueField', label: 'Value Field', type: 'text' },
    { key: 'errorMessage', label: 'Error Message', type: 'text' },
    { key: 'isRequired', label: 'Is Required', type: 'boolean', defaultValue: false },
    { key: 'isDisable', label: 'Is Disable', type: 'boolean', defaultValue: false },
    { key: 'isVisible', label: 'Is Visible', type: 'boolean', defaultValue: true },
    { key: 'maxLength', label: 'Max Length', type: 'number' },
    { key: 'placeholder', label: 'Placeholder', type: 'text' },
    {
      key: 'type',
      label: 'Input Type',
      type: 'select',
      options: ['text', 'password', 'email', 'number'],
      defaultValue: 'text'
    },
  ],

  // --- ButtonProps ---
  button: [
    { key: 'valueField', label: 'Value Field (Text/Key)', type: 'text' },
    { key: 'isDisable', label: 'Is Disable', type: 'boolean', defaultValue: false },
    { key: 'isVisible', label: 'Is Visible', type: 'boolean', defaultValue: true },
    { key: 'tooltipText', label: 'Tooltip Text', type: 'text' },
    {
      key: 'actionType',
      label: 'Action Type',
      type: 'select',
      options: ['submit', 'click', 'reset'],
      defaultValue: 'click'
    },
  ],

  // --- LinkProps ---
  link: [
    { key: 'valueField', label: 'Link Text', type: 'text' },
    { key: 'isDisable', label: 'Is Disable', type: 'boolean', defaultValue: false },
    { key: 'isVisible', label: 'Is Visible', type: 'boolean', defaultValue: true },
    { key: 'href', label: 'Href (URL)', type: 'text' },
    { key: 'isExternal', label: 'Is External Link', type: 'boolean', defaultValue: false },
  ],

  // --- ToggleProps (Checkbox/Radio) ---
  toggle: [
    { key: 'valueField', label: 'Value Field (Key)', type: 'text' },
    { key: 'isRequired', label: 'Is Required', type: 'boolean', defaultValue: false },
    { key: 'isDisable', label: 'Is Disable', type: 'boolean', defaultValue: false },
    { key: 'isVisible', label: 'Is Visible', type: 'boolean', defaultValue: true },
    { key: 'isChecked', label: 'Is Checked/Selected', type: 'boolean', defaultValue: false },
    { key: 'groupName', label: 'Group Name (Radio)', type: 'text' },
  ],

  // --- DropdownProps ---
  dropdown: [
    { key: 'valueField', label: 'Selected Value', type: 'text' },
    { key: 'isRequired', label: 'Is Required', type: 'boolean', defaultValue: false },
    { key: 'isDisable', label: 'Is Disable', type: 'boolean', defaultValue: false },
    { key: 'isVisible', label: 'Is Visible', type: 'boolean', defaultValue: true },
    { key: 'defaultOption', label: 'Default Option', type: 'text' },
    // Thuộc tính 'availableOptions' là Array, cần component phức tạp hơn, tạm để dạng Text/JSON
    { key: 'availableOptions', label: 'Available Options (JSON/CSV)', type: 'text' },
    {
      key: 'selectionType',
      label: 'Selection Type',
      type: 'select',
      options: ['single', 'multiple'],
      defaultValue: 'single'
    },
  ],

  // --- GridProps ---
  grid: [
    { key: 'isDisable', label: 'Is Disable', type: 'boolean', defaultValue: false },
    { key: 'isVisible', label: 'Is Visible', type: 'boolean', defaultValue: true },
    { key: 'rowCount', label: 'Expected Row Count', type: 'number' },
    // Thuộc tính 'headerColumns' là Array, tạm để dạng Text/JSON
    { key: 'headerColumns', label: 'Header Columns (JSON/CSV)', type: 'text' },
    { key: 'isSortable', label: 'Is Sortable', type: 'boolean', defaultValue: false },
  ],
};

// --- Component Chính: PropertyPanel ---

const PropertyPanel: React.FC = () => {
  
  const { selectedId, components, updateProps } = useDesignStore();
  console.log("PropertyPanel Rendered with selectedId:", selectedId);
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
        <p className="text-sm text-gray-500">Không có thuộc tính đặc thù nào được định nghĩa cho loại Component này.</p>
      )}
    </div>
  );
};

export default PropertyPanel;