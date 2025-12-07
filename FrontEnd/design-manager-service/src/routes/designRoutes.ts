// src/routes/designRoutes.ts
import express, { Request, Response } from 'express';
import { MicroTestCase, IMicroTestCase } from '../models/MicroTestCase';
import { IComponentNode } from '../models/ComponentNode';

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


/* --- API CHO MACRO TEST CASES (CRUD) --- */
// (Sẽ được bổ sung sau)

export default router;