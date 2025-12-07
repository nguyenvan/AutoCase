import mongoose from 'mongoose';

/**
 * @desc Thiết lập kết nối đến MongoDB
 * @returns {Promise<void>}
 */
const connectDB = async (): Promise<void> => {
    try {
        // Lấy chuỗi kết nối từ biến môi trường
        const mongoUri: string = process.env.MONGO_URI || '';
        
        // Kiểm tra nếu chuỗi kết nối bị thiếu
        if (!mongoUri) {
            console.error('LỖI: Biến môi trường MONGO_URI không được định nghĩa.');
            // Không thoát tiến trình ngay, để các service khác có thể hoạt động (nếu đây là một microservice)
            return; 
        }

        const conn = await mongoose.connect(mongoUri);
        
        // Log thành công
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        // Xử lý lỗi kết nối
        const error = err as Error; 
        console.error(`❌ Lỗi kết nối DB: ${error.message}`);
        
        // Thoát tiến trình nếu kết nối thất bại nghiêm trọng
        process.exit(1); 
    }
};

export default connectDB;