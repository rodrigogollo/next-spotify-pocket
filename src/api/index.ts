import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth'
import spotifyRoutes from './routes/spotify'

const app: Express = express();
const port = 9876;

app.use(cors({
  origin: 'http://localhost:3001', // Next.js app URL
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send({msg: "Hello World"})
})

app.use('/auth', authRoutes);
app.use('/spotify', spotifyRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});