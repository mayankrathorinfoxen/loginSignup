const express = require('express');
const router = express.Router();

const authController = require('../main/controllers/authController');

// POST /auth/signup
router.post('/signup', (req,res) => {
    authController.postSignup(req,res);
});

// POST /auth/login
router.post('/login', (req,res) => {
    authController.postLogin(req,res);
});

module.exports = router;
