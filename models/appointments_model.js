const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema(
	{
		patient_email: { type: String, required: true},
		doctor_email: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
		prescription: { type: String, required: false}
	},
	{ collection: 'appointments' }
)

module.exports = mongoose.model('Appointment', appointmentSchema);