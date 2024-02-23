const express=require('express');
const http = require('http');
const socketIO = require('socket.io');
const firebase = require('firebase/app');
require('firebase/firestore');

const connectToMongoDB = require('./db.js');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const patientRoutes = require('./routes/patient_routes.js')
const doctorRoutes = require('./routes/doctor_routes.js')

const app=express();
const server = http.createServer(app);
const io = socketIO(server);

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

// video call backend with firebase:

const firebaseConfig = {
    apiKey: "AIzaSyDUPcw2b-ZvKl0yrdCFM7l2OkxKOIyoTXI",
  authDomain: "phalanges-bolt.firebaseapp.com",
  projectId: "phalanges-bolt",
  storageBucket: "phalanges-bolt.appspot.com",
  messagingSenderId: "812479468092",
  appId: "1:812479468092:web:fd88cec4875e30e4b2a939",
  measurementId: "G-TM5Y0EB875"
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();

  io.on('connection', (socket) => {
    socket.on('webcamOffer', async (offer) => {
      const callDoc = firestore.collection('calls').doc();
      const offerCandidates = callDoc.collection('offerCandidates');
      const answerCandidates = callDoc.collection('answerCandidates');
  
      await offerCandidates.add(offer);

      callDoc.onSnapshot(async (snapshot) => {
        const data = snapshot.data();
        if (!data?.answer) return;

        socket.emit('webcamAnswer', data.answer);
      });

      socket.on('webcamCandidate', (candidate) => {
        answerCandidates.add(candidate);
      });
    });
  
    socket.on('disconnect', () => {
      cconsole.log('disconnected')
    });
  });
  
  
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes)

app.listen(port,()=>{
    console.log("Server listening to port 5000");
})