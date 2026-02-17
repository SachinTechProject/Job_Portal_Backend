import { app } from "./app.js";
import { connectDB } from "./db/db.js";


connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log("Failed to start server", error);
});
