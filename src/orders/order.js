//const { Router } = require('express');
const express = require('express');
const router = express.Router();
const controller = require('./ordercontroller');

router.get('/orders', controller.getOrder); //GET ALL ORDER
router.get('/ordersId/:id', controller.getOrderById); //GET ORDER BY ID
router.get('/orderDate/:order_date',controller.getOrderByDate); //GET ORDER WITH PRODUCTS(USING LEFT JOIN) BY DATE
router.post('/orderPost', controller.postOrder); //POST ORDER
router.put('/orders/:id', controller.updateOrder); //UPDATE ORDER
router.delete('/Delete/:id', controller.deleteOrder); //DELETE ORDER

module.exports = router;