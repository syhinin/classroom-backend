import express from "express";
import cors from "cors";

import subjectsRouter from "./routes/subjects";

const app = express();
const PORT = 8000;

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL environment variable is required");
}

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use('/api/v1/subjects', subjectsRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Classroom API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
