const Tesseract = require('tesseract.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đường dẫn lưu trữ file
const storagePath = path.resolve(__dirname, '..', '..', 'img');

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, storagePath) // Nơi lưu trữ file upload
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Tên file được lưu trữ
    }
})

const upload = multer({ storage: storage })

module.exports = {
    // Middleware xử lý việc upload file và quét ảnh
    async uploadFile(req, res) {
        try {
            // Sử dụng middleware upload.single('file') để xử lý việc tải lên file từ client
            upload.single('file')(req, res, async function (err) {
                if (err) {
                    // Xử lý lỗi nếu có
                    return res.status(400).json({
                        message: err.message
                    });
                }
                // Nếu không có lỗi, file đã được tải lên thành công và đang được lưu trữ tại req.file.path

                // Lấy thông tin về file đã tải lên
                const FileName = req.file.originalname;
                const FilePath = req.file.path;
                // Tính toán dung lượng của tệp

                const stats = fs.statSync(FilePath);
                const fileSizeInBytes = stats.size;
                // Chuyển đổi dung lượng thành đơn vị megabyte (MB)
                const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

                // Thực hiện nhận dạng văn bản bằng Tesseract
                const result = await Tesseract.recognize(
                    FilePath,
                    'vie', // Ngôn ngữ được nhận dạng
                    {
                        logger: m => console.log(m)
                    }
                );

                console.log(result.data.text); // Hiển thị văn bản đã nhận dạng

                // Gửi phản hồi về client
                res.status(200).json({
                    message: 'File uploaded and text recognized successfully',
                    filePath: FilePath,
                    fileName: FileName,
                    fileSizeInMB: fileSizeInMB,
                    recognizedText: result.data.text
                });

                // Xóa tệp sau khi đã gửi phản hồi về client
                fs.unlink(FilePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        return;
                    }
                });
            });
        } catch (error) {
            console.error(error); // Xử lý lỗi nếu có
            return res.status(500).json({
                message: 'Internal server error' + error
            });
        }
    }
};
