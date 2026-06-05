import express from 'express';

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.listen(8000, () => {
    console.log("server is running at port 8000");
})