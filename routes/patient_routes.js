const express = require('express');
const patientAuthJWT = require('../middleware/patientAuthJWT');
const router = express.Router();

const patientController = require('../controllers/patient_apis');

router.post('/register', patientController.patientRegister);
router.post('/login', patientController.loginPatient);
router.get('/getappointments', patientAuthJWT.patientAuthenticate, patientController.getAppointments);
router.post('/createappointment', patientAuthJWT.patientAuthenticate, patientController.createAppointment);

module.exports = router;