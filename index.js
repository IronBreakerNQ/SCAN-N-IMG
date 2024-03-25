const express = require('express');
const cors = require('cors');
const ORCRouter = require('./ORC');

const app = express();
app.use(cors());
const PORT = 3001;



app.use(express.json());

app.use(ORCRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  