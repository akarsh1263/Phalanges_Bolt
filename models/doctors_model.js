const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
        name: { type: String, required: true },
        specialty: { type: String, required: true },
        hospital: { type: String, required: true },
        avg_rating: { type: Number, required: false },
        total_rating: { type: Number, required: false },
        total_patients: { type: Number, required: false }
	},
	{ collection: 'doctors' }
)

module.exports = mongoose.model('Doctor', doctorSchema);