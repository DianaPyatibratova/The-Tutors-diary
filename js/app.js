const STORAGE_KEY = 'tutorStudents';


const defaultStudents = [
    {
        id: 1,
        name: 'Андрей',
        classNumber: 8,
        subject: 'Алгебра',
        description: 'Подготовка по алгебре.',
        homework: 'Задано'
    },

    {
        id: 2,
        name: 'Диана',
        classNumber: 9,
        subject: 'Математика',
        description: 'Подготовка к ОГЭ по математике.',
        homework: 'Выполнено'
    },

    {
        id: 3,
        name: 'Аяз',
        classNumber: 9,
        subject: 'Информатика',
        description: 'Подготовка к ОГЭ по информатике.',
        homework: 'Задано'
    },

    {
        id: 4,
        name: 'Элина',
        classNumber: 4,
        subject: 'Математика',
        description: 'Подготовка по математике.',
        homework: 'Задано'
    },

    {
        id: 5,
        name: 'Никита',
        classNumber: 8,
        subject: 'Математика',
        description: 'Повышение успеваемости по математике.',
        homework: 'Выполнено'
    },

    {
        id: 6,
        name: 'Дима',
        classNumber: 9,
        subject: 'Информатика',
        description: 'Подготовка к ОГЭ по информатике.',
        homework: 'Не задано'
    }
];



/* Состояние приложения */

const state = {
    items: loadStudents(),
    searchQuery: '',
    selectedCategory: 'all',
    sortBy: 'name-asc'
};



/* Получаем элементы страницы */

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



/* Загрузка данных из localStorage */

function loadStudents() {

    const savedStudents = localStorage.getItem(STORAGE_KEY);


    if (!savedStudents) {
        return [...defaultStudents];
    }


    try {

        const parsedStudents = JSON.parse(savedStudents);


        if (Array.isArray(parsedStudents)) {
            return parsedStudents;
        }


        return [...defaultStudents];

    } catch (error) {

        console.error('Ошибка чтения localStorage:', error);

        return [...defaultStudents];

    }

}



/* Сохранение данных */

function saveStudents() {

    const json = JSON.stringify(state.items);

    localStorage.setItem(STORAGE_KEY, json);

}



/* Создание строки с информацией */

function createInfoRow(title, value) {

    const paragraph = document.createElement('p');

    const titleElement = document.createElement('span');


    titleElement.textContent = title;


    paragraph.append(titleElement);

    paragraph.append(
        document.createTextNode(` ${value}`)
    );


    return paragraph;

}



/* Создание карточки ученика */

function createStudentCard(student) {

    const article = document.createElement('article');

    article.className = 'student-card';

    article.dataset.id = student.id;



    /* Верхняя часть */

    const header = document.createElement('div');

    header.className = 'student-card__header';



    const avatar = document.createElement('div');

    avatar.className = 'student-avatar';

    avatar.textContent = student.name.charAt(0).toUpperCase();



    const studentTitle = document.createElement('div');


    const name = document.createElement('h3');

    name.textContent = student.name;


    const classText = document.createElement('p');

    classText.textContent = `${student.classNumber} класс`;


    studentTitle.append(name, classText);


    header.append(avatar, studentTitle);



    /* Описание */

    const description = document.createElement('p');

    description.className = 'student-card__description';

    description.textContent = student.description;



    /* Информация */

    const info = document.createElement('div');

    info.className = 'student-info';


    const subjectRow = createInfoRow(
        'Предмет:',
        student.subject
    );


    const homeworkRow = createInfoRow(
        'Домашнее задание:',
        student.homework
    );


    info.append(
        subjectRow,
        homeworkRow
    );



    /* Кнопка удаления */

    const deleteButton = document.createElement('button');

    deleteButton.type = 'button';

    deleteButton.className = 'delete-button';

    deleteButton.dataset.action = 'delete';

    deleteButton.textContent = 'Удалить';



    article.append(
        header,
        description,
        info,
        deleteButton
    );


    return article;

}



/* Получение отфильтрованных данных */

function getVisibleStudents() {

    const searchText = state.searchQuery.toLowerCase();


    let result = state.items.filter(student => {

        const studentName = student.name.toLowerCase();

        const studentDescription =
            student.description.toLowerCase();


        const matchesSearch =
            studentName.includes(searchText) ||
            studentDescription.includes(searchText);


        const matchesCategory =
            state.selectedCategory === 'all' ||
            student.subject === state.selectedCategory;


        return matchesSearch && matchesCategory;

    });



    /* Создаём копию массива перед сортировкой */

    result = [...result];


    if (state.sortBy === 'name-asc') {

        result.sort((a, b) => {

            return a.name.localeCompare(
                b.name,
                'ru'
            );

        });

    }


    if (state.sortBy === 'name-desc') {

        result.sort((a, b) => {

            return b.name.localeCompare(
                a.name,
                'ru'
            );

        });

    }


    return result;

}



/* Перерисовка интерфейса */

function render() {

    studentsGrid.replaceChildren();


    const visibleStudents = getVisibleStudents();


    visibleStudents.forEach(student => {

        const card = createStudentCard(student);

        studentsGrid.append(card);

    });


    emptyMessage.hidden =
        visibleStudents.length !== 0;

}



/* Поиск */

searchInput.addEventListener('input', event => {

    state.searchQuery = event.target.value;

    render();

});



/* Фильтрация */

subjectFilter.addEventListener('change', event => {

    state.selectedCategory = event.target.value;

    render();

});



/* Сортировка */

sortSelect.addEventListener('change', event => {

    state.sortBy = event.target.value;

    render();

});



/* Открытие модального окна */

function openModal() {

    modal.classList.add('active');

    modal.setAttribute(
        'aria-hidden',
        'false'
    );

    document.body.classList.add('modal-open');


    nameInput.focus();

}



/* Закрытие модального окна */

function closeModal() {

    modal.classList.remove('active');

    modal.setAttribute(
        'aria-hidden',
        'true'
    );

    document.body.classList.remove('modal-open');


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



/* Закрытие клавишей Escape */

document.addEventListener('keydown', event => {

    if (
        event.key === 'Escape' &&
        modal.classList.contains('active')
    ) {

        closeModal();

    }

});



/* Очистка ошибок */

function clearErrors() {

    const fields = studentForm.querySelectorAll(
        'input, select, textarea'
    );


    fields.forEach(field => {

        field.classList.remove('invalid');

    });


    const errors = studentForm.querySelectorAll(
        '.error-message'
    );


    errors.forEach(error => {

        error.textContent = '';

    });

}



/* Показ ошибки */

function showError(input, errorElement, message) {

    input.classList.add('invalid');

    errorElement.textContent = message;

}



/* Проверка одного поля */

function validateField(input) {

    const errorElement =
        input.parentElement.querySelector(
            '.error-message'
        );


    input.classList.remove('invalid');

    errorElement.textContent = '';



    if (input.validity.valueMissing) {

        showError(
            input,
            errorElement,
            'Это поле обязательно для заполнения'
        );

        return false;

    }



    if (input.validity.tooShort) {

        showError(
            input,
            errorElement,
            `Минимальная длина: ${input.minLength} символа`
        );

        return false;

    }



    if (input.validity.rangeUnderflow) {

        showError(
            input,
            errorElement,
            `Минимальное значение: ${input.min}`
        );

        return false;

    }



    if (input.validity.rangeOverflow) {

        showError(
            input,
            errorElement,
            `Максимальное значение: ${input.max}`
        );

        return false;

    }


    return true;

}



/* Проверка всей формы */

function validateForm() {

    let isValid = true;


    const fields = studentForm.querySelectorAll(
        'input, select, textarea'
    );


    fields.forEach(field => {

        const fieldValid =
            validateField(field);


        if (!fieldValid) {
            isValid = false;
        }

    });


    return isValid;

}



/* Добавление ученика */

studentForm.addEventListener(
    'submit',
    event => {

        event.preventDefault();


        const formIsValid =
            validateForm();


        if (!formIsValid) {
            return;
        }



        const newStudent = {

            id: Date.now(),

            name:
                nameInput.value.trim(),

            classNumber:
                Number(classInput.value),

            subject:
                subjectInput.value,

            description:
                descriptionInput.value.trim(),

            homework:
                homeworkInput.value

        };



        state.items = [
            ...state.items,
            newStudent
        ];


        saveStudents();


        render();


        closeModal();

    }
);



/* Проверка поля при изменении */

studentForm.addEventListener(
    'input',
    event => {

        const input = event.target;


        if (
            input.matches(
                'input, textarea'
            )
        ) {

            validateField(input);

        }

    }
);



studentForm.addEventListener(
    'change',
    event => {

        const input = event.target;


        if (input.matches('select')) {

            validateField(input);

        }

    }
);



/* Удаление через делегирование событий */

studentsGrid.addEventListener(
    'click',
    event => {

        const deleteButton =
            event.target.closest(
                '.delete-button'
            );


        if (!deleteButton) {
            return;
        }


        const card =
            deleteButton.closest(
                '.student-card'
            );


        if (!card) {
            return;
        }


        const studentId =
            Number(card.dataset.id);


        state.items =
            state.items.filter(
                student =>
                    student.id !== studentId
            );


        saveStudents();


        render();

    }
);



/* Первый запуск */

render();