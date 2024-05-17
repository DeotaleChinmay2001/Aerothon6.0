const Product = require('../../models/products.model');

const updateProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (req.body.name) {
        product.name = req.body.name;
      }
      if (req.body.description) {
        product.description = req.body.description;
      }
      if (req.body.quantity) {
        product.quantity = req.body.quantity;
      }
      if (req.body.price) {
        product.price = req.body.price;
      }
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

module.exports = updateProduct;
