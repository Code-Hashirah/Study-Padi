document.addEventListener('DOMContentLoaded', loadCourses);

const manageCourseList = document.getElementById('manage-course-list');

function loadCourses() {
    try {
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        courses.forEach(course => {
            appendCourseToManageList(course);
        });
    } catch (error) {
        console.error("Error loading courses:", error);
    }
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
        const updatedCourse = { name: courseName, time: studyTime };

        updateCoursesInStorage(course, updatedCourse);
        refreshManageCourseList();
    }
}

function deleteCourse(course, listItem) {
    if (confirm(`Are you sure you want to delete the course: ${course.name}?`)) {
        let courses = JSON.parse(localStorage.getItem('courses')) || [];
        courses = courses.filter(c => c.name !== course.name || c.time !== course.time);
        localStorage.setItem('courses', JSON.stringify(courses));
        manageCourseList.removeChild(listItem);
    }
}

function updateCoursesInStorage(oldCourse, updatedCourse) {
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses = courses.map(course => 
        course.name === oldCourse.name && course.time === oldCourse.time ? updatedCourse : course
    );
    localStorage.setItem('courses', JSON.stringify(courses));
}

function refreshManageCourseList() {
    manageCourseList.innerHTML = '';
    loadCourses();
}
