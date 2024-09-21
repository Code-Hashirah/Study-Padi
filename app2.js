document.addEventListener('deviceready', function() {
    // Enable background mode for Cordova
    cordova.plugins.backgroundMode.enable();

    // When background mode is activated, we can add extra functionality
    cordova.plugins.backgroundMode.onactivate = function() {
        console.log("App is running in background mode");
    };

    // Call the function to load saved courses when the app starts
    loadCourses();
}, false);

const courseForm = document.getElementById('course-form');
const courseList = document.getElementById('course-list');
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
        scheduleNotification(course);
        window.alert("Course added successfully!");
    } catch (error) {
        console.error("Error adding course:", error);
        window.alert("Error adding course");
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
        courses.forEach(appendCourseToList);
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

function scheduleNotification(course) {
    const now = new Date();
    const courseTime = new Date();
    const [hours, minutes] = course.time.split(':');
    courseTime.setHours(hours, minutes, 0, 0);

    const timeUntilNotification = courseTime.getTime() - now.getTime();

    // Debugging: Check the calculated time and log it
    console.log(`Time until notification for ${course.name}: ${timeUntilNotification} ms`);

    if (timeUntilNotification > 0) {
        setTimeout(() => {
            // Alert notification
            alert(`Time to Study: ${course.name}`);

            // Voice notification using Web Speech API
            if ('speechSynthesis' in window) {
                const message = new SpeechSynthesisUtterance(`It's time to study ${course.name}.`);
                window.speechSynthesis.speak(message);
                console.log("Voice notification spoken:", message.text);
            } else {
                console.log("Speech synthesis not supported in this browser.");
            }
        }, timeUntilNotification);
    } else {
        console.log("Notification time is in the past or immediately due.");
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






function showAddForm() {
    document.getElementById('main-menu').classList.add('hide');
    document.getElementById('add-study-section').classList.remove('hide');
    document.getElementById('manage-courses-section').classList.add('hide');
    document.getElementById('view-courses-section').classList.add('hide');
}

function showManageCourses() {
    document.getElementById('main-menu').classList.add('hide');
    document.getElementById('manage-courses-section').classList.remove('hide');
    document.getElementById('add-study-section').classList.add('hide');
    document.getElementById('view-courses-section').classList.add('hide');

    // Load courses from localStorage and display in the manage section
    loadCoursesForManagement();
}

function showViewCourses() {
    document.getElementById('main-menu').classList.add('hide');
    document.getElementById('view-courses-section').classList.remove('hide');
    document.getElementById('add-study-section').classList.add('hide');
    document.getElementById('manage-courses-section').classList.add('hide');

    // Load and display the courses in the course list
    loadCoursesForView();
}

function exitApp() {
    if (typeof navigator.app !== 'undefined') {
        navigator.app.exitApp(); // Cordova Exit
    } else {
        window.close(); // Browser exit
    }
}

function loadCoursesForManagement() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const manageList = document.getElementById('manage-course-list');
    manageList.innerHTML = '';

    courses.forEach((course, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${course.name} at ${course.time}
            <div>
                <button class="btn btn-warning btn-sm" onclick="editCourse(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCourse(${index})">Delete</button>
            </div>
        `;
        manageList.appendChild(li);
    });
}

function loadCoursesForView() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';

    courses.forEach(course => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${course.name} at ${course.time}`;
        courseList.appendChild(li);
    });
}

function editCourse(index) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses[index];
    
    const newName = prompt('Edit Course Name', course.name);
    const newTime = prompt('Edit Study Time', course.time);
    
    if (newName && newTime) {
        courses[index] = { name: newName, time: newTime };
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCoursesForManagement();
    }
}

function deleteCourse(index) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    if (confirm(`Are you sure you want to delete ${courses[index].name}?`)) {
        courses.splice(index, 1); // Remove course
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCoursesForManagement();
    }
}
