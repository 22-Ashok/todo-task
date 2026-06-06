import express from 'express';
import userRouter from './src/routes/user.route.js';
import { globalErrorHandler } from './src/middleware/errorHandler.js';

const app = express();

app.use(express.json());


app.use("/api/v1/auth", userRouter);


// global error handler 
app.use(globalErrorHandler);



app.listen(8000, () => {
    console.log("server is running at port 8000");
})