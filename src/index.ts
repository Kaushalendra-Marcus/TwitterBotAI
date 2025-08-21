    import express from "express";
    import { schedular } from './api/autopost.js'
    const app = express()
    app.use(express.json())
    app.use("/api/autopost", schedular);
    const PORT = process.env.PORT || 5000;
    app.get("/", (req, res) => {
        res.send("This is Home Page")
    })
    // app.listen(PORT, () => {
    //     console.log(`Server running on port ${PORT}`);
    // });
    export default app;