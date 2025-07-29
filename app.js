// =================================================================
// PASSO 1: CONFIGURAÇÃO INICIAL
// =================================================================

const firebaseConfig = {
    apiKey: "AIzaSyDM66hHUOkfAP3FrnfcQaF2aRiY_2jhnTM",
    authDomain: "controle-de-ferias-45d25.firebaseapp.com",
    projectId: "controle-de-ferias-45d25",
    storageBucket: "controle-de-ferias-45d25.appspot.com",
    messagingSenderId: "298345781850",
    appId: "1:298345781850:web:0d21bb20a7fad821de9663"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// =================================================================
// LISTA DE FERIADOS (Fácil de editar)
// =================================================================
const holidays = [
    '2025-11-15', '2025-11-20', '2025-12-25', '2026-01-01', '2026-02-16', 
    '2026-02-17', '2026-04-03', '2026-04-21', '2026-05-01', '2026-06-04', 
    '2026-09-07', '2026-10-12', '2026-11-02', '2026-11-15', '2026-12-25',
];

// =================================================================
// PASSO 2: DADOS DOS USUÁRIOS (COM SUAS ATUALIZAÇÕES)
// =================================================================

const usersData = {
    'pr1182589': { 
        name: 'Mestre Yoda', 
        role: 'Gerente', schedule: ['mon', 'tue', 'wed', 'thu', 'fri'], 
        scheduleType: 'fixed', color: '#3cb44b' },
    'pr115447': { 
        name: 'Bibi Perigosa', 
        displayLetter: 'Bi', role: 
        'Administrativo', schedule: ['thu', 'tue', 'wed'], 
        scheduleType: '2_3', 
        color: '#ffe119' },

    'pr101546': { 
        name: 'Fernanda',
        displayLetter: 'Fe', 
        role: 'Secretário', 
        scheduleType: '2_3', 
        schedule_2_days: ['mon', 'thu'], 
        schedule_3_days: ['mon', 'tue', 'thu'], 
        color: '#4363d8' 
    },
    'pr82925': { 
        name: 'Gabi',
        displayLetter: 'Ga',  
        role: 'Secretário', 
        scheduleType: '2_3', 
        schedule_2_days: ['mon', 'fri'], 
        schedule_3_days: ['mon', 'thu', 'fri'], 
        color: '#f58231' 
    },
    'pr82925': { 
        name: 'Gigi', 
        displayLetter: 'Gi', 
        role: 'Secretário', 
        scheduleType: '2_3', 
        schedule_2_days: ['mon', 'fri'], 
        schedule_3_days: ['tue', 'wed', 'thu'], 
        color: '#911eb4' 
    },
    'pr82925': { 
        name: 'Marcelle', 
        displayLetter: 'M', 
        role: 'Secretário', 
        scheduleType: '2_3', 
        schedule_2_days: ['mon', 'wed', 'fri'],
        schedule_3_days: ['wed', 'fri'], 
        color: '#42d4f4' 
    },
    'pr115627': { 
        name: 'Pedrin do coração', 
        displayLetter: 'P', 
        role: 'Administrativo', 
        schedule_2_days: ['mon', 'fri'], 
        schedule_3_days: ['mon', 'wed', 'fri'], 
        scheduleType: '3_2', 
        color: '#f032e6' },
    'pres324670': { 
        name: 'Samuquinha', 
        displayLetter: 'S', 
        role: 'Administrativo', 
        schedule: ['mon', 'wed', 'fri'], 
        scheduleType: 'fixed', 
        color: '#bfef45' },
    'prps019624': { 
        name: 'Mestre Gabe, o melhor!', 
        displayLetter: 'MG', 
        role: 'Administrativo', 
        schedule: ['wed', 'fri', 'mon'], 
        scheduleType: '2_3', 
        color: '#fabed4' },
    'pr100921': { 
        name: 'Shirlike', 
        displayLetter: 'Sh', 
        role: 'Secretário', 
        schedule: ['wed', 'tue', 'mon'], // <-- A ORDEM FOI ALTERADA AQUI
        scheduleType: '3_2', 
        color: '#469990' 
    },
    'pr1005047': { 
        name: 'Tatyellen', 
        displayLetter: 'T', 
        role: 'Secretário', 
        schedule: ['mon', 'tue', 'thu'], 
        scheduleType: '3_2', 
        color: '#dcbeff' },
};

let currentUserLogin = null;
let currentHybridDate = new Date();
let currentPresenceDate = new Date();

// =================================================================
// PASSO 3: INICIALIZAÇÃO E CONTROLE DA INTERFACE
// =================================================================
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    const userSelect = document.getElementById('user-select');
    Object.keys(usersData).forEach(login => {
        const option = document.createElement('option');
        option.value = login;
        option.textContent = usersData[login].name;
        userSelect.appendChild(option);
    });
    userSelect.addEventListener('change', onUserSelect);
    renderVacationMap();
    renderPresenceTable();
    setupNavEventListeners();
}

function onUserSelect() {
    currentUserLogin = document.getElementById('user-select').value;
    const appContainer = document.getElementById('app-container');
    if (currentUserLogin) {
        const userData = usersData[currentUserLogin];
        document.getElementById('welcome-message').textContent = `Gerenciando dados de: ${userData.name}`;
        appContainer.style.display = 'block';
        loadUserVacations();
        renderHybridCalendar();
    } else {
        appContainer.style.display = 'none';
    }
}

// =================================================================
// PASSO 4: LÓGICA DE FÉRIAS
// =================================================================
function addVacationPeriod(period = { start: '', end: '' }) {
    const vacationPeriodsDiv = document.getElementById('vacation-periods');
    if (vacationPeriodsDiv.children.length >= 3) {
        alert("Você só pode adicionar até 3 períodos de férias.");
        return;
    }
    const periodId = `period-${Date.now()}`;
    const periodDiv = document.createElement('div');
    periodDiv.id = periodId;
    periodDiv.innerHTML = `
        <label>Início:</label> <input type="date" class="vacation-start" value="${period.start}">
        <label>Fim:</label> <input type="date" class="vacation-end" value="${period.end}">
        <button onclick="document.getElementById('${periodId}').remove(); updateTotalBusinessDays();">Remover</button>
    `;
    vacationPeriodsDiv.appendChild(periodDiv);
    periodDiv.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', updateTotalBusinessDays);
    });
}

function isBusinessDay(date) {
    const day = date.getUTCDay();
    if (day === 0 || day === 6) return false;
    const dateString = date.toISOString().slice(0, 10);
    if (holidays.includes(dateString)) return false;
    return true;
}

function calculateBusinessDays(start, end) {
    if (!start || !end || new Date(end) < new Date(start)) return 0;
    let count = 0;
    const current = new Date(start + 'T12:00:00Z');
    const endDate = new Date(end + 'T12:00:00Z');
    while (current <= endDate) {
        if (isBusinessDay(current)) {
            count++;
        }
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return count;
}

function updateTotalBusinessDays() {
    let total = 0;
    document.querySelectorAll('#vacation-periods > div').forEach(div => {
        const start = div.querySelector('.vacation-start').value;
        const end = div.querySelector('.vacation-end').value;
        total += calculateBusinessDays(start, end);
    });
    const totalBusinessDaysEl = document.getElementById('total-business-days');
    totalBusinessDaysEl.textContent = total;
    totalBusinessDaysEl.style.color = total > 25 ? '#d9534f' : 'black';
}

async function loadUserVacations() {
    const vacationPeriodsDiv = document.getElementById('vacation-periods');
    vacationPeriodsDiv.innerHTML = '';
    const docRef = db.collection('funcionarios').doc(currentUserLogin);
    const doc = await docRef.get();
    if (doc.exists && doc.data().vacationPeriods) {
        doc.data().vacationPeriods.forEach(period => addVacationPeriod(period));
    }
    updateTotalBusinessDays();
}

async function saveVacations() {
    if (!currentUserLogin) return;
    const vacationError = document.getElementById('vacation-error');
    vacationError.textContent = '';
    document.getElementById('vacation-conflict').textContent = '';

    const periods = [];
    let totalDays = 0;
    let hasError = false;

    document.querySelectorAll('#vacation-periods > div').forEach(div => {
        const start = div.querySelector('.vacation-start').value;
        const end = div.querySelector('.vacation-end').value;
        if (start && end) {
            if (new Date(end) < new Date(start)) {
                hasError = true;
                vacationError.textContent = "Erro: A data final não pode ser anterior à data inicial.";
            }
            periods.push({ start, end });
            totalDays += calculateBusinessDays(start, end);
        }
    });

    if (hasError) return;
    if (totalDays > 25) {
        vacationError.textContent = "Erro: O total de dias úteis não pode exceder 25.";
        return;
    }

    try {
        await db.collection('funcionarios').doc(currentUserLogin).set({
            name: usersData[currentUserLogin].name,
            role: usersData[currentUserLogin].role,
            vacationPeriods: periods
        }, { merge: true });
        alert('Férias salvas com sucesso!');
        await checkVacationConflicts(periods);
        await renderVacationMap();
    } catch (error) {
        console.error("Erro ao salvar férias: ", error);
        alert("Ocorreu um erro ao salvar. Tente novamente.");
    }
}

async function checkVacationConflicts(userPeriods) {
    const currentUserData = usersData[currentUserLogin];
    const conflictGroup = (currentUserData.role === 'Secretário') ? ['Secretário'] : ['Administrativo', 'Gerente'];
    const querySnapshot = await db.collection('funcionarios').where('role', 'in', conflictGroup).get();
    let conflictMessage = '';
    querySnapshot.forEach(doc => {
        const otherUserLogin = doc.id;
        if (otherUserLogin === currentUserLogin || !doc.data().vacationPeriods) return;
        const otherUserName = doc.data().name;
        for (const userPeriod of userPeriods) {
            for (const otherPeriod of doc.data().vacationPeriods) {
                const userStart = new Date(userPeriod.start);
                const userEnd = new Date(userPeriod.end);
                const otherStart = new Date(otherPeriod.start);
                const otherEnd = new Date(otherPeriod.end);
                if (userStart <= otherEnd && userEnd >= otherStart) {
                    if (!conflictMessage.includes(otherUserName)) {
                        conflictMessage += `${otherUserName}, `;
                    }
                }
            }
        }
    });
    if (conflictMessage) {
        document.getElementById('vacation-conflict').textContent = `Atenção: Suas férias conflitam com as de: ${conflictMessage.slice(0, -2)}.`;
    }
}

// =================================================================
// PASSO 5: LÓGICA DOS PAINÉIS DE VISUALIZAÇÃO
// =================================================================
async function renderVacationMap() {
    const mapDiv = document.getElementById('vacation-map');
    mapDiv.innerHTML = 'Carregando mapa de férias...';
    const querySnapshot = await db.collection('funcionarios').get();
    const allVacations = [];
    querySnapshot.forEach(doc => {
        if (doc.data().vacationPeriods) {
            doc.data().vacationPeriods.forEach(period => {
                if (period.start) {
                    allVacations.push({
                        date: new Date(period.start),
                        text: `${doc.data().name}: ${formatDate(period.start)} a ${formatDate(period.end)}`
                    });
                }
            });
        }
    });
    allVacations.sort((a, b) => a.date - b.date);
    mapDiv.innerHTML = '';
    let currentMonth = -1;
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    if (allVacations.length === 0) {
        mapDiv.textContent = "Nenhuma férias marcada no momento.";
        return;
    }
    allVacations.forEach(vacation => {
        const vacationMonth = vacation.date.getUTCMonth();
        const vacationYear = vacation.date.getUTCFullYear();
        if (vacationMonth !== currentMonth) {
            currentMonth = vacationMonth;
            const monthHeader = document.createElement('h4');
            monthHeader.textContent = `${monthNames[currentMonth]} de ${vacationYear}`;
            mapDiv.appendChild(monthHeader);
        }
        const p = document.createElement('p');
        p.textContent = vacation.text;
        mapDiv.appendChild(p);
    });
}

function renderHybridCalendar() {
    const calendarGrid = document.getElementById('hybrid-calendar');
    calendarGrid.innerHTML = '';
    const month = currentHybridDate.getMonth();
    const year = currentHybridDate.getFullYear();
    document.getElementById('current-month-hybrid').textContent = `${currentHybridDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`;
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        calendarGrid.appendChild(document.createElement('div'));
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = i;
        const currentDate = new Date(Date.UTC(year, month, i));
        if (!isBusinessDay(currentDate)) {
            dayCell.classList.add('non-business-day');
        } else if (currentUserLogin && isPresentialDay(currentUserLogin, currentDate)) {
            const user = usersData[currentUserLogin];
            const circle = document.createElement('div');
            circle.className = 'user-presence-circle';
            circle.style.backgroundColor = user.color;
            circle.textContent = user.displayLetter || user.name.charAt(0);
            dayCell.innerHTML = '';
            dayCell.appendChild(circle);
            dayCell.insertAdjacentHTML('beforeend', `<span style="font-size:10px; display:block; margin-top:2px;">${i}</span>`);
        }
        calendarGrid.appendChild(dayCell);
    }
}

function renderPresenceTable() {
    const tableHead = document.querySelector('#presence-table thead');
    const tableBody = document.getElementById('presence-table-body');
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    const startOfWeek = new Date(currentPresenceDate);
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1));
    document.getElementById('current-week-presence').textContent = `Semana de ${formatDate(startOfWeek)}`;
    
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Funcionário</th>';
    const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

    for (let i = 0; i < 5; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        const utcDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
        const th = document.createElement('th');
        th.textContent = weekDays[i];
        if (!isBusinessDay(utcDate)) {
            th.classList.add('non-business-day-cell');
        }
        headerRow.appendChild(th);
    }
    tableHead.appendChild(headerRow);

    Object.keys(usersData).forEach(login => {
        const user = usersData[login];
        const row = document.createElement('tr');
        row.innerHTML = `<td>${user.name}</td>`;
        for (let i = 0; i < 5; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            const utcDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
            const td = document.createElement('td');
            const isPresent = isPresentialDay(login, utcDate);
            if (isPresent) {
                td.textContent = 'X';
                td.classList.add('present');
            }
            if (!isBusinessDay(utcDate)) {
                td.classList.add('non-business-day-cell');
            }
            row.appendChild(td);
        }
        tableBody.appendChild(row);
    });
}

// =================================================================
// PASSO 6: FUNÇÕES AUXILIARES E EVENTOS
// =================================================================

// ⭐ ATUALIZADO: Lógica para checar dia presencial agora inclui as regras especiais
function isPresentialDay(login, date) {
    const user = usersData[login];
    if (!user || !isBusinessDay(date)) return false;

    const dayOfWeekStr = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getUTCDay()];

    if (user.scheduleType === 'fixed') {
        return user.schedule.includes(dayOfWeekStr);
    }
    
    // Define a referência da semana ímpar/par
    const referenceDate = new Date('2025-08-04T12:00:00Z'); // Semana de 04/08 é ímpar (tipo 1)
    const referenceWeek = getWeekNumber(referenceDate);
    const currentWeek = getWeekNumber(date);
    const isFirstWeekType = (currentWeek % 2) === (referenceWeek % 2);

    // Determina quantos dias trabalhar na semana
    const daysThisWeek = (user.scheduleType === '3_2' && isFirstWeekType) || (user.scheduleType === '2_3' && !isFirstWeekType) ? 3 : 2;

    let presentialDaysForThisWeek = [];

    // Lógica para dias específicos (Fernanda e Gabi)
    if (daysThisWeek === 2 && user.schedule_2_days) {
        presentialDaysForThisWeek = user.schedule_2_days;
    } else if (daysThisWeek === 3 && user.schedule_3_days) {
        presentialDaysForThisWeek = user.schedule_3_days;
    } else {
        // Lógica padrão para os demais
        presentialDaysForThisWeek = user.schedule.slice(0, daysThisWeek);
    }
    
    return presentialDaysForThisWeek.includes(dayOfWeekStr);
}


function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function formatDate(dateInput) {
    let date;
    if (typeof dateInput === 'string') {
        date = new Date(dateInput + 'T12:00:00Z');
    } else {
        date = dateInput;
    }
    if (isNaN(date.getTime())) {
        return 'Data Inválida';
    }
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}

function setupNavEventListeners() {
    document.getElementById('add-period-button').addEventListener('click', () => addVacationPeriod());
    document.getElementById('confirm-vacation-button').addEventListener('click', saveVacations);
    document.getElementById('prev-month-hybrid').addEventListener('click', () => {
        currentHybridDate.setMonth(currentHybridDate.getMonth() - 1);
        renderHybridCalendar();
    });
    document.getElementById('next-month-hybrid').addEventListener('click', () => {
        currentHybridDate.setMonth(currentHybridDate.getMonth() + 1);
        renderHybridCalendar();
    });
    document.getElementById('prev-week-presence').addEventListener('click', () => {
        currentPresenceDate.setDate(currentPresenceDate.getDate() - 7);
        renderPresenceTable();
    });
    document.getElementById('next-week-presence').addEventListener('click', () => {
        currentPresenceDate.setDate(currentPresenceDate.getDate() + 7);
        renderPresenceTable();
    });
}