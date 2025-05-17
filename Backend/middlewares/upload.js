const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';
    return {
      folder: 'uploads',
      public_id: file.originalname.split('.')[0],
      resource_type: isPDF ? 'raw' : 'auto',
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
