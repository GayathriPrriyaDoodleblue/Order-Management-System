//const { Router } = require('express');
const express = require('express');
const router = express.Router();
const controller = require('./productcontroller');

router.post('/upload', controller.uploadProduct); //UPLOAD PRODUCT THROUGH FILE
router.get('/product/:id',controller.getProductById);// GET PRODUCT BY ID
router.get('/search', controller.searchProduct); //SEARCH PRODUCT BY PRODUCT NAME
router.get('/data/page/:pageNumber',controller.getProduct); //GET THE PRODUCTS WITH PAGINATION
router.put('/updateProduct/:id',controller.updateProduct); //UPDATE THE PRODUCT TABLE BY ID
router.delete('/productDelete/:id',controller.deleteProduct); //DELETE PRODUCT BY ID
module.exports = router;