
import dotenv from 'dotenv';
import path from 'path';

// Use absolute path for safety
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('OpenAI Key:', process.env.OPENAI_API_KEY);


import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import offersRouter from "./routes/offers.js";
import leadsRouter from "./routes/leads.js";
import scoringRouter from "./routes/scoring.js";
import resultsRouter from "./routes/results.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/offer", offersRouter);
app.use("/leads", leadsRouter);
app.use("/score", scoringRouter);
app.use("/results", resultsRouter);

app.get("/", (req, res) => {
  res.send({ message: "Lead Scoring Backend — healthy" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
