// src/routes/designRoutes.ts
import express, { Request, Response } from 'express';
import { MicroTestCase, IMicroTestCase } from '../models/MicroTestCase';
import { IComponentNode } from '../models/ComponentNode';
import { IFlowStep, IMacroTestCase, MacroTestCase } from '../models/MacroTestCase';

const router = express.Router();

// Định nghĩa kiểu cho Body khi lưu Micro Test Case
interface SaveMicroCaseBody {
    name: string;
    components: IComponentNode[];
    testData?: Record<string, any>;
    description?: string;
}

/* --- API CHO MICRO TEST CASES (CRUD) --- */

// @route   POST /api/design/micro
// @desc    Lưu (hoặc Cập nhật) một Micro Test Case
router.post('/micro', async (req: Request<{}, {}, SaveMicroCaseBody>, res: Response) => {
    const { name, components, testData, description } = req.body;

    if (!name || !components) {
        return res.status(400).json({ msg: 'Tên và cấu trúc component là bắt buộc.' });
    }

    try {
        // Tìm kiếm theo tên (để cập nhật nếu tồn tại)
        let microCase: IMicroTestCase | null = await MicroTestCase.findOne({ name });

        if (microCase) {
            // Cập nhật bản ghi hiện có
            microCase.components = components;
            microCase.testData = testData || {};
            microCase.description = description || '';
            await microCase.save();
            return res.json({ msg: 'Micro Test Case đã được cập nhật.', id: microCase._id });
        } else {
            // Tạo bản ghi mới
            const newCase = new MicroTestCase({ name, components, testData, description });
            const result = await newCase.save();
            return res.status(201).json({ msg: 'Micro Test Case đã được lưu.', id: result._id });
        }
    } catch (err) {
        const error = err as any;
        console.error(error.message);
        if (error.code === 11000) {
            return res.status(409).json({ msg: 'Đã tồn tại test case với tên này.' });
        }
        res.status(500).send('Lỗi Server');
    }
});

// @route   GET /api/design/micro
// @desc    Lấy tất cả các Micro Test Case (chỉ tên, ID, mô tả)
router.get('/micro', async (req: Request, res: Response) => {
    try {
        // Chỉ chọn các trường cần thiết cho trang danh sách
        const cases = await MicroTestCase.find().select('name description createdAt');
        res.json(cases);
    } catch (err) {
        const error = err as Error;
        console.error(error.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   GET /api/design/micro/:id
// @desc    Lấy chi tiết một Micro Test Case (dùng để load vào Design Canvas)
router.get('/micro/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const microCase = await MicroTestCase.findById(req.params.id);
        if (!microCase) {
            return res.status(404).json({ msg: 'Không tìm thấy Micro Test Case' });
        }
        res.json(microCase);
    } catch (err) {
        const error = err as Error;
        console.error(error.message);
        res.status(500).send('Lỗi Server');
    }
});


// @route   DELETE /api/design/micro/:id
// @desc    Xóa một Micro Test Case theo ID
router.delete('/micro/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const idToDelete = req.params.id;

        //1. Kiểm tra xem Test Case có đang được sử dụng trong bất kỳ Macro Test Case nào không (TÙY CHỌN, nên làm)
        const isUsed = await MacroTestCase.findOne({ 'flow.microTestCaseId': idToDelete });
        if (isUsed) {
            return res.status(409).json({ msg: 'Không thể xóa. Test Case này đang được sử dụng trong ít nhất một Macro Flow.' });
        }

        // 2. Thực hiện xóa
        const result = await MicroTestCase.findByIdAndDelete(idToDelete);

        if (!result) {
            // Trường hợp không tìm thấy ID
            return res.status(404).json({ msg: 'Không tìm thấy Micro Test Case cần xóa.' });
        }

        // 3. Xóa thành công
        res.status(200).json({ msg: `Micro Test Case ID: ${idToDelete} đã được xóa thành công.`, id: idToDelete });

    } catch (err) {
        const error = err as Error;
        console.error(`Lỗi khi xóa Micro Test Case: ${error.message}`);
        // Lỗi ID không hợp lệ (ví dụ: chuỗi quá ngắn)
        if (error.name === 'CastError') {
            return res.status(400).json({ msg: 'ID Test Case không hợp lệ.' });
        }
        res.status(500).send('Lỗi Server khi thực hiện xóa');
    }
});

// @route   PUT /api/design/micro/:id
// @desc    Cập nhật một Micro Test Case theo ID
router.put('/micro/:id', async (req: Request<{ id: string }, {}, IMicroTestCase>, res: Response) => {
    try {
        const idToUpdate = req.params.id;
        const updatedData = req.body;

        // Tùy chọn: Thêm validation cho updatedData ở đây

        // Sử dụng findByIdAndUpdate để tìm và cập nhật tài liệu
        const updatedCase = await MicroTestCase.findByIdAndUpdate(
            idToUpdate,
            updatedData,
            { new: true, runValidators: true } // {new: true} trả về tài liệu sau khi cập nhật
        );

        if (!updatedCase) {
            return res.status(404).json({ msg: 'Không tìm thấy Micro Test Case để cập nhật.' });
        }

        // Trả về dữ liệu đã được cập nhật
        res.status(200).json(updatedCase);

    } catch (err) {
        const error = err as Error;
        console.error(`Lỗi khi cập nhật Micro Test Case: ${error.message}`);
        if (error.name === 'CastError') {
             return res.status(400).json({ msg: 'ID Test Case không hợp lệ.' });
        }
        res.status(500).send('Lỗi Server khi thực hiện cập nhật');
    }
});


/* ------------------------------------------- */
/* --- ⭐ API CHO MACRO TEST CASES (CRUD) ⭐ --- */
/* ------------------------------------------- */
interface SaveMacroCaseBody {
    name: string;
    flow: IFlowStep[];
    description?: string; // Thêm description nếu bạn có nó trong model
}
// @route   POST /api/design/macro (CREATE/UPDATE By Name)
// @desc    Lưu (hoặc Cập nhật) một Macro Test Case
router.post('/macro', async (req: Request<{}, {}, SaveMacroCaseBody>, res: Response) => {
    const { name, flow, description } = req.body;

    if (!name || !flow) {
        return res.status(400).json({ msg: 'Tên và cấu trúc Flow là bắt buộc.' });
    }

    try {
        // Tìm kiếm theo tên (để cập nhật nếu tồn tại)
        let macroCase: IMacroTestCase | null = await MacroTestCase.findOne({ name });

        if (macroCase) {
            // Cập nhật bản ghi hiện có
            macroCase.flow = flow;
            macroCase.description = description || '';
            await macroCase.save();
            return res.json({ msg: 'Macro Test Case đã được cập nhật.', id: macroCase._id });
        } else {
            // Tạo bản ghi mới
            const newCase = new MacroTestCase({ name, flow, description });
            const result = await newCase.save();
            return res.status(201).json({ msg: 'Macro Test Case đã được lưu.', id: result._id });
        }
    } catch (err) {
        const error = err as any;
        console.error(error.message);
        if (error.code === 11000) {
            return res.status(409).json({ msg: 'Đã tồn tại Macro Test Case với tên này.' });
        }
        res.status(500).send('Lỗi Server');
    }
});

// @route   GET /api/design/macro
// @desc    Lấy tất cả các Macro Test Case (chỉ tên, ID, mô tả)
router.get('/macro', async (req: Request, res: Response) => {
    try {
        // Chỉ chọn các trường cần thiết cho trang danh sách
        const cases = await MacroTestCase.find().select('name description createdAt');
        res.json(cases);
    } catch (err) {
        const error = err as Error;
        console.error(error.message);
        res.status(500).send('Lỗi Server');
    }
});

// @route   GET /api/design/macro/:id
// @desc    Lấy chi tiết một Macro Test Case theo ID (dùng để load vào Builder)
router.get('/macro/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        // Có thể thêm .populate('flow.microTestCaseId') nếu bạn muốn chi tiết MicroTestCase
        const macroCase = await MacroTestCase.findById(req.params.id).populate({ // ⭐ PHẢI SỬ DỤNG POPULATE
                path: 'flow.microTestCaseId',
                select: 'name description' // Chỉ lấy tên và mô tả
            });;
        
        if (!macroCase) {
            return res.status(404).json({ msg: 'Không tìm thấy Macro Test Case' });
        }
        res.json(macroCase);
    } catch (err) {
        const error = err as Error;
        console.error(error.message);
        // Xử lý ID không hợp lệ
        if (error.name === 'CastError') {
             return res.status(400).json({ msg: 'ID Macro Test Case không hợp lệ.' });
        }
        res.status(500).send('Lỗi Server');
    }
});

// @route   PUT /api/design/macro/:id
// @desc    Cập nhật một Macro Test Case theo ID
router.put('/macro/:id', async (req: Request<{ id: string }, {}, SaveMacroCaseBody>, res: Response) => {
    try {
        const idToUpdate = req.params.id;
        const updatedData = req.body;

        const updatedCase = await MacroTestCase.findByIdAndUpdate(
            idToUpdate,
            updatedData,
            { new: true, runValidators: true } 
        );

        if (!updatedCase) {
            return res.status(404).json({ msg: 'Không tìm thấy Macro Test Case để cập nhật.' });
        }

        res.status(200).json(updatedCase);

    } catch (err) {
        const error = err as Error;
        console.error(`Lỗi khi cập nhật Macro Test Case: ${error.message}`);
         if (error.name === 'CastError') {
            return res.status(400).json({ msg: 'ID Macro Test Case không hợp lệ.' });
        }
        res.status(500).send('Lỗi Server khi thực hiện cập nhật');
    }
});

// @route   DELETE /api/design/macro/:id
// @desc    Xóa một Macro Test Case theo ID
router.delete('/macro/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const idToDelete = req.params.id;

        const result = await MacroTestCase.findByIdAndDelete(idToDelete);

        if (!result) {
            // Trường hợp không tìm thấy ID
            return res.status(404).json({ msg: 'Không tìm thấy Macro Test Case cần xóa.' });
        }

        // Xóa thành công
        res.status(200).json({ msg: `Macro Test Case ID: ${idToDelete} đã được xóa thành công.`, id: idToDelete });

    } catch (err) {
        const error = err as Error;
        console.error(`Lỗi khi xóa Macro Test Case: ${error.message}`);
        // Lỗi ID không hợp lệ
        if (error.name === 'CastError') {
            return res.status(400).json({ msg: 'ID Macro Test Case không hợp lệ.' });
        }
        res.status(500).send('Lỗi Server khi thực hiện xóa');
    }
});
export default router;