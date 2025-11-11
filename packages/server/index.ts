import express, { type Request, type Response } from "express";
import router from "./routes";

const app = express();
app.use(express.json());
app.use(router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
