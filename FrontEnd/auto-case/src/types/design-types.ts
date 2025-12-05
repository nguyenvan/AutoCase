export type BaseProps = {
  name?: string; // Tên hiển thị/logic của control
  xpath?: string; // Bộ định vị (locator)
  valueField?: string; // Giá trị ánh xạ từ data driver/dữ liệu đầu vào
  isRequired?: boolean; // Có bắt buộc nhập không
  isDisable?: boolean; // Trạng thái bị vô hiệu hóa
  isVisible?: boolean; // Trạng thái hiển thị
  errorMessage?: string; // Thông báo lỗi xác thực
  [key: string]: any; // Index Signature quan trọng
};

export type InputProps = BaseProps & {
  type?: 'text' | 'password' | 'email' | 'number'; // Kiểu nhập liệu
  maxLength?: number; // Giới hạn số ký tự
  placeholder?: string; // Văn bản giữ chỗ
};

export type ButtonProps = Omit<BaseProps, 'isRequired' | 'errorMessage'> & {
  actionType?: 'submit' | 'click' | 'reset'; // Loại hành động
  tooltipText?: string; // Văn bản hiển thị khi hover
};

export type LinkProps = Omit<BaseProps, 'isRequired' | 'errorMessage'> & {
  href?: string; // URL đích (Hyperlink Reference)
  isExternal?: boolean; // Có phải là link ngoài không
};

export type ToggleProps = Omit<BaseProps, 'errorMessage'> & {
  // Thay thế isRequired/errorMessage bằng thuộc tính trạng thái
  isChecked?: boolean; // Trạng thái đã được check/chọn
  groupName?: string; // Tên nhóm (chủ yếu cho Radio Button)
};

export type DropdownProps = Omit<BaseProps, 'errorMessage'> & {
  // Bỏ errorMessage vì xác thực thường là kiểm tra 'isRequired'
  defaultOption?: string; // Giá trị mặc định được chọn
  availableOptions?: string[]; // Danh sách tất cả các lựa chọn khả dụng
  selectionType?: 'single' | 'multiple'; // Có cho phép chọn nhiều không
};

export type GridProps = Omit<BaseProps, 'valueField' | 'isRequired' | 'errorMessage'> & {
  headerColumns?: string[]; // Danh sách tên các cột
  rowCount?: number; // Số lượng hàng dự kiến
  isSortable?: boolean; // Có thể sắp xếp dữ liệu không
};


export type ComponentNode = {
  id: string;
  type: "input" | "button" | "link" | "grid"| "dropdown" | "toggle"; // Mở rộng thêm các loại control khác nếu cần
  props: BaseProps ;
  children: ComponentNode[];
};