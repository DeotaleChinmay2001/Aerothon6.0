const Product = require('../../models/products.model');

const deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndRemove(req.params.id);
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

module.exports = deleteProduct;
