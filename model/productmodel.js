// models/userModel.js
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
      size: { type: String, required: true },
      color: { type: String, default: '' },
      price: { type: Number, required: true },
      quantity: { type: Number, required: false },
      inStock: { type: Boolean, required: false },
      isDeleted: { type: Boolean, default: false },
      discount: { type: Number, default: null }
  }, { timestamps: true });
  
  //Brochure schema
  const brochureSchema = new mongoose.Schema({
      url: { type: String, required: true },
      mimetype: { type: String, required: true },

  }, { timestamps: true });

// product schema
const productSchema = new mongoose.Schema({

  title: { 
        type: String, 
        required: true },
  description: { 
        type: String, 
        required: true },
    mediaFiles:[ {
            url: String,
            mimetype: String
        } ],
    price: { 
            type: Number, 
            required: true },
  consume_type: { 
        type: String, 
        required: true },      
  return_policy: { 
        type: Boolean, 
        required: true},
  manufacturing_date: { 
        type: Date, 
        required: true },
  expiry_date: { 
        type: Date, 
        required: true },
  isRequirePrescription: { 
        type: Boolean },
  inStock: { 
        type: Boolean },
        variants: [variantSchema], 
        brochures: [brochureSchema],
  brand: [{
             type: mongoose.Schema.Types.ObjectId, 
             ref: 'Brand' }],
  category: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category' }],
  variants: [variantSchema]
      },

{timestamps : true}
   
);
// Create the model from the schema
const productmodel = mongoose.model('Product', productSchema);

module.exports= productmodel;


