function getCookie(name) {
    const fullCookieString = '; ' + document.cookie;
    const splitCookie = fullCookieString.split('; ' + name + '=');
    return splitCookie.length === 2 ? splitCookie.pop().split(';').shift() : null;
}

const current_file = getCookie("current_file");

if (current_file) {
    openImg("./uploads/" + current_file);
}