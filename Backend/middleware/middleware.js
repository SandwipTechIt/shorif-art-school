// import express from "express";
// const app = express();

// export const middleware = (req, res, next) => {
//   /* -----------  TIME  ----------- */
//   Date.now(); // epoch ms
//   new Date().toISOString(); // 2025-07-31T12:34:56.789Z
//   new Date().toLocaleString(); // 7/31/2025, 12:34:56 PM

//   /* -----------  HTTP BASICS  ----------- */
//   req.method; // GET, POST, …
//   req.originalUrl || req.url; // /api/v1/users?foo=bar
//   req.path; // /api/v1/users
//   req.protocol; // http | https
//   req.secure; // true if https
//   req.ip || req.ips[0]; // client IP
//   req.get("User-Agent"); // browser / curl / etc.
//   req.get("Referer"); // previous page
//   req.get("Authorization"); // Bearer …
//   req.hostname; // example.com
//   req.query; // { foo: 'bar' }
//   req.params; // route params
//   req.body; // parsed JSON / form (needs body-parser)

//   /* -----------  RESPONSE BASICS  ----------- */
//   res.statusCode; // 200, 404, 500 …
//   res.get("Content-Type"); // text/html; charset=utf-8

//   /* -----------  PERFORMANCE  ----------- */
//   const start = Date.now(); // start timer
//   res.on("finish", () => {
//     const ms = Date.now() - start; // response-time in ms
//     console.log(
//       `${req.method} ${req.originalUrl} - ${res.statusCode} - ${ms}ms`
//     );
//   });

//   next();
// };


import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.access_token;
    const secret = process.env.SECRET_KEY;


    if (!token) return res.status(401).json({ message: 'No Token Provided' });

    // 2. Verify the JWT
    const decoded = jwt.verify(token, secret);

    // 3. Ensure the admin still exists in the DB
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
        return res.status(401).json({ error: 'Admin no longer exists' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'You are not authorized!' });
        next();
    });
}