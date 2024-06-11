const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './public/images');
//     },
//     filename: (req, file, cb) => {
//       cb(null,Date.now() + '_' + file.originalname);
//     },
// });

const storage = multer.memoryStorage(); 

const upload = multer({ 
    storage, 
});

module.exports = upload;
