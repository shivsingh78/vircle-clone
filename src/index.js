import express from 'express';
import cors from 'cors';
import { genrate } from './genrate.js';
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.post("/",async (req,res)=>{
    const repoUrl=req.body.repoUrl;
    res.json({message: "repourl get sucessfullyd"})
    console.log(repoUrl);
    
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

