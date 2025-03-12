const { register } = require("module");
const crypto = require("crypto");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/users");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("MongoDB connection successful."));

const credentialSchema = new mongoose.Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    recoveryCode: {type: Number, required: false},
});

const Credential = mongoose.model("credentials", credentialSchema);

async function registerProfile(email, username, password) {
    try {
        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
        const user = new Credential({ email, username, password: hashedPassword });
        await user.save();
        return true;
    } catch (error) {
        return false;
    }
}

async function authenticateProfile(usernameOrEmail, password, isUsername) {
    try {
        const filter = isUsername
            ? {username: {$regex: new RegExp(`^${usernameOrEmail}$`, "i")}}
            : {email: {$regex: new RegExp(`^${usernameOrEmail}$`, "i")}};

        const user = await Credential.findOne(filter);
        
        if(!user)
            return false;

        return user.password == crypto.createHash("sha256").update(password).digest("hex");
    } catch(error) {
        return false;
    }
}

async function profileExists(usernameOrEmail, isUsername) {
    try {
        const filter = isUsername
            ? {username: {$regex: new RegExp(`^${usernameOrEmail}$`, "i")}}
            : {email: {$regex: new RegExp(`^${usernameOrEmail}$`, "i")}};

        return await Credential.exists(filter);
    } catch(error) {
        return false;
    }
}

async function setRecoveryCode(email, code) {
    try {
        await Credential.updateOne(
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
        const match = await Credential.findOne({
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
        await Credential.updateOne({email}, {$set: {password: hashedPassword}});
        return true;
    } catch(error) {
        return false;
    }
}

module.exports = {
    Credential,
    registerProfile,
    authenticateProfile,
    profileExists,
    setRecoveryCode,
    verifyRecoveryCode,
    changePassword
};