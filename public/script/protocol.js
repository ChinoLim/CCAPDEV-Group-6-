export async function signUp(email, username, displayName, password) {
    try {
        const res = await fetch("/sign-up", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, username, displayName, password})
        });

        return res.ok;
    } catch(error) {
        return false;
    }
}

export async function signIn(username, password, isUsername) {
    try {
        const res = await fetch("/sign-in", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password, isUsername})
        });

        return res.ok ? (await res.json()).sessionToken : false;
    } catch(error) {
        return false;
    }
}

export async function deleteAccount(password) {
    try {
        const res = await fetch("/delete-account", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({password})
        });

        return res.ok;
    } catch(error) {
        return false;
    }
}

export async function emailExists(email) {
    try {
        const res = await fetch("/email-exists", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email})
        });

        return res.ok;
    } catch(error) {
        return false;
    }
}

export async function usernameExists(username) {
    try {
        const res = await fetch("/username-exists", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username})
        });

        return res.ok;
    } catch(error) {
        return false;
    }
}

export async function startRecoveryProcess(email) {
    try {
        const res = await fetch("/recovery-process", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email})
        });

        return res.ok;
    } catch(error) {
        return false;
    }
}

export async function validRecoveryCode(email, code) {
    try {
        const res = await fetch("/recovery-code", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, code})
        });

        return res.ok;
    } catch(error) {
        return false;
    }
}

export async function changePassword(email, newPassword) {
    try {
        const res = await fetch("/recovery-new", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, newPassword})
        });

        return res.ok;
    } catch(error) {
        return false;
    }
}

export async function getFormalUsernames(sessionToken) {
    try {
        const res = await fetch("/formal-usernames", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({sessionToken})
        });

        return res.ok ? await res.json() : false;
    } catch(error) {
        return false;
    }
}