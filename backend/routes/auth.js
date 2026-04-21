const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/recuperar', authController.recuperarContrasena); 

module.exports = router;