const cookieParser = require("cookie-parser");
const express = require("express");
const exphbs = require("express-handlebars");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const secret = require("./sercret");

const successCode = 200, errorCode = 404;

function initAppInstance(app) {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, "../public")));
    app.use(cookieParser());
    
    app.engine("hbs", exphbs.engine({extname: ".hbs",defaultLayout: false}));
    
    app.set("view engine", "hbs");
    app.set("views", path.join(__dirname, "../public/views"));
}

function initGetMethods(app, database) {
    app.get("/", async (req, res) => {
        try {
            const sessionToken = req.cookies.sessionToken;
            const pageData = {};

            if(!!sessionToken) {
                const username = jwt.verify(sessionToken, secret.sessionTokenKey).username;
                const formalUserNames = await database.getFormalUsernames(username);

                pageData.clientUsername = formalUserNames.username;
                pageData.clientDisplayName = formalUserNames.displayName;
            }

            res.render("home-page", pageData);
        } catch(error) {
            res.status(errorCode).sendFile(path.join(__dirname, "../public", "page-not-found.html"));
            return;
        }
    });

    app.get("/account/entry", (req, res) => {
        res.sendFile(path.join(__dirname, "../public", "entry-page.html"));
    });
    
    app.get("/:username/", async (req, res) => {
        let pageData = await database.getPage(req.params.username);
    
        if(pageData) {
            const sessionToken = req.cookies.sessionToken;
            pageData = pageData.toObject();
    
            if(!!sessionToken) {
                try {
                    const username = jwt.verify(sessionToken, secret.sessionTokenKey).username;
                    const formalUserNames = await database.getFormalUsernames(username);
    
                    pageData.clientUsername = formalUserNames.username;
                    pageData.clientDisplayName = formalUserNames.displayName;
                } catch(error) {
                    res.status(errorCode).sendFile(path.join(__dirname, "../public", "page-not-found.html"));
                    return;
                }
            }
    
            res.render("user-page", pageData);
        } else {
            res.status(errorCode).sendFile(path.join(__dirname, "../public", "page-not-found.html"));
        }
    });
    
    app.get("/:username/edit", async (req, res) => {
        let pageData = await database.getPage(req.params.username);
    
        if(pageData) {
            const sessionToken = req.cookies.sessionToken;
            pageData = pageData.toObject();
    
            if(!sessionToken) {
                res.sendFile(path.join(__dirname, "../public", "entry-page.html"));
                return;
            }

            try {
                const username = jwt.verify(sessionToken, secret.sessionTokenKey).username;

                if(username.toLowerCase() != req.params.username.toLowerCase()) {
                    res.sendFile(path.join(__dirname, "../public", "entry-page.html"));
                    return;
                }

                const formalUserNames = await database.getFormalUsernames(username);

                pageData.clientUsername = formalUserNames.username;
                pageData.clientDisplayName = formalUserNames.displayName;
                pageData.titleMetadata = "(Editor)";
            } catch(error) {
                res.status(errorCode).sendFile(path.join(__dirname, "../public", "page-not-found.html"));
                return;
            }
    
            res.render("user-page", pageData);
        } else {
            res.status(errorCode).sendFile(path.join(__dirname, "../public", "page-not-found.html"));
        }
    });
    
    app.get("*", (req, res) => {
        res.status(errorCode).sendFile(path.join(__dirname, "../public", "page-not-found.html"));
    });
}

function initPostMethods(app, database) {
    app.post("/sign-up", async (req, res) => {
        const {email, username, displayName, password} = req.body;
        const success = await database.registerProfile(email, username, displayName, password);

        res.sendStatus(success ? successCode : errorCode);
    });
    
    app.post("/sign-in", async (req, res) => {
        const {username, password, isUsername} = req.body;
        let success = await database.authenticateProfile(username, password, isUsername);

        if(success) {
            const sessionToken = jwt.sign({username}, secret.sessionTokenKey);

            res.status(successCode).json({sessionToken});
        } else {
            res.sendStatus(errorCode);
        }
    });
    
    app.post("/delete-account", async (req, res) => {
        try {
            const deleteStatus = await database.deleteProfile(req.cookies.sessionToken, req.body.password, true);

            res.sendStatus(deleteStatus ? successCode : errorCode);
        } catch(error) {
            res.sendStatus(errorCode);
        }
    }); 

    app.post("/email-exists", async (req, res) => {
        const {email} = req.body;
        let success = await database.profileExists(email, false);
    
        res.sendStatus(success ? successCode : errorCode);
    });
    
    app.post("/username-exists", async (req, res) => {
        const {username} = req.body;
        let success = await database.profileExists(username, true);

        res.sendStatus(success ? successCode : errorCode);
    });
    
    app.post("/recovery-process", async (req, res) => {
        const {email} = req.body;
        let success = await database.profileExists(email, false);
    
        if(!success) {
            res.sendStatus(errorCode);
            return;
        }
    
        database.setRecoveryCode(email, Math.floor(100000 + Math.random() * 900000));
        res.sendStatus(successCode);
    });
    
    app.post("/recovery-code", async (req, res) => {
        const {email, code} = req.body;
        let success = await database.verifyRecoveryCode(email, code);
    
        res.sendStatus(success ? successCode : errorCode);
    });
    
    app.post("/recovery-new", async (req, res) => {
        const {email, newPassword} = req.body;
        let success = await database.changePassword(email, newPassword);
    
        res.sendStatus(success ? successCode : errorCode);
    });

    app.post("/formal-usernames", async (req, res) => {
        const {sessionToken} = req.body;

        try {
            const username = jwt.verify(sessionToken, secret.sessionTokenKey).username;
            const formalUsernames = await database.getFormalUsernames(username);

            res.status(successCode).json(formalUsernames);
        } catch(error) {
            res.sendStatus(errorCode);
        }
    });
}

module.exports = {
    initAppInstance,
    initGetMethods,
    initPostMethods
}