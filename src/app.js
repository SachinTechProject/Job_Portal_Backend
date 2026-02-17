import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cors(
    {
        origin: "*",
        credentials: true,
    }
))



app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({ extended: true, limit:"16kb" }));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
import companyRouter from "./routes/company.routes.js"

app.use("/api/users", userRouter)
app.use("/api/company", companyRouter)


export { app };