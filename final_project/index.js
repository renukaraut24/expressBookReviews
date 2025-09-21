const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Step 1: Session check
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Step 2: Verify JWT
        jwt.verify(token, "access", (err, user) => {
            if (err) {
                return res.status(403).json({ message: "User not authenticated" });
            } else {
                // Save user info if needed
                req.user = user;
                next(); // Proceed to next route
            }
        });

    } else {
        // No token found
        return res.status(401).json({ message: "Login first to access this route" });
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
