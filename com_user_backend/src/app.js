import express from "express";
import cors from "cors";
import companyRoutes from "./routes/company.route.js";
import userRoutes from "./routes/user.route.js";
import locationRoutes from "./routes/location.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { logMiddleware } from "./middlewares/log.middleware.js";

const app = express();

app.use(logMiddleware);
app.use(cors());
app.use(express.json());

app.use("/api/companies", companyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);

app.get("/", (req, res) => {
  res.send("Company User Management API");
});

app.use(errorHandler);

export default app;
