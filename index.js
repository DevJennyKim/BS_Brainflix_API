import express from 'express';
import videoRouter from './routes/videos.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8090;
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to the API. Please check the API document!');
});

app.use('/api', videoRouter);

app.listen(PORT, () => {
  console.log(`Port listening to ${PORT}`);
});
