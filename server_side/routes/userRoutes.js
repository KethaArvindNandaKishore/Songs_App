const express = require('express');
const userRoutes = express.Router();


userRoutes.get('/user', (req, res) => {
    res.send('User Page');
});

module.exports = userRoutes;