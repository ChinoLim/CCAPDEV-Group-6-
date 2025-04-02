const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const secret = require("./sercret");

mongoose.connect("mongodb+srv://portfolio:portfolio.1234@portfolio.hguvnzc.mongodb.net/users?retryWrites=true&w=majority&appName=Portfolio");
// mongoose.connect("mongodb://127.0.0.1:27017/users");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
db.once("open", () => console.log("MongoDB connection successful"));

const credentialSchema = mongoose.model("credentials", 
    new mongoose.Schema({
        email: {type: String, unique: true, required: true},
        username: {type: String, unique: true, required: true},
        displayName: {type: String, required: true},
        password: {type: String, required: true},
        recoveryCode: {type: Number}
    })
);

const pageSchema = mongoose.model("pages",
    new mongoose.Schema({
        username: {type: String, unique: true, required: true},
        displayName: {type: String, required: true},
        bio: {type: String}
    })
);

async function registerProfile(email, username, displayName, password) {
    try {
        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
        
        const user = new credentialSchema({email, username, displayName, password: hashedPassword});
        const page = new pageSchema({username, displayName});

        await Promise.all([user.save(), page.save()]);

        return true;
    } catch(error) {
        return false;
    }
}

async function authenticateProfile(usernameOrEmail, password, isUsername) {
    try {
        const filter = isUsername
            ? {username: {$regex: new RegExp(`^${usernameOrEmail}$`, "i")}}
            : {email: {$regex: new RegExp(`^${usernameOrEmail}$`, "i")}};

        const user = await credentialSchema.findOne(filter);
        
        if(!user)
            return false;

        return user.password == crypto.createHash("sha256").update(password).digest("hex");
    } catch(error) {
        return false;
    }
}

async function deleteProfile(username, password, usernameIsToken) {
    try {
        if(usernameIsToken)
            username = jwt.verify(username, secret.sessionTokenKey).username;

        if(!authenticateProfile(username, password, true))
            return false;

        const credentialResult = await credentialSchema.deleteOne({ 
            username: {$regex: new RegExp(`^${username}$`, "i")} 
        });

        const pageResult = await pageSchema.deleteOne({ 
            username: {$regex: new RegExp(`^${username}$`, "i")} 
        });

        return credentialResult.deletedCount > 0 && pageResult.deletedCount > 0;
    } catch(error) {
        return false;
    }
}

async function profileExists(usernameOrEmail, isUsername) {
    try {
        const filter = isUsername
            ? {username: {$regex: new RegExp(`^${usernameOrEmail}$`, "i")}}
            : {email: {$regex: new RegExp(`^${usernameOrEmail}$`, "i")}};

        return await credentialSchema.exists(filter);
    } catch (error) {
        return false;
    }
}

async function setRecoveryCode(email, code) {
    try {
        await credentialSchema.updateOne(
            {email: {$regex: new RegExp(`^${email}$`, "i")}},
            {recoveryCode: code}
        );
        
        return true;
    } catch(error) {
        return false;
    }
}

async function verifyRecoveryCode(email, code) {
    try {
        const match = await credentialSchema.findOne({
            email: {$regex: new RegExp(`^${email}$`, "i")},
            recoveryCode: code
        });

        return !!match;
    } catch(error) {
        return false;
    }
}

async function changePassword(email, newPassword) {
    try {
        const hashedPassword = crypto.createHash("sha256").update(newPassword).digest("hex");
        await credentialSchema.updateOne({email}, {$set: {password: hashedPassword}});
        return true;
    } catch(error) {
        return false;
    }
}

async function getFormalUsernames(username) {
    try {
        return await credentialSchema.findOne({username: {$regex: new RegExp(`^${username}$`, "i")}}, "username displayName -_id");
    } catch(error) {
        return null;
    }
}

async function pageExists(username) {
    try {
        return await pageSchema.exists({username: {$regex: new RegExp(`^${username}$`, "i")}}) !== null;
    } catch (error) {
        return null;
    }
}

async function getPage(username) {
    try {
        return await pageSchema.findOne({username: {$regex: new RegExp(`^${username}$`, "i")}}, "-_id");
    } catch (error) {
        return null;
    }
}

module.exports = {
    registerProfile,
    authenticateProfile,
    deleteProfile,
    profileExists,
    setRecoveryCode,
    verifyRecoveryCode,
    changePassword,
    getFormalUsernames,
    pageExists,
    getPage
}