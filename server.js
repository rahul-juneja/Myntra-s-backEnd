import express from "express";
import mongoose from "mongoose";
import {
    APP_PORT,
    DB_URL
} from "./config";
import errorHandler from "./middlewares/errorHandlers";
import router from "./routes";

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
})


const app = express();
// To Use JSON format
app.use(express.json())


app.use('/api', router)

app.use(errorHandler);


app.listen(APP_PORT, () => console.log(`Listening to ${APP_PORT}.`));