document.addEventListener('DOMContentLoaded', function () {
    const subjectsList = document.getElementById('subjects-list');
    const addSubjectBtn = document.getElementById('add-subject');
    const gradesForm = document.getElementById('grades-form');
    const resultDiv = document.getElementById('result');
    const resetBtn = document.getElementById('reset-form');

    // Список предметов для выпадающего списка (дублируется для синхронизации)
    const subjectOptions = `
        <option value="" disabled selected>Выберите предмет</option>
        <option>Русский язык</option>
        <option>Литература</option>
        <option>Математика</option>
        <option>Алгебра</option>
        <option>Геометрия</option>
        <option>История</option>
        <option>Всеобщая история</option>
        <option>Обществознание</option>
        <option>География</option>
        <option>Биология</option>
        <option>Физика</option>
        <option>Химия</option>
        <option>Информатика</option>
        <option>Иностранный язык</option>
        <option>Английский язык</option>
        <option>Немецкий язык</option>
        <option>Французский язык</option>
        <option>Испанский язык</option>
        <option>Физкультура</option>
        <option>ОБЖ</option>
        <option>Искусство</option>
        <option>Музыка</option>
        <option>МХК</option>
        <option>Технология</option>
        <option>Черчение</option>
        <option>Экономика</option>
        <option>Право</option>
        <option>Астрономия</option>
        <option>Экология</option>
        <option>Родной язык</option>
        <option>Родная литература</option>
        <option>Литературное чтение</option>
        <option>Основы духовно-нравственной культуры народов России</option>
        <option>Проектная деятельность</option>
        <option>Индивидуальный проект</option>
    `;

    // Сохранение данных в localStorage
    function saveData() {
        const data = Array.from(subjectsList.querySelectorAll('.subject-row')).map(row => ({
            subject: row.querySelector('.subject-name').value,
            grade: row.querySelector('.subject-grade').value
        }));
        const result = resultDiv.textContent;
        localStorage.setItem('gradesData', JSON.stringify({data, result}));
    }

    // Восстановление данных из localStorage
    function loadData() {
        const saved = localStorage.getItem('gradesData');
        if (!saved) return;
        const {data, result} = JSON.parse(saved);
        subjectsList.innerHTML = '';
        (data.length ? data : [{}]).forEach(item => {
            const row = document.createElement('div');
            row.className = 'subject-row';
            row.innerHTML = `
                <select class="subject-name" required>${subjectOptions}</select>
                <input type="number" class="subject-grade" min="2" max="5" placeholder="Оценка" required>
                <button type="button" class="remove-subject" title="Удалить предмет">−</button>
            `;
            if (item.subject) row.querySelector('.subject-name').value = item.subject;
            if (item.grade) row.querySelector('.subject-grade').value = item.grade;
            subjectsList.appendChild(row);
        });
        resultDiv.textContent = result || '';
    }

    // Добавить новый предмет
    addSubjectBtn.addEventListener('click', function () {
        const row = document.createElement('div');
        row.className = 'subject-row';
        row.innerHTML = `
            <select class="subject-name" required>${subjectOptions}</select>
            <input type="number" class="subject-grade" min="2" max="5" placeholder="Оценка" required>
            <button type="button" class="remove-subject" title="Удалить предмет">−</button>
        `;
        subjectsList.appendChild(row);
        saveData();
    });

    // Удалить предмет
    subjectsList.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-subject')) {
            const rows = subjectsList.querySelectorAll('.subject-row');
            if (rows.length > 1) {
                e.target.parentElement.remove();
                saveData();
            }
        }
    });

    // Сохранять при изменении значений
    subjectsList.addEventListener('input', saveData);

    // Расчёт среднего балла
    gradesForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const grades = Array.from(subjectsList.querySelectorAll('.subject-grade'))
            .map(input => Number(input.value))
            .filter(val => !isNaN(val) && val >= 2 && val <= 5);
        if (grades.length === 0) {
            resultDiv.textContent = 'Пожалуйста, введите хотя бы одну оценку.';
            saveData();
            return;
        }
        const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
        resultDiv.textContent = `Средний балл: ${avg.toFixed(2)}`;
        saveData();
    });

    // Сбросить данные
    resetBtn.addEventListener('click', function () {
        subjectsList.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'subject-row';
        row.innerHTML = `
            <select class="subject-name" required>${subjectOptions}</select>
            <input type="number" class="subject-grade" min="2" max="5" placeholder="Оценка" required>
            <button type="button" class="remove-subject" title="Удалить предмет">−</button>
        `;
        subjectsList.appendChild(row);
        resultDiv.textContent = '';
        localStorage.removeItem('gradesData');
    });

    // Восстановить при загрузке
    loadData();
});
