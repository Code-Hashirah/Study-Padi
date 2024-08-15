document.addEventListener('DOMContentLoaded', loadCourses);

const courseForm = document.getElementById('course-form');
const courseList = document.getElementById('course-list');

courseForm.addEventListener('submit', addCourse);

function addCourse(e) {
    e.preventDefault();

    const courseName = document.getElementById('course-name').value;
    const studyTime = document.getElementById('study-time').value;

    const course = {
        name: courseName,
        time: studyTime,
    };

    saveCourse(course);
    appendCourseToList(course);
    downloadJsonFile();  // Trigger file download after adding a course
    courseForm.reset();
}

function saveCourse(course) {
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses.push(course);
    localStorage.setItem('courses', JSON.stringify(courses));
}

function loadCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses.forEach(appendCourseToList);
}

function appendCourseToList(course) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${course.name} at ${course.time}`;
    courseList.appendChild(li);
    scheduleNotification(course);
}

function scheduleNotification(course) {
    const now = new Date();
    const courseTime = new Date();
    const [hours, minutes] = course.time.split(':');
    courseTime.setHours(hours, minutes, 0, 0);

    const timeUntilNotification = courseTime.getTime() - now.getTime();
    if (timeUntilNotification > 0) {
        setTimeout(() => {
            alert(`Time to study: ${course.name}`);
            const msg = new SpeechSynthesisUtterance(`Time to study: ${course.name}`);
            window.speechSynthesis.speak(msg);
        }, timeUntilNotification);
    }
}

function downloadJsonFile() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dbase.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
// ------------------------------------------------------------------

