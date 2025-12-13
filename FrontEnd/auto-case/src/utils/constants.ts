export const API_URL = 'http://localhost:5000';
// Định nghĩa loại item DND
export const ItemTypes = {
  NODE: 'node',
  TOOLBOX_ITEM: 'toolbox-item'
};
// src/constants/ControlProperties.ts (hoặc tương tự)

// --- 1. Định nghĩa Kiểu Cơ sở (BaseProps - Giả định) ---
// Giả định BaseProps là tập hợp các thuộc tính chung mà mọi control đều có, ví dụ:
interface BaseProps {
    name: string;
    xpath: string;
    isDisable?: boolean;
    isVisible?: boolean;
    // ... các thuộc tính cơ bản khác
}

// --- 2. Định nghĩa Kiểu Cấu hình Thuộc tính (PropertyConfig) ---

// Các loại input editor mà UI Property Panel sẽ hiển thị
type PropertyInputType = 'text' | 'boolean' | 'number' | 'select';

type PropertyConfig = {
    /** Key được sử dụng trong ComponentProps (Key của giá trị) */
    key: keyof BaseProps | string; 
    /** Label hiển thị trong Property Panel */
    label: string;
    /** Loại Input Control trong Property Panel */
    type: PropertyInputType; 
    /** Giá trị mặc định (Tùy chọn) */
    defaultValue?: any;
    /** Tùy chọn cho type='select' */
    options?: string[]; 
};

// --- 3. Định nghĩa Cấu trúc của CONTROL_PROPERTIES ---
type ControlType = 'input' | 'button' | 'link' | 'toggle' | 'dropdown' | 'grid' | string;

type ControlPropertiesMap = {
    [key in ControlType]: PropertyConfig[];
};


// --- 4. Định nghĩa CONSTANTS ---

/**
 * Các thuộc tính chung mà mọi control đều phải có.
 * Thường bao gồm định danh và bộ định vị (locator).
 */
export const COMMON_PROPS: PropertyConfig[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'xpath', label: 'XPath / Selector', type: 'text' },
];

/**
 * Cấu hình các thuộc tính dành riêng cho từng loại UI Control.
 */
export const CONTROL_PROPERTIES: ControlPropertiesMap = {
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
        // Thuộc tính 'availableOptions' được coi là Text để người dùng nhập JSON/CSV
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
        // Thuộc tính 'headerColumns' được coi là Text để người dùng nhập JSON/CSV
        { key: 'headerColumns', label: 'Header Columns (JSON/CSV)', type: 'text' },
        { key: 'isSortable', label: 'Is Sortable', type: 'boolean', defaultValue: false },
    ],
};