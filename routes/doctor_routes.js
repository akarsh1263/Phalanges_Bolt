const express = require('express');
const doctorAuthJWT = require('../middleware/doctorAuthJWT');
const router = express.Router();

const doctorController = require('../controllers/doctor_apis');

router.post('/register', doctorController.doctorRegister);
router.post('/login', doctorController.loginDoctor);
router.get('/getall', doctorController.getAllDoctors);
router.get('/getAppointments', doctorAuthJWT.doctorAuthenticate, doctorController.getAppointments);
router.patch('/postprescription', doctorAuthJWT.doctorAuthenticate, doctorController.postPrescription);
router.delete('/cancelappointment', doctorAuthJWT.doctorAuthenticate, doctorController.cancelAppointment);

module.exports = router;