const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  image1: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image2: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image3: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image4: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image5: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image6: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image7: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image8: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image9: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image10: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image11: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image12: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image13: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image14: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  image15: { fileName: {type: String,}, file: String, filePath: {type: String,}, id: String},
  heading1: String, heading2: String, heading3: String, heading4: String,
  heading5: String, heading6: String, heading7: String, heading8: String,
  heading9: String, heading10: String, heading11: String, heading12: String, heading13: String, heading14: String, heading15: String,
  keywords: String, info1: String, info2: String, info3: String,
  info4: String, info5: String, info6: String, info7: String,
  info8: String, info9: String, info10: String, info11: String, info12: String, info13: String, info14: String, info15: String,
  metaTitle: String, metaDescription: String, name: String,

});
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
