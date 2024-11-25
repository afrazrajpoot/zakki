const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');

const { addSpot, addToken, addPrice, getSpotToken, getAddToken, getPrice } = require("../controllers/adminController");

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public'); // Set the directory to store images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        
        if (extname && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});

// Controller for image upload
const uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        res.status(200).json({
            message: 'Image uploaded successfully',
            file: req.file
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error uploading image' });
    }
};

// Routes
router.route('/add-spot').post(addSpot);
router.route('/add-token').post(upload.single('tokenIcon'), addToken);
router.route('/add-price').post(upload.single('walletQrCode'),addPrice);

router.route('/get-spot').get(getSpotToken)
router.route('/get-token').get(getAddToken)
router.route('/get-price').get(getPrice)

module.exports = router;
