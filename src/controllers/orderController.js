const db = require("../models/db");
const constants = require("../utils/constants");
const moment = require("moment");

// to create new order from customers
exports.createOrder = (req, res) => {
    let { workers, start_date, end_date } = req.body;
    
    let startDate = new Date(start_date);
    let endDate = new Date(end_date);
    let totalDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24));
    
    if (totalDays <= 0) {
        return res.status(400).json({
            status: "error",
            message: "Invalid date range"
        });
    }

    let placeholders = "";
    workers.forEach(() => {
        placeholders += "?,"
    })
    placeholders = placeholders.slice(0, -1);
    
    // get existing workers data 
    let query = "select id, price from workers where id in ("+placeholders+")";
    db.execute(query, workers, (err, results) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: err.message
            });
        }

        if (results.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid workers"
            });
        }

        let totalPrice = 0;
        let workerArr = []
        let workerPriceArr = []

        // counting total price and total price per worker
        results.forEach((worker) => {
            let workerPrice = worker.price * totalDays;
            workerPriceArr.push(workerPrice);
            workerArr.push(worker.id);

            totalPrice += workerPrice;
        });
        
        // insert order data into db
        let orderQuery = "insert into orders (user_id, start_date, end_date, total_days, total_price) values (?, ?, ?, ?, ?)";
        db.execute(orderQuery, [req.user.user_id, startDate, endDate, totalDays, totalPrice], (err, orderResult) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                });
            }
            
            // insert order detail data into db
            let orderId = orderResult.insertId;
            let orderDetQuery = "insert into order_detail (order_id, worker_id, worker_price) values (?, ?, ?)";
            workerPriceArr.forEach((v, i) => {
                db.execute(orderDetQuery, [orderId, workerArr[i], v], (err, orderDetResult) => {
                    if (err) {
                        return res.status(500).json({
                            status: "error",
                            message: err.message
                        });
                    }
                });
            });
            
            return res.status(201).json({
                status: "success",
                message: "Order Successfully Created",
                data: {
                    order_id: orderId,
                    workers,
                    total_days: totalDays,
                    total_price: totalPrice,
                    status: constants.orderStatus[1],
                },
            });
        });
    });
};

// to retrieve list of orders created
exports.listOrders = (req, res) => {
    // get order created by user
    let query = "select id, start_date, end_date, total_days, total_price, status, created_at from orders where user_id = ?";
    db.execute(query, [req.user.user_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: err.message
           });
        }
       
        if (results.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "There are no order data"
            });
        }
        
        let ordersData = [];
        let workersCount = 0;
        let totalOrders = results.length;
        
        results.forEach((v, i) => {
            workersCount++;
            
            // get workers data and put it as array for workers
            let workerQuery = "select w.id, w.name, w.price from workers w join order_detail od on w.id = od.worker_id where od.order_id = ?";
            db.execute(workerQuery, [v.id], (err, workersResult) => {
                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: err.message
                    });
                }
                
                let workersData = []
                workersResult.forEach((val, idx) => {
                    let worker = {
                        worker_id: val.id,
                        worker_name: val.name,
                        price: val.price
                    } 
                    workersData.push(worker)
                });

                ordersData.push({
                    order_id: v.id,
                    status: constants.orderStatus[v.status],
                    start_date: moment(v.start_date).format("YYYY-MM-DD"),
                    end_date: moment(v.end_date).format("YYYY-MM-DD"),
                    total_days: v.total_days,
                    total_price: v.total_price,
                    workers: workersData,
                    created_at: moment(v.created_at).format("YYYY-MM-DD HH:mm:ss")
                });
                
                workersCount--;

                // to check if all workers data has been processed. only return and finished api call when all workers had been processed
                if (workersCount === 0) {
                    return res.status(200).json({
                        status: "success",
                        message: "List of Orders",
                        data: ordersData
                    });
                }
            });
        });
    });
};

// to cancel specific order based on id
exports.cancelOrder = (req, res) => {
    let id = req.params.id;

    // update order data
    let query = "update orders set status = ?, updated_at = now(), deleted_at = now() where id = ? and status = ?"
    db.execute(query, [2, id, 1], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                message: "Order is not exists"
            });
        }

        // get orders data for return
        let selectQuery = "select id, status, created_at, updated_at from orders where id = ?"
        db.execute(selectQuery, [id], (err, selectResult) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "Order is not exists"
                });
            }

            let ordersData = {
                order_id: id,
                status: constants.orderStatus[selectResult[0].status],
                created_at: moment(selectResult[0].created_at).format("YYYY-MM-DD HH:mm:ss"),
                updated_at: moment(selectResult[0].updated_at).format("YYYY-MM-DD HH:mm:ss")
            };

            return res.status(200).json({
                status: "success",
                message: "Order Cancelled",
                data: ordersData
            });
        });

    }); 
};