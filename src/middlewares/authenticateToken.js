const jwt = require("jsonwebtoken");
const constants = require("../utils/constants");

// middleware authentication
const authenticateToken = (role) => {
    return (req, res, next) => {
        let authHeader = req.headers["authorization"];
        
        let token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized user"
            });
        }
        
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    status: "error",
                    message: "Invalid token"
                });
            }

            if (role != constants.userRole[user.role]) {
                return res.status(401).json({
                    status: "error",
                    message: "Unauthorized user"
                });
            }

            req.user = user;
            next();
        });
    };
};

module.exports = authenticateToken;