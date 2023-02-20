const connection = require('../../src/db');
//const moment = require('moment-timezone');
const xlsx = require('xlsx');

const uploadProduct = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const file = req.files.file;
        const workbook = xlsx.read(file.data, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        const query = `INSERT INTO producttable (product_name,product_description,product_cost,product_color,product_brand) VALUES ?`;
        const values = data.map((row) => [row.product_name, row.product_description, row.product_cost, row.product_color, row.product_brand]);
        await connection.query(query, [values]);

        res.status(200).json({ message: 'File uploaded successfully' });
    }
    catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const searchProduct = async (req, res) => {
    try {
        const query = req.query.q;
        await connection.query(`SELECT * FROM producttable WHERE product_name LIKE '%${query}%'`, (error, result, field) => {
            if (error) throw error;
            res.send(renderData(result));
        });
        function renderData(data) {
            let tableHtml = '<table>';
            tableHtml += '<tr><th>ID</th><th>Name</th><th>Description</th><th>Cost</th><th>Color</th><th>Brand</th></tr>';
            for (let i = 0; i < data.length; i++) {
                tableHtml += '<tr>';
                tableHtml += '<td>' + data[i].product_id + '</td>';
                tableHtml += '<td>' + data[i].product_name + '</td>';
                tableHtml += '<td>' + data[i].product_description + '</td>';
                tableHtml += '<td>' + data[i].product_cost + '</td>';
                tableHtml += '<td>' + data[i].product_color + '</td>';
                tableHtml += '<td>' + data[i].product_brand + '</td>';
                tableHtml += '</tr>';
            }
            tableHtml += '</table>';
            return tableHtml;

        }
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getProduct=async(req,res)=>{
    try{
    const itemsPerPage = 2;
    const offset = (req.params.pageNumber - 1) * itemsPerPage;
    const limit = itemsPerPage;
  
    connection.query(
      'SELECT * FROM producttable LIMIT ?, ?',
      [offset, limit],
      (error, results, fields) => {
        if (error) throw error;
        res.send(renderData(results));
      }
    );
  
  function renderData(data) {
    let tableHtml = '<table>';
    tableHtml += '<tr><th>ID</th><th>Name</th><th>Description</th><th>Cost</th><th>Color</th><th>Brand</th></tr>';
    for (let i = 0; i < data.length; i++) {
      tableHtml += '<tr>';
      tableHtml += '<td>' + data[i].product_id + '</td>';
      tableHtml += '<td>' + data[i].product_name + '</td>';
      tableHtml += '<td>' + data[i].product_description + '</td>';
      tableHtml += '<td>' + data[i].product_cost + '</td>';
      tableHtml += '<td>' + data[i].product_color + '</td>';
      tableHtml += '<td>' + data[i].product_brand + '</td>';
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    return tableHtml;
    }
} catch(e){
    res.status(500).json({ message: 'Internal server error' });
}
}

const getProductById = async (req, res) => {
    try {
        //const { product_id } = req.params;
        const query = `SELECT * FROM producttable WHERE product_id ='${req.params.id}'`;
        
        await connection.query(query, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                console.log(product_id);
                return res.status(404).json({ message: "No Product found" });
                
            }
            res.send({ success: 200, data: result });
        });
    }
    catch (e) {
        res.status(500).json({ Status: 500, Message: 'Internal Server Error' });
    }
}
const updateProduct= async (req, res) => {
    try {
        const { product_name,product_description,product_cost,product_color,product_brand } = req.body;
        //const { id } = req.params;
        //const { name, email } = req.body;
        const query = `UPDATE producttable SET product_name='${product_name}',product_description='${product_description}',product_cost=${product_cost}, product_color='${product_color}',product_brand='${product_brand}'WHERE product_id = '${req.params.id}'`;
        await connection.query(query, (err, result) => {
            if (err) throw err;
            res.send({ success: 200, message: 'Product updated successfully' });
        });
    } catch (e) {
        res.status(500).json({ Status: 500, Message: 'Internal Server Error' });
    }
}

const deleteProduct = async(req, res) => {
    try{
        const query = `DELETE FROM ordertable WHERE product_id = '${product_id}'`;
        connection.query(query, (err, result) => {
            if (err) throw err;
            res.send({ success: 200, message: 'Product deleted successfully' });
        });
    }
    catch(e) {
        res.status(500).json({ Status: 500, Message: 'Internal Server Error' });
    }
}

module.exports={
    uploadProduct,
    searchProduct ,
    getProduct,
    updateProduct,
    getProductById,
    deleteProduct,
}