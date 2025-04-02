export function setCookie(key, value, lifetime) {
    document.cookie = `${key}=${value}; expires=${lifetime}; path=/`
}

export function deleteCookie(key) {
    document.cookie = `${key}=; Max-Age=0; path=/`;
}

export function cookieExists(key) {
    return document.cookie.split("; ").some(cookie => cookie.startsWith(key + "="));
}

export function getCookie(key) {
    const data = decodeURIComponent(document.cookie).split("; ");

    for (const cookie of data) {
        if(cookie.startsWith(key + "=")) {
            const value = cookie.substring(key.length + 1);
            return value === "" ? null : value;
        }
    }

    return null;
}