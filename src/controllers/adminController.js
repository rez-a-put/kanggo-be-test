const db = require("../models/db");
const constants = require("../utils/constants");
const moment = require("moment");

// to add new worker
exports.addWorker = (req, res) => {
    let { worker_name, price } = req.body;

    // insert new worker data into db
    let query = "insert into workers (name, price) values (?, ?)";
    db.execute(query, [worker_name, price], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: err.message
            });
        }

        // get inserted worker data from db
        let selectQuery = "select id, name, price, created_at from workers where id = ?"
        db.execute(selectQuery, [result.insertId], (err, selectResults) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                });
            }

            let workersData = {
                worker_id: selectResults[0].id,
                worker_name: selectResults[0].name,
                price: selectResults[0].price,
                created_at: moment(selectResults[0].created_at).format("YYYY-MM-DD HH:mm:ss")
            };

            return res.status(201).json({
                status: "success",
                message: "New Worker Created!",
                data: workersData
            });
        });
    });
};

// to update existing worker
exports.updateWorker = (req, res) => {
    let id = req.params.id;

    let { worker_name, price } = req.body; 

    // update worker data
    let query = "update workers set name = ?, price = ?, updated_at = now() where id = ? and status = ?"
    db.execute(query, [worker_name, price, id, 1], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                message: "Workers not exist"
            });
        }

        // get updated worker data for return 
        let selectQuery = "select id, name, price, created_at, updated_at from workers where id = ?"
        db.execute(selectQuery, [id], (err, selectResults) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                });
            }

            if (selectResults.affectedRows === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "Workers not exist"
                });
            }

            let workerData = {
                worker_id: selectResults[0].id,
                worker_name: selectResults[0].name,
                price: selectResults[0].price,
                created_at: moment(selectResults[0].created_at).format("YYYY-MM-DD"),
                updated_at: moment(selectResults[0].updated_at).format("YYYY-MM-DD")
            }

            return res.status(200).json({
                status: "success",
                message: "Worker With ID "+id+" Updated!",
                data: workerData
            });
        });
    });
};

exports.deleteWorker = (req, res) => {
    let id = req.params.id;

    // delete worker data by update it's status and add deleted_at value 
    let query = "update workers set status = ?, updated_at = now(), deleted_at = now() where id = ? and status = ?"
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
                message: "Workers not exist"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Worker with ID "+id+" Deleted!"
        });
    });
};