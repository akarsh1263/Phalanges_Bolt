const Doctor = require('../models/doctors_model');
const Appointment = require('../models/appointments_model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

exports.doctorRegister =  async (req, res) => {
	const email = req.body.email;
	const pass = req.body.password;
    const name = req.body.name;
    const specialty = req.body.specialty;
	const hospital = req.body.hospital;

	const password = await bcrypt.hash(pass, 10)

	try {
		await Doctor.create({ email, password, name, specialty, hospital });
        res.status(200).json({ status: 'ok', message: 'doctor added' });
	} catch (error) {
		if (error.code === 11000) {
			return res.status(200).json({ status: 'error', error: 'email already in use' })
		}
		res.status(400).json({ status: 'error', error: error});
	}
};

exports.loginDoctor = async (req,res) => {
	try{
	const { email, password } = req.body
	const doctor = await Doctor.findOne({ email })

	if (!doctor) {
		return res.status(401).json({ status: 'error', error: 'Invalid email' })
	}

	if (await bcrypt.compare(password, doctor.password)) {
		const token = jwt.sign(
			{
				id: doctor._id,
				email: doctor.email
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

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error getting doctors:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getAppointments =  async (req, res) => {

	const doctor_email = req.doctor.email;
	
	try {
        const appointments = await Appointment.find({ doctor_email });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error getting appointments:', error);
        res.status(500).json({ error: 'Server error' });
    }

};

exports.postPrescription =  async (req, res) => {

	const doctor_email = req.doctor.email;
    const patient_email = req.body.patient_email;
    const prescription = req.body.prescription;
	
	try {
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { patient_email, doctor_email },
            { prescription },
            { new: true }
        );
        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error posting prescription:', error);
        res.status(500).json({ error: 'Server error' });
    }

};

exports.cancelAppointment =  async (req, res) => {

	const doctor_email = req.doctor.email;
    const patient_email = req.body.patient_email;
	
	try {
        const deletedAppointment = await Appointment.findOneAndDelete(
            { patient_email, doctor_email }
        );

        if (deletedAppointment) {
            res.json({ message: 'Appointment deleted successfully' });
        } else {
            res.status(404).json({ error: 'Appointment not found' });
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Server error' });
    }
};