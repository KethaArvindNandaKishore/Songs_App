const express = require('express');
const connectDb = require('./config/MongoDb');
const port = process.env.PORT||4000;
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const podcastsRoutes = require('./routes/podcastsRoutes');
const musicRoutes = require('./routes/musicRoutes');

// Connect to MongoDB
connectDb()

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true,

}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Route for userAunthentication
app.use("/auth/",authRoutes);
// Route for userData
app.use("/user/",userRoutes);
// Route for podcastData    
app.use("/podcasts/",podcastsRoutes);
// Route for musicData
app.use("/music/",musicRoutes);






app.get('/', (req, res) => {
  res.send('Music App')
}); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }); 
