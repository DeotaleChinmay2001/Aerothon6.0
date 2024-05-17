const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const getProduct = require('../Controller/Product/getAllProducts')
const createProduct = require('../Controller/Product/createProduct')
const deleteProduct = require('../Controller/Product/deleteProduct')
const updateProduct = require('../Controller/Product/updateProduct')

router.get('/all', authenticateToken,getProduct);
router.post('/createProduct',authenticateToken, createProduct);
router.delete('/deleteProduct/:id',authenticateToken, deleteProduct);
router.patch('/updateProducts/:id',authenticateToken, updateProduct);

module.exports = router;
