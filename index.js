const express=require('express');
const connectToMongoDB = require('./db.js');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const patientRoutes = require('./routes/patient_routes.js')
const doctorRoutes = require('./routes/doctor_routes.js')

const app=express();
app.use(express.json());
app.use(cors({ origin: '*', }));
app.use(bodyParser.json());

const port=process.env.PORT//5000

async function connectDB() {
    try {
        await connectToMongoDB();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

connectDB();

app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes)

app.listen(port,()=>{
    console.log("Server listening to port 5000");
})