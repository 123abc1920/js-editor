const current_file = getCookie("current_file");

if (current_file) {
    openImg("./uploads/" + current_file);
}