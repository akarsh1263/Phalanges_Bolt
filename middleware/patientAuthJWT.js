const jwt = require('jsonwebtoken');
const Patient = require('../models/patients_model');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
exports.patientAuthenticate = async(req, res, next) => {
    const bearerHeader = req.header('Authorization');
 try{
      const bearer=bearerHeader.split(" ")
      const token=bearer[1]
      const decoded = jwt.verify(token, JWT_SECRET)
      const email = decoded.email
      console.log('no auth error, email: ',email)
      const patient_req = await Patient.findOne({ email: email }); 
      req.patient=patient_req
      console.log('patient is: ',req.patient)
      next();
 }
 catch(error){
  console.log('error in auth');
  res.json({ status: 'error', error: error })
 }
}