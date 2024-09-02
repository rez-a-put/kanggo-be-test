const db = require("../models/db");
const constants = require("../utils/constants");

// to retrieve list of active workers
exports.listWorkers = (req, res) => {
    // get worker data from db
    let query = "select id, name, price from workers where status = 1"
    db.execute(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "There are currently no Workers"
            });
        }

        let workersData = [];
        results.forEach((v, i) => {
            let worker = {
                worker_id: v.id,
                worker_name: v.name,
                price: v.price
            }

            workersData.push(worker)
        });

        return res.status(200).json({
            status: "success",
            message: "List of workers",
            data: workersData
        });
    });
};