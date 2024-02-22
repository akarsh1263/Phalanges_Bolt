const Patient = require('../models/patients_model');
const Appointment = require('../models/appointments_model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

exports.patientRegister =  async (req, res) => {
	const email = req.body.email;
	const pass = req.body.password;
    const name = req.body.name;
    const address = req.body.address;
	const contact = req.body.contact;
    const problem_desc = req.body.problem_desc;

	const password = await bcrypt.hash(pass, 10)

	try {
		await Patient.create({ email, password, name, address, contact, problem_desc})
        res.status(200).json({ status: 'ok', message: 'patient added' });
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.status(200).json({ status: 'error', error: 'email already in use' })
		}
		res.status(400).json({ status: 'error', error: error});
	}
}

exports.loginPatient = async (req,res) => {
	try{
	const { email, password } = req.body
	const patient = await Patient.findOne({ email })

	if (!patient) {
		return res.status(401).json({ status: 'error', error: 'Invalid email' })
	}

	if (await bcrypt.compare(password, patient.password)) {
		const token = jwt.sign(
			{
				id: patient._id,
				email: patient.email
			},
			JWT_SECRET
		)

		return res.status(200).json({ status: 'ok', data: token })
	}
	res.status(403).json({ status: 'error', error: 'Invalid password' })
	}
	catch (error) {
        res.status(400).json({ message: 'error', error: error});
    }
};

exports.getAppointments =  async (req, res) => {

	const patient_email = req.patient.email;
	
	try {
        const appointments = await Appointment.find({ patient_email });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error getting appointments:', error);
        res.status(500).json({ error: 'Server error' });
    }

};

exports.createAppointment = async (req, res) => {
	const patient_email = req.patient.email;
	const doctor_email = req.body.doctor_email;
	const date = req.body.date;
	const time = req.body.time;

	try {
		await Appointment.create({ patient_email, doctor_email, date, time})
        res.status(200).json({ status: 'ok', message: 'appointment added' });
	} catch (error) {
		res.status(400).json({ status: 'error', error: error});
	}
};
