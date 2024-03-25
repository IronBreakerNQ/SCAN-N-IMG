const Tesseract = require('tesseract.js');
const multer = require('multer');
const path = require('path');

const CheckFileDo = async () =>{
    return path.resolve(__dirname, 'Scan NIMG', 'server', 'img');
}

// Thiết lập multer storage engine
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const filePath = await CheckFileDo();
            cb(null, filePath);
        } catch (error) {
            cb(error); // Trả về lỗi nếu có lỗi xảy ra
        }
    },
    filename: function (file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    
       if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
           cb(null, true); // Chấp nhận file
       } else {
           cb(new Error('Only JPEG and PNG images are allowed'), false); // Từ chối file
       }
   };

   // Cấu hình multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = {



    async ScanIMG(req,res){
        const upload = multer({ dest: 'C:\\workspace\\Reacjs+nodejs\\Scan NIMG\\server\\img' }); 
        try {
            const result = await Tesseract.recognize(
                'C:/workspace/Reacjs+nodejs/Scan NIMG/server/img/Screenshot (1016).png',
                'vie', // Ngôn ngữ được nhận dạng
                {
                    logger: m => console.log(m)
                }
            );
            console.log(result.data.text); // Hiển thị văn bản đã nhận dạng
        } catch (error) {
            console.error(error); // Xử lý lỗi nếu có
        }
    }
};
