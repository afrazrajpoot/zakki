const Blog = require("../models/blogsModel");
// const cloudinary = require('../cloudinary.config');
// const { v4: uuidv4 } = require('uuid'); // Import uuid package for generating unique IDs
const path = require('path');
const fs = require('fs');
const Product = require("../models/Product");
exports.createBlog = async (req, res) => {
  try {
    const { keywords, info1, info2, info3, info4, info5, info6, info7, info8, info9, info10, info11, info12, info13, info14, info15,
      heading1, heading2, heading3, heading4, heading5, heading6, heading7, heading8, heading9, heading10, heading11, heading12, heading13, heading14, heading15,
      name, metaTitle, metaDescription } = req.body;
    const images = req.files;

    const imageObjects = {}; // Object to store image objects for database

    // Iterate over uploaded images and store their file data
    for (const key of Object.keys(images)) {
      const image = images[key][0];
      const fileName = image.filename; // Use the filename provided by Multer

      // Create image object with file data
      const imageObject = {
        fileName,
      };
      // Store image object in the imageObjects object using key
      imageObjects[key] = imageObject;
    }

    // Create a new Blog document with image objects included
    const blog = new Blog({
      keywords, info1, info2, info3, info4, info5, info6, info7, info8, info9, info10, info11, info12, info13, info14, info15,
      heading1, heading2, heading3, heading4, heading5, heading6, heading7, heading8, heading9, heading10, heading11, heading12, heading13, heading14, heading15,
      name, metaTitle, metaDescription, ...imageObjects,
    });

    // Save the blog document
    const saveBlog = await blog.save();

    // Prepare response object with saved blog ID and image objects
    const responseObj = {
      ...saveBlog._id,
      ...imageObjects,
    };

    // Send response with the saved data
    res.status(201).json(responseObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.updateBlog = async (req, res) => {
  try {
    const { keywords, name, ...fieldsToUpdate } = req.body;
    const updateFields = {
      keywords,
      ...fieldsToUpdate,
    };

    // Find the existing blog post by ID
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    Object.keys(existingBlog._doc).forEach(field => {
      if (!fieldsToUpdate[field]) {
        updateFields[field] = existingBlog[field];
      }
    });

    // Update the images fields from the existing blog post
    for (let i = 1; i <= 10; i++) {
      const fieldName = `image${i}`;
      if (req.files[fieldName]) {
        // If an image is provided in the request, update the image field
        updateFields[fieldName] = { fileName: req.files[fieldName][0].filename };
      } else {
        // If no image is provided, retain the existing image field
        updateFields[fieldName] = existingBlog[fieldName];
      }
    }

   
    // Update the blog document with the new fields
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    // Send the updated blog document as response
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.readBlogs = async (req, res) => {
  try {
    const blog = await Blog.find();
    res.status(200).json(blog.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.readSingleBlog = async (req, res) => {
  try {
    const { keywords } = req.params;
    const blog = await Blog.findById({ _id:keywords });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





exports.deleteImages = async (req, res, next) => {
  try {
    const { fileName } = req.body;

    // Check the blog post existence
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Construct the full path to the image
    const filePath = path.join(__dirname, '../public/', fileName);
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file from the public folder
    await fs.promises.unlink(filePath);

    // Clear the corresponding image field in the blog
    const imageFields = Object.keys(blog.toObject()).filter(key => key.startsWith('image'));
    let imageDeleted = false;

    for (const field of imageFields) {
      if (blog[field].fileName === fileName) {
        blog[field] = { fileName: null, file: null, filePath: null, id: null };
        imageDeleted = true;
        break;
      }
    }

    if (!imageDeleted) {
      return res.status(404).json({ error: 'Image not found in blog post' });
    }

    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    console.error('Error occurred while deleting image:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.updateProductInfo = async (req, res) => {
  const { title, metaTitle, metaDescription, longDescription } = req.body;

  try {
    // Check if the product already exists
    let product = await Product.findOne({ title });

    if (product) {
      // If the product exists, update it
      product.metaTitle = metaTitle;
      product.metaDescription = metaDescription;
      product.longDescription = longDescription;

      // Save the updated product
      await product.save();

      return res.status(200).json({ message: 'Product updated successfully', product });
    } else {
      // If the product does not exist, create a new one
      product = new Product({
        title,
        metaTitle,
        metaDescription,
        longDescription
      });

      // Save the new product
      await product.save();

      return res.status(201).json({ message: 'Product created successfully', product });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating or creating product', error: err.message });
  }
};


exports.getProductInfo = async (req, res) => {
  const { title } = req.query;

  try {
    // Find the product by title
    const product = await Product.findOne({ title });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return the product information
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product data', error: err.message });
  }
};