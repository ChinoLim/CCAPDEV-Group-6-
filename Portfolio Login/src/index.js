const express = require("express");
const path = require("path");
const fs = require("fs");
const collection = require("./config");
const app = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/entry-page", (request, response) => {
    fs.readFile("./public/entry-page.html", "utf-8", (err, html) => {
        if(err) {
            response.status(500).send("Webpage not available.");
            return;
        }
        
        response.send(html);
    });
});

app.post("/sign-up", async (req, res) => {
    const {email, username, password} = req.body;
    const success = await collection.registerProfile(email, username, password);

    res.sendStatus(success ? 200 : 404);
});

app.post("/sign-in", async (req, res) => {
    const {username, password, isUsername} = req.body;
    let success = await collection.authenticateProfile(username, password, isUsername);

    res.sendStatus(success ? 200 : 404);
});

app.post("/email-exists", async (req, res) => {
    const {email} = req.body;
    let success = await collection.profileExists(email, false);

    res.sendStatus(success ? 200 : 404);
});

app.post("/username-exists", async (req, res) => {
    const {username} = req.body;
    let success = await collection.profileExists(username, true);

    res.sendStatus(success ? 200 : 404);
});

app.post("/recovery-process", async (req, res) => {
    const {email} = req.body;
    let success = await collection.profileExists(email, false);

    if(!success) {
        res.sendStatus(404);
        return;
    }

    collection.setRecoveryCode(email, Math.floor(100000 + Math.random() * 900000));
    res.sendStatus(200);
});

app.post("/recovery-code", async (req, res) => {
    const {email, code} = req.body;
    let success = await collection.verifyRecoveryCode(email, code);

    res.sendStatus(success ? 200 : 404);
});

app.post("/recovery-new", async (req, res) => {
    const {email, newPassword} = req.body;
    let success = await collection.changePassword(email, newPassword);

    res.sendStatus(success ? 200 : 404);
});

app.listen(port, () => console.log(`Server running at http://localhost:${3000}/`));