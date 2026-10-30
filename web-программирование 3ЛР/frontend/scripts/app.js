const API_URL = 'http://127.0.0.1:8000/api/students';


// Состояние приложения
const state = {
    items: [],
    searchQuery: '',
    selectedCategory: 'all',
    sortBy: 'name-asc'
};


// Получаем элементы страницы
const studentsGrid = document.querySelector('#students-grid');
const searchInput = document.querySelector('#student-search');
const subjectFilter = document.querySelector('#subject-filter');
const sortSelect = document.querySelector('#sort-select');
const emptyMessage = document.querySelector('#empty-message');

const modal = document.querySelector('#student-modal');
const openModalButton = document.querySelector('#open-modal');
const closeModalButton = document.querySelector('#close-modal');
const cancelModalButton = document.querySelector('#cancel-modal');
const modalBackdrop = document.querySelector('.modal__backdrop');

const studentForm = document.querySelector('#student-form');

const nameInput = document.querySelector('#student-name');
const classInput = document.querySelector('#student-class');
const subjectInput = document.querySelector('#student-subject');
const descriptionInput = document.querySelector('#student-description');
const homeworkInput = document.querySelector('#student-homework');


// Загружаем учеников с backend
async function loadStudents() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        alert('Ошибка загрузки учеников');
        return;
    }

    const students = await response.json();

    state.items = students;

    render();
}


// Создаём строку информации
function createInfoRow(title, value) {
    const paragraph = document.createElement('p');
    const titleElement = document.createElement('span');

    titleElement.textContent = title;

    paragraph.append(titleElement);
    paragraph.append(
        document.createTextNode(' ' + value)
    );

    return paragraph;
}


// Создаём карточку ученика
function createStudentCard(student) {
    const card = document.createElement('article');

    card.className = 'student-card';
    card.dataset.id = student.id;


    // Крестик удаления
    const deleteButton = document.createElement('button');

    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '×';
    deleteButton.title = 'Удалить ученика';


    // Верх карточки
    const cardHeader = document.createElement('div');

    cardHeader.className = 'student-card__header';


    // Аватар
    const avatar = document.createElement('div');

    avatar.className = 'student-avatar';

    avatar.textContent =
        student.name.charAt(0).toUpperCase();


    // Имя и класс
    const studentTitle = document.createElement('div');

    const studentName = document.createElement('h3');
    studentName.textContent = student.name;

    const studentClass = document.createElement('p');

    studentClass.textContent =
        student.class_number + ' класс';

    studentTitle.append(
        studentName,
        studentClass
    );

    cardHeader.append(
        avatar,
        studentTitle
    );


    // Описание
    const description = document.createElement('p');

    description.className =
        'student-card__description';

    description.textContent =
        student.description;


    // Информация
    const studentInfo = document.createElement('div');

    studentInfo.className = 'student-info';

    const subjectRow = createInfoRow(
        'Предмет:',
        student.subject
    );


    // Выпадающий список домашнего задания
    const homeworkLabel = document.createElement('p');

    homeworkLabel.textContent =
        'Домашнее задание:';

    const homeworkSelect = document.createElement('select');

    homeworkSelect.className = 'homework-select';
    homeworkSelect.dataset.id = student.id;


    const homeworkValues = [
        'Задано',
        'Выполнено',
        'Не задано'
    ];


    homeworkValues.forEach(function (value) {
        const option = document.createElement('option');

        option.value = value;
        option.textContent = value;

        if (value === student.homework) {
            option.selected = true;
        }

        homeworkSelect.append(option);
    });


    studentInfo.append(
        subjectRow,
        homeworkLabel,
        homeworkSelect
    );


    card.append(
        deleteButton,
        cardHeader,
        description,
        studentInfo
    );

    return card;
}


// Получаем учеников для отображения
function getVisibleStudents() {
    const searchText =
        state.searchQuery.toLowerCase();


    const filteredStudents =
        state.items.filter(function (student) {
            const studentName =
                student.name.toLowerCase();

            const studentDescription =
                student.description.toLowerCase();


            const matchesSearch =
                studentName.includes(searchText) ||
                studentDescription.includes(searchText);


            let matchesCategory = false;

            if (state.selectedCategory === 'all') {
                matchesCategory = true;
            }

            if (student.subject === state.selectedCategory) {
                matchesCategory = true;
            }


            return (
                matchesSearch &&
                matchesCategory
            );
        });


    const sortedStudents =
        [...filteredStudents];


    if (state.sortBy === 'name-asc') {
        sortedStudents.sort(function (a, b) {
            return a.name.localeCompare(
                b.name,
                'ru'
            );
        });
    }


    if (state.sortBy === 'name-desc') {
        sortedStudents.sort(function (a, b) {
            return b.name.localeCompare(
                a.name,
                'ru'
            );
        });
    }


    return sortedStudents;
}


// Отрисовываем карточки
function render() {
    studentsGrid.replaceChildren();

    const students =
        getVisibleStudents();


    students.forEach(function (student) {
        const card =
            createStudentCard(student);

        studentsGrid.append(card);
    });


    if (students.length === 0) {
        emptyMessage.hidden = false;
    } else {
        emptyMessage.hidden = true;
    }
}


// Поиск
searchInput.addEventListener(
    'input',
    function (event) {
        state.searchQuery =
            event.target.value;

        render();
    }
);


// Фильтрация
subjectFilter.addEventListener(
    'change',
    function (event) {
        state.selectedCategory =
            event.target.value;

        render();
    }
);


// Сортировка
sortSelect.addEventListener(
    'change',
    function (event) {
        state.sortBy =
            event.target.value;

        render();
    }
);


// Открытие модального окна
function openModal() {
    modal.classList.add('active');

    modal.setAttribute(
        'aria-hidden',
        'false'
    );

    document.body.classList.add(
        'modal-open'
    );

    nameInput.focus();
}


// Закрытие модального окна
function closeModal() {
    modal.classList.remove('active');

    modal.setAttribute(
        'aria-hidden',
        'true'
    );

    document.body.classList.remove(
        'modal-open'
    );

    studentForm.reset();

    clearErrors();
}


openModalButton.addEventListener(
    'click',
    openModal
);

closeModalButton.addEventListener(
    'click',
    closeModal
);

cancelModalButton.addEventListener(
    'click',
    closeModal
);

modalBackdrop.addEventListener(
    'click',
    closeModal
);


document.addEventListener(
    'keydown',
    function (event) {
        if (event.key === 'Escape') {
            if (modal.classList.contains('active')) {
                closeModal();
            }
        }
    }
);


// Очищаем ошибки
function clearErrors() {
    const fields =
        studentForm.querySelectorAll(
            'input, select, textarea'
        );

    fields.forEach(function (field) {
        field.classList.remove('invalid');
    });


    const messages =
        studentForm.querySelectorAll(
            '.error-message'
        );

    messages.forEach(function (message) {
        message.textContent = '';
    });
}


// Показываем ошибку
function showError(input, text) {
    const message =
        input.parentElement.querySelector(
            '.error-message'
        );

    input.classList.add('invalid');

    message.textContent = text;
}


// Проверяем одно поле
function validateField(input) {
    input.classList.remove('invalid');

    const message =
        input.parentElement.querySelector(
            '.error-message'
        );

    message.textContent = '';


    if (input.validity.valueMissing) {
        showError(
            input,
            'Это поле обязательно'
        );

        return false;
    }


    if (input.validity.tooShort) {
        showError(
            input,
            'Введите не менее ' +
            input.minLength +
            ' символов'
        );

        return false;
    }


    if (input.validity.rangeUnderflow) {
        showError(
            input,
            'Минимум: ' + input.min
        );

        return false;
    }


    if (input.validity.rangeOverflow) {
        showError(
            input,
            'Максимум: ' + input.max
        );

        return false;
    }


    return true;
}


// Проверяем всю форму
function validateForm() {
    const fields =
        studentForm.querySelectorAll(
            'input, select, textarea'
        );

    let formIsValid = true;


    fields.forEach(function (field) {
        if (validateField(field) === false) {
            formIsValid = false;
        }
    });


    return formIsValid;
}


// Добавление ученика через POST
studentForm.addEventListener(
    'submit',
    async function (event) {
        event.preventDefault();


        if (validateForm() === false) {
            return;
        }


        const newStudent = {
            name:
                nameInput.value.trim(),

            class_number:
                Number(classInput.value),

            subject:
                subjectInput.value,

            description:
                descriptionInput.value.trim(),

            homework:
                homeworkInput.value
        };


        const response = await fetch(
            API_URL,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify(newStudent)
            }
        );


        if (!response.ok) {
            alert(
                'Ошибка при добавлении ученика'
            );

            return;
        }


        closeModal();

        await loadStudents();
    }
);


// Изменение домашнего задания через PATCH
studentsGrid.addEventListener(
    'change',
    async function (event) {
        const select =
            event.target.closest(
                '.homework-select'
            );


        if (select === null) {
            return;
        }


        const studentId =
            Number(select.dataset.id);


        const response = await fetch(
            API_URL + '/' + studentId,
            {
                method: 'PATCH',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({
                    homework: select.value
                })
            }
        );


        if (!response.ok) {
            alert(
                'Ошибка при изменении ДЗ'
            );

            return;
        }


        await loadStudents();
    }
);


// Удаление ученика через DELETE
studentsGrid.addEventListener(
    'click',
    async function (event) {
        const deleteButton =
            event.target.closest(
                '.delete-button'
            );


        if (deleteButton === null) {
            return;
        }


        const card =
            deleteButton.closest(
                '.student-card'
            );


        const studentId =
            Number(card.dataset.id);


        const student =
            state.items.find(
                function (item) {
                    return item.id === studentId;
                }
            );


        if (student === undefined) {
            return;
        }


        const confirmed =
            window.confirm(
                'Вы точно хотите удалить ученика «' +
                student.name +
                '»?'
            );


        if (confirmed === false) {
            return;
        }


        const response = await fetch(
            API_URL + '/' + studentId,
            {
                method: 'DELETE'
            }
        );


        if (response.status !== 204) {
            alert(
                'Ошибка при удалении ученика'
            );

            return;
        }


        await loadStudents();
    }
);


// Первый запуск
loadStudents();