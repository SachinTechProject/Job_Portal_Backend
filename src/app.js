import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cors(
    {
        origin: "https://job-portal-frontend-ecru-chi.vercel.app",
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
import applicationRouter from "./routes/application.routes.js"
import experienceRouter from "./routes/experience.routes.js"
import educationRouter from "./routes/education.routes.js"
import resumeRouter from "./routes/resume.routes.js"
import chatRouter from "./routes/chatRoutes.js"

app.use("/api/users", userRouter)
app.use("/api/company", companyRouter)
app.use("/api/jobs", jobRouter)
app.use("/api/jobsearch", searchRouter)
app.use("/api/applications", applicationRouter)
app.use("/api/experience", experienceRouter)
app.use("/api/education", educationRouter)
app.use("/api/resume", resumeRouter)
app.use("/api/chats", chatRouter)

export { app };