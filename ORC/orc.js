const exprees = require('express');
const router = exprees.Router();
const GetFileAndScan = require('./controller/ScanIMGController');
const UploadFile = require('./controller/uploadFileController');

router.post('/getFile',GetFileAndScan.uploadFile);

router.post('/uploadFile',UploadFile.uploadFile);

module.exports = router;