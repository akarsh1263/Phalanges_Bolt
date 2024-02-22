const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        contact: { type: String, required: true },
        problem_desc: { type: String, required: true },
	},
	{ collection: 'patients' }
)

module.exports = mongoose.model('Patient', patientSchema);