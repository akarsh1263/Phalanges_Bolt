const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctors_model');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
exports.doctorAuthenticate = async(req, res, next) => {
    const bearerHeader = req.header('Authorization');
 try{
      const bearer=bearerHeader.split(" ")
      const token=bearer[1]
      const decoded = jwt.verify(token, JWT_SECRET)
      const email = decoded.email
      console.log('email after doc auth: ',email)
      const doctor_req = await Doctor.findOne({ email: email }); 
      req.doctor=doctor_req
      console.log('doc after doc auth: ',req.doctor)
      next();
 }
 catch(error){
  res.json({ status: 'error', error: error })
 }
}