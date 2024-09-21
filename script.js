// JavaScript code for navigation?
function add(){
    window.location.assign("add.html");
}
function manageCourses(){
    window.location.assign("courses.html");
}
function viewCourses(){
    window.location.assign("view.html");
}
function exit(){
    navigator.app.exitApp();
}
function home(){
    window.location.assign("main.html");
}

if (Notification.permission === 'default') {
    Notification.requestPermission().then(function(result) {
        if (result === 'granted') {
            console.log('Notification permission granted.');
        } else {
            console.log('Notification permission denied.');
        }
    });
}
