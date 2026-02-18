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
import jobRouter from "./routes/job.routes.js"
import searchRouter from "./routes/search.routes.js"

app.use("/api/users", userRouter)
app.use("/api/company", companyRouter)
app.use("/api/jobs", jobRouter)
app.use("/api/jobsearch", searchRouter)


export { app };