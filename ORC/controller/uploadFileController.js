const multer = require('multer');
const path = require('path');

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
    // Middleware xử lý việc upload file
    async uploadFile(req, res) {
        try {
            // Sử dụng middleware upload.single('file') để xử lý việc tải lên file từ client
            upload.single('file')(req, res, function (err) {
                if (err) {
                    // Xử lý lỗi nếu có
                    return res.status(400).json({
                        message: err.message,
                        errPath: err,
                    });
                }

                // Nếu không có lỗi, trả về thông tin về file đã tải lên thành công
                const { originalname, mimetype, path } = req.file;
                return res.status(200).json({
                    message: 'File uploaded successfully',
                    originalname,
                    mimetype,
                    path
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
