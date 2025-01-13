import express from 'express'
import cors from 'cors';

const app = new express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome')
})

app.post('/sum', (req, res) => {
    const { a, b } = req.body;
    const sum = parseInt(a) + parseInt(b);

    res.json({ sum })
})

app.listen(5000, () => {
    console.log('app is running on https://localhost:5000')
})