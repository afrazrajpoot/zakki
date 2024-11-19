const express = require("express");
const router = express.Router();
const { readBlogs, createBlog, readSingleBlog, deleteBlog, updateBlog, deleteImages, updateProductInfo, getProductInfo } = require("../controllers/blog");
const multer = require("multer");
const path = require('path');
const { v4: uuidv4 } = require('uuid');


// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public')); // Destination folder
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4(); // Generate unique ID for the image
    const filename = `${uniqueId}_${file.originalname}`;
    cb(null, filename);
  },
});


// Initialize multer with defined storage
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 10 * 1024 * 1024, // Increase field size limit to 10MB (adjust as needed)
  }
});

// Middleware to handle file uploads
const uploadFiles = upload.fields([
  { name: 'image1', maxCount: 1 }, 
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }, 
  { name: 'image4', maxCount: 1 }, 
  { name: 'image5', maxCount: 1 },
  { name: 'image6', maxCount: 1 }, 
  { name: 'image7', maxCount: 1 }, 
  { name: 'image8', maxCount: 1 },
  { name: 'image9', maxCount: 1 }, 
  { name: 'image10', maxCount: 1 },
  { name: 'image11', maxCount: 1 }, 
  { name: 'image12', maxCount: 1 }, 
  { name: 'image13', maxCount: 1 },
  { name: 'image14', maxCount: 1 }, 
  { name: 'image15', maxCount: 1 },
]);

// Define routes
router.route("/readBlogs").get(readBlogs);
router.route("/createBlog").post(uploadFiles, createBlog); // Use uploadFiles middleware
router.route("/blogs/:keywords").get(readSingleBlog);
router.route("/deleteBlog/:id").delete(deleteBlog);
router.route("/updateBlog/:id").put(uploadFiles, updateBlog); // Use uploadFiles middleware
router.route('/deleteImages/:id').delete(deleteImages);
router.route('/updateProductInfo').put(updateProductInfo);
router.route('/getProductInfo').get(getProductInfo);
module.exports = router;
