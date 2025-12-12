import React, { useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { useParams, useNavigate } from "react-router-dom"; // Import thêm useParams và useNavigate
import type { ComponentNode, BaseProps } from "../../types/design-types";
import { useDesignStore } from "../../store/useDesignStore";
import { Toolbox } from "./Toolbox";
import RenderNode from "./RenderNode";


const DesignCanvas: React.FC = () => {
    // 1. Lấy ID từ URL
    const { id } = useParams<{ id: string }>(); // ID chỉ tồn tại khi Edit
    const navigate = useNavigate();

    const {
        components,
        addComponent,
        setSelected,
        testCaseName,
        setTestCaseName,
        description, // Lấy description
        setDescription, // Lấy setDescription
        saveDesign,
        fetchDesignForEdit, // Lấy hàm tải dữ liệu
        resetState, // Lấy hàm reset state
        loading,
        error,
        selectedId
    } = useDesignStore();

    const dropRef = useRef<HTMLDivElement>(null);

    // 2. Logic Load Dữ liệu khi ở chế độ Edit
    useEffect(() => {
        if (id) {
            const loadData = async () => {
                await fetchDesignForEdit(id); // Chỉ cần gọi fetch ở đây
            };
            loadData();
        } else {
            resetState();
        }
    }, [id, fetchDesignForEdit, resetState]);


    // ⭐ EFFECT MỚI: Tự động chọn component sau khi TẢI XONG
    useEffect(() => {
        // Điều kiện CHÍNH:
        // 1. Phải có components
        // 2. VÀ, KHÔNG CÓ selectedId (nghĩa là chưa có gì được chọn)
        if (components.length > 0 && !selectedId) {
            // Lấy ID của component đầu tiên
            const firstComponentId = components[0].id;

            // Chỉ set khi chưa có gì được chọn
            setSelected(firstComponentId);
        }

        // Dependency Array: Cần cả components (để chạy khi data load) 
        // và selectedId (để không chạy nếu đã có ID)
    }, [components, selectedId, setSelected]);
    // ----------------------------------------------------

    // Logic DND để thêm component mới từ Toolbox (Giữ nguyên)
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "toolbox-item",
        drop: (item: { type: string }) => {
            const defaultProps: BaseProps = {
                name: "",
                xpath: "",
                valueField: "",
                isRequire: false,
                isRequired: false,
                isDisable: false,
                isVisible: true,
                errorMessage: "",
            };

            const newComponent: ComponentNode = {
                id: crypto.randomUUID(),
                type: item.type as ComponentNode["type"],
                props: defaultProps,
                children: [],
            };
            addComponent(newComponent);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [addComponent]);

    drop(dropRef);

    // ⭐ 3. Hàm xử lý nút Lưu/Cập nhật
    const handleSave = async () => {
        // Truyền ID vào hàm saveDesign. Nếu là Edit thì ID tồn tại, nếu là New thì ID là undefined.
        const success = await saveDesign(id);

        if (success && !id) {
            // Nếu là tạo mới thành công, chuyển hướng về trang danh sách (hoặc trang chỉnh sửa vừa tạo)
            navigate('/micro-cases');
        } else if (success && id) {
            // Nếu cập nhật thành công, có thể giữ nguyên trang hoặc thông báo
        }
    };

    // --- RENDER LOGIC: Xử lý trạng thái tải/lỗi ---
    if (loading) {
        return <div className="p-8 text-center text-blue-600">Đang tải Test Case (ID: {id})...</div>;
    }
    if (error) {
        return <div className="p-8 text-center text-red-600">Lỗi: {error}</div>;
    }

    return (
        <div className="flex flex-col gap-4 p-4 border rounded bg-gray-50 h-full">

            {/* ⭐ TEST CASE INFO HEADER (Thêm Description) */}
            <div className="flex flex-col gap-3 border-b pb-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">
                        {id ? `Chỉnh sửa: ${testCaseName}` : 'Tạo Micro Test Case Mới'}
                    </h1>
                    <button
                        onClick={handleSave}
                        className="ml-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-150 shadow-md"
                    >
                        {id ? '💾 Cập Nhật' : '💾 Lưu Test Case'}
                    </button>
                </div>

                {/* Input Tên Test Case */}
                <div className="flex items-center gap-3">
                    <label className="font-medium w-40 text-gray-700">Tên Test Case:</label>
                    <input
                        value={testCaseName}
                        onChange={(e) => setTestCaseName(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        placeholder="Enter test case name (e.g., LOGIN_SUCCESS)"
                    />
                </div>

                {/* Input Mô tả */}
                <div className="flex items-start gap-3">
                    <label className="font-medium w-40 text-gray-700 pt-2">Mô tả:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        placeholder="Mô tả ngắn gọn về chức năng của test case này"
                    />
                </div>
            </div>

            {/* --- TWO COLUMN LAYOUT --- */}
            <div className="flex h-full gap-4">

                {/* LEFT COLUMN – TOOLBOX */}
                <div className="w-[180px] border border-gray-300 rounded bg-white p-2 h-fit shadow-md">
                    <Toolbox />
                </div>

                {/* RIGHT COLUMN – DESIGN AREA (Vùng thả) */}
                <div
                    ref={dropRef}
                    className={`flex-1 min-h-[500px] border p-4 bg-white rounded shadow-md transition duration-150
                        ${isOver ? "bg-blue-50 border-blue-500 border-2" : "border-gray-300 border-dashed"}`}
                    onClick={() => setSelected(null)} // Click vào Canvas để bỏ chọn
                >
                    {components.length === 0 ? (
                        <p className="text-gray-400 text-center pt-10">
                            Drag items from the Toolbox here to start building your test case...
                        </p>
                    ) : (
                        components.map((c) => (
                            <RenderNode
                                key={c.id}
                                node={c}
                                onClick={(e) => { e.stopPropagation(); setSelected(c.id); }}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DesignCanvas;