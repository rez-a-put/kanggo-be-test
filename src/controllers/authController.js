const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const moment = require("moment");

// to register new user
exports.register = async (req, res) => {
    let { fullname, cellphone, email, role, password } = req.body;

    let passwordHash = await bcrypt.hash(password, 10);

    let intRole;
    if (role == "admin") {
        intRole = 1
    }   else {
        intRole = 2
    }
    
    // insert data into db
    let query = "insert into users (name, phone, email, role, password, status) VALUES (?, ?, ?, ?, ?, ?)";
    db.execute(query, [fullname, cellphone, email, intRole, passwordHash, 1], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: err.message
            });
        }

        // get previously inserted data 
        let query = "select id, name, phone, email, role, created_at from users where id = ?"
        db.execute(query, [result.insertId], (err, users) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                })
            }

            let user = users[0];

            return res.status(201).json({
                status: "success",
                message: "Register Success",
                data: {
                    user_id: user.id,
                    email: user.email,
                    fullname: user.name,
                    cellphone: user.phone,
                    created_at: moment(user.created_at).format("YYYY-MM-DD HH:mm:ss"),
                },
            });
        });
    });
};

// to login into system
exports.login = (req, res) => {
    let { email_cellphone, password } = req.body;

    // get user data from db
    let query = "select id, password, email, role from users where email = ? or phone = ?";
    db.execute(query, [email_cellphone, email_cellphone], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: err.message
            });
        }
        
        if (results.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        let user = results[0];

        // check password validity
        let isValid = bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({
                status: "error",
                message: "Invalid credentials"
            });
        }

        let token = jwt.sign({ user_id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

        return res.status(200).json({
            status: "success",
            message: "Login Success",
            data: {
                user_id: user.id,
                email: user.email,
                token,
            },
        });
    });
};