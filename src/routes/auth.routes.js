const express = require('express');
const authenticationController = require('../controllers/authentication.controller');
const router = express.Router();


// UC-101 Inloggen toevoegen
router.post('/login', authenticationController.login)


module.exports = router;