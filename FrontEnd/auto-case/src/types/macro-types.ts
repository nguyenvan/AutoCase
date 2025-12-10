// src/types/macro-types.ts

// 1. Kiểu dữ liệu cho Micro Case có sẵn (được dùng trong Toolbox)
// Đây là kiểu dữ liệu bạn nhận được từ API khi fetch danh sách Micro Test Cases
export interface IMicroTestCaseSummary {
    id: string; // ID của Micro Case
    testCaseName: string; // Tên của Micro Case
    description: string; // Mô tả ngắn
    // Có thể thêm trạng thái (status), tag, v.v.
}

// 2. Kiểu dữ liệu cho một Step (Bước) trong Macro Flow
// Đây là một "thể hiện" của Micro Case trong Macro Flow
export interface MacroFlowStep {
    stepId: string; // ID duy nhất của bước này (Dùng cho key React và sắp xếp)
    microCaseId: string; // ID của Micro Case được sử dụng
    name: string; // Tên (copy từ Micro Case)
    
    // Dữ liệu đầu vào:
    // Tạm thời để trống. Sau này sẽ là object chứa các giá trị cụ thể
    inputData: { [key: string]: any }; 
}

// 3. Kiểu dữ liệu chính cho Macro Flow
export interface MacroFlow {
    id?: string;
    name: string;
    description: string;
    steps: MacroFlowStep[];
    status: 'Draft' | 'Active' | 'Archived';
}

