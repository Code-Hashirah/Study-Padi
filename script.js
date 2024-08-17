// document.addEventListener('DOMContentLoaded', loadCourses);

// const courseForm = document.getElementById('course-form');
// const courseList = document.getElementById('course-list');
// const downloadBtn = document.getElementById('download-json');

// courseForm.addEventListener('submit', addCourse);
// downloadBtn.addEventListener('click', downloadJsonFile);

// function addCourse(e) {
//     e.preventDefault();

//     const courseName = document.getElementById('course-name').value;
//     const studyTime = document.getElementById('study-time').value;

//     const course = {
//         name: courseName,
//         time: studyTime,
//     };

//     try {
//         saveCourse(course);
//         appendCourseToList(course);
//         scheduleNotification(course);
//         window.alert("Added for study");
//     } catch (error) {
//         console.error("Error adding course:", error);
//         window.alert("Error adding course");
//     }

//     courseForm.reset();
// }

// function saveCourse(course) {
//     let courses = JSON.parse(localStorage.getItem('courses')) || [];
//     courses.push(course);
//     localStorage.setItem('courses', JSON.stringify(courses));
// }

// function loadCourses() {
//     try {
//         let btn=document.createElement('button');
//         const courses = JSON.parse(localStorage.getItem('courses')) || [];
//         courses.forEach(appendCourseToList);
//         // courses.appendChild('btn');
//         // btn.setAttribute('caption', 'Delete')
//     } catch (error) {
//         console.error("Error loading courses:", error);
//     }
// }

// function appendCourseToList(course) {
//     const li = document.createElement('li');
//     li.className = 'list-group-item';
//     li.textContent = `${course.name} at ${course.time}`;
//     courseList.appendChild(li);
// }

// function scheduleNotification(course) {
//     const now = new Date();
//     const courseTime = new Date();
//     const [hours, minutes] = course.time.split(':');
//     courseTime.setHours(hours, minutes, 0, 0);

//     const timeUntilNotification = courseTime.getTime() - now.getTime();
//     if (timeUntilNotification > 0) {
//         setTimeout(() => {
//             alert(`Time to study: ${course.name}`);
//             const msg = new SpeechSynthesisUtterance(`Time to study: ${course.name}`);
//             window.speechSynthesis.speak(msg);
//         }, timeUntilNotification);
//     }
// }

// function downloadJsonFile() {
//     try {
//         const courses = JSON.parse(localStorage.getItem('courses')) || [];
//         const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
//         const downloadAnchorNode = document.createElement('a');
//         downloadAnchorNode.setAttribute("href", dataStr);
//         downloadAnchorNode.setAttribute("download", "dbase.json");
//         document.body.appendChild(downloadAnchorNode); // Required for Firefox
//         downloadAnchorNode.click();
//         downloadAnchorNode.remove();
//     } catch (error) {
//         console.error("Error downloading JSON:", error);
//     }
// }
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
    // navigator.app.exitApp();
}