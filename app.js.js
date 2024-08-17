document.addEventListener('DOMContentLoaded', loadCourses);

const courseForm = document.getElementById('course-form');
const courseList = document.getElementById('course-list');
const manageCourseList = document.getElementById('manage-course-list');
const downloadBtn = document.getElementById('download-json');

courseForm.addEventListener('submit', addCourse);
downloadBtn.addEventListener('click', downloadJsonFile);

function addCourse(e) {
    e.preventDefault();

    const courseName = document.getElementById('course-name').value;
    const studyTime = document.getElementById('study-time').value;

    const course = {
        name: courseName,
        time: studyTime,
    };

    try {
        saveCourse(course);
        appendCourseToList(course);
        appendCourseToManageList(course);
        scheduleNotification(course);
    } catch (error) {
        console.error("Error adding course:", error);
    }

    courseForm.reset();
}

function saveCourse(course) {
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses.push(course);
    localStorage.setItem('courses', JSON.stringify(courses));
}

function loadCourses() {
    try {
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        courses.forEach(course => {
            appendCourseToList(course);
            appendCourseToManageList(course);
        });
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}

function appendCourseToList(course) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${course.name} at ${course.time}`;
    courseList.appendChild(li);
}

function appendCourseToManageList(course) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    const courseText = document.createElement('span');
    courseText.textContent = `${course.name} at ${course.time}`;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    // Create Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-warning btn-sm';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editCourse(course);

    // Create Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteCourse(course, li);

    // Append buttons to button group
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    // Append course text and button group to list item
    li.appendChild(courseText);
    li.appendChild(btnGroup);

    // Append list item to manage course list
    manageCourseList.appendChild(li);
}


function editCourse(course) {
    const courseName = prompt("Edit Course Name", course.name);
    const studyTime = prompt("Edit Study Time", course.time);

    if (courseName !== null && studyTime !== null) {
        course.name = courseName;
        course.time = studyTime;

        updateCoursesInStorage(course);
        refreshManageCourseList();
    }
}

function deleteCourse(course, listItem) {
    if (confirm(`Are you sure you want to delete the course: ${course.name}?`)) {
        let courses = JSON.parse(localStorage.getItem('courses')) || [];
        courses = courses.filter(c => c.name !== course.name || c.time !== course.time);
        localStorage.setItem('courses', JSON.stringify(courses));
        manageCourseList.removeChild(listItem);
        refreshCourseList();
    }
}

function updateCoursesInStorage(updatedCourse) {
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses = courses.map(course => 
        course.name === updatedCourse.name ? updatedCourse : course
    );
    localStorage.setItem('courses', JSON.stringify(courses));
}

function refreshManageCourseList() {
    manageCourseList.innerHTML = '';
    loadCourses();
}

function refreshCourseList() {
    courseList.innerHTML = '';
    loadCourses();
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
    try {
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "dbase.json");
        document.body.appendChild(downloadAnchorNode); // Required for Firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    } catch (error) {
        console.error("Error downloading JSON:", error);
    }
}
