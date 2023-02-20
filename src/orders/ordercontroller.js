const connection = require('../db');
const moment = require('moment-timezone');

// Create new order
const postOrder = async (req, res) => {
    try {
        const { order_id,quantity, product_id } = req.body;
        const order_date = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        const values = [order_id,order_date, quantity, product_id];
        const query = `INSERT INTO ordertable (order_id, order_date, quantity, product_id) VALUES ('${order_id}','${order_date}', '${quantity}', '${product_id}')`;
        await connection.query(query, values, (err, result) => {
            if (err) throw err;
            res.json({ success: 200, message:result });
        });
    } catch (e) {
        res.status(500).json({ Status: 500, Message: 'Internal Server Error' });
    }
}

const getOrder = async (req, res) => {
    try {
        const query = `SELECT order_id,order_date,quantity,product_id FROM ordertable`;
        await connection.query(query, (err, result) => {
            if (err) throw err;
            const formattedData = result.map(row => {
                return {
                    order_id: row.order_id,
                    order_date: moment(row.order_date).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    quantity: row.quantity,
                    product_id: row.product_id
                };
            });
            res.status(200).json({ Status: 200, Data: formattedData });
        });
    } catch (e) {
        res.status(500).json({ Status: 500, Message: 'Internal Server Error' });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT * FROM ordertable WHERE order_id = ${id} LIMIT 1`;
        await connection.query(query, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                return res.status(404).json({ Message: "No orders found" });
            }

                const formattedData = {
                order_id: result[0].order_id,
                order_date: moment(result[0].order_date).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                quantity: result[0].quantity,
                product_id: result[0].product_id
            };
            res.status(200).json({ Status: 200, Data: formattedData });
        
        });
    } catch (e) {
        res.status(500).json({ Status: 500, Message: 'Internal Server Error' });
    }
}
const getOrderByDate =async (req, res) => {
    try{
    const order_date = req.params.order_date;

    if (!moment(order_date, 'YYYY-MM-DD').isValid()) {
        res.status(400).send('Invalid date format');
        return;
    }

    const query = `
      SELECT o.order_id, o.order_date, o.quantity, p.product_id, p.product_name, p.product_description, p.product_cost, p.product_color, p.product_brand
      FROM ordertable o
      LEFT JOIN producttable p ON o.product_id = p.product_id
      WHERE DATE(o.order_date) = ?
    `;

     await connection.query(query, [order_date], (err, results, fields) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to retrieve order details' });
        }
 
        const utcFormat = 'YYYY-MM-DD HH:mm:ss';
        const istTimezone = 'Asia/Kolkata';
        const istFormat = 'YYYY-MM-DD HH:mm:ss';

        results = results.map((order) => {
            const utcOrderDate = moment.utc(order.order_date, utcFormat);
            const istOrderDate = utcOrderDate.clone().tz(istTimezone).format(istFormat);
            order.order_date = istOrderDate;
            return order;
        });
        res.send(results);
    });}
    catch(e){
        res.status(500).json({ Status: 500, Message: 'Internal Server Error' });
    }
}

const updateOrder = async (req, res) => {
    try {
        const { order_id, quantity, product_id } = req.body;
        const { id } = req.params;
        //const { name, email } = req.body;
        const query = `UPDATE ordertable SET order_id = '${order_id}',quantity='${quantity}',product_id='${product_id}' WHERE order_id = '${id}'`;
        await connection.query(query, (err, result) => {
            if (err) throw err;
            res.send({ success: 200, message: 'Order updated successfully' });
        });
    } catch (e) {
        res.status(500).json({ Status: 500, Message: 'Internal Server Error' });
    }
}

const deleteOrder = async(req, res) => {
    try{
        // const  {id} = req.params;
        const query = `DELETE FROM ordertable WHERE order_id = '${req.params.id}'`;
        //console.log(req.params.id )
        await connection.query(query, (err, result) => {
            if (err) throw err;
            res.send({ success: 200, message: 'Order deleted successfully' });
        });
    }
    catch(e) {
        res.status(500).json({ Status: 500, Message: 'Internal Server Error' });
    }
}

module.exports={
    postOrder,
    getOrder,
    getOrderById,
    getOrderByDate,
    updateOrder,
    deleteOrder
}