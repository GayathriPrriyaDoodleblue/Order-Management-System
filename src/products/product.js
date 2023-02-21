//const { Router } = require('express');
const express = require('express');
const router = express.Router();
const controller = require('./productcontroller');
const { auth } = require('../jwt');
router.post('/upload',auth, controller.uploadProduct); //UPLOAD PRODUCT THROUGH FILE
router.get('/product/:id',auth,controller.getProductById);// GET PRODUCT BY ID
router.get('/search', auth,controller.searchProduct); //SEARCH PRODUCT BY PRODUCT NAME
router.get('/data/page/:pageNumber',auth,controller.getProduct); //GET THE PRODUCTS WITH PAGINATION
router.put('/updateProduct/:id',auth,controller.updateProduct); //UPDATE THE PRODUCT TABLE BY ID
router.delete('/productDelete/:id',auth,controller.deleteProduct); //DELETE PRODUCT BY ID
module.exports = router;