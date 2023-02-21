//const { Router } = require('express');
const express = require('express');
const router = express.Router();
const controller = require('./ordercontroller');
const { auth } = require('../jwt');

router.get('/orders', auth, controller.getOrder); //GET ALL ORDER
router.get('/ordersId/:id',auth, controller.getOrderById); //GET ORDER BY ID
router.get('/orderDate/:order_date',auth,controller.getOrderByDate); //GET ORDER WITH PRODUCTS(USING LEFT JOIN) BY DATE
router.post('/orderPost', auth,controller.postOrder); //POST ORDER
router.put('/orders/:id', auth,controller.updateOrder); //UPDATE ORDER
router.delete('/Delete/:id', auth,controller.deleteOrder); //DELETE ORDER

module.exports = router;