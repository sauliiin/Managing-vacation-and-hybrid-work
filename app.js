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
// LISTA DE FERIADOS E AVATARES
// =================================================================
const holidays = [
    '2025-08-15', '2025-10-27', '2025-11-15', '2025-11-20', '2025-11-21',
    '2025-12-08', '2025-12-25', '2025-12-31', '2026-01-01', '2026-01-02',
    '2026-02-16', '2026-02-17', '2026-04-03', '2026-04-21', '2026-05-01',
    '2026-06-04', '2026-09-07', '2026-10-12', '2026-11-02', '2026-11-15',
    '2026-12-25'
];

const availableAvatars = [
    'yoda.png', 'ben.png', 'trump.png', 'lula.png', 'goku.jpg', `capivaraFeliz.jpg`,
    'Chloe.png', 'pepa.png', 'magali.png', `capivaraMood.jpg`
];

const YODA_LOGIN = 'pr1182589';

// =================================================================
// PASSO 2: DADOS DOS USUÁRIOS
// =================================================================
const usersData = {
    'pr1182589': { name: 'Mestre Yoda', role: 'Gerente', schedule: ['mon', 'tue', 'wed', 'thu', 'fri'], scheduleType: 'fixed', color: '#3cb44b', avatar: 'img/yoda.png' },
    'pr115447': { name: 'Bibi Perigosa', displayLetter: 'Bi', role: 'Administrativo', schedule: ['thu', 'tue', 'wed'], scheduleType: '2_3', color: '#ffe119', avatar: 'img/pepa.png' },
    'pr101546': { name: 'Fernanda', displayLetter: 'Fe', role: 'Secretário', scheduleType: '2_3', schedule_2_days: ['tue', 'thu'], schedule_3_days: ['mon', 'tue', 'thu'], color: '#4363d8', avatar: 'img/Chloe.png', meetingDay: 'tue' },
    'pr82925': { name: 'Gabi', displayLetter: 'Ga', role: 'Secretário', scheduleType: '2_3', schedule_2_days: ['mon', 'fri'], schedule_3_days: ['mon', 'thu', 'fri'], color: '#f58231', avatar: 'img/magali.png', meetingDay: 'wed' },
    'pr106995': { name: 'Gigi', displayLetter: 'Gi', role: 'Secretário', scheduleType: '2_3', schedule_2_days: ['tue', 'wed'], schedule_3_days: ['tue', 'wed', 'thu'], color: '#911eb4', avatar: 'img/capivara.jpg', meetingDay: 'thu' },
    'pr100369': { name: 'Marcelle', displayLetter: 'M', role: 'Secretário', scheduleType: '2_3', schedule_2_days: ['mon', 'wed', 'fri'], schedule_3_days: ['wed', 'fri'], color: '#42d4f4', avatar: 'img/lula.png', meetingDay: 'fri' },
    'pr115627': { name: 'Pedrin do coração', displayLetter: 'P', role: 'Administrativo', schedule_2_days: ['tue', 'thu'], schedule_3_days: ['tue', 'wed', 'thu'], scheduleType: '3_2', color: '#f032e6', avatar: 'img/trump.png' },
    'pres324670': { name: 'Samuquinha', displayLetter: 'S', role: 'Administrativo', schedule: ['mon', 'wed', 'fri'], scheduleType: 'fixed', color: '#bfef45', avatar: 'img/goku.jpg' },
    'prps019624': { name: 'Mestre Gabe, o melhor!', displayLetter: 'MG', role: 'Administrativo', schedule: ['wed', 'fri', 'mon'], scheduleType: '2_3', color: '#fabed4', avatar: 'img/ben.png' },
    'pr100921': { name: 'Shirlike', displayLetter: 'Sh', role: 'Secretário', schedule: ['mon'], scheduleType: 'fixed', color: '#469990', avatar: 'img/Chloe.png', meetingDay: 'mon' },
    'pr1005047': { name: 'Tatyellen', displayLetter: 'T', role: 'Secretário', schedule: ['wed'], scheduleType: 'fixed', color: '#dcbeff', avatar: 'img/pepa.png', meetingDay: 'wed' },
};

let currentUserLogin = null;
let currentHybridDate = new Date();
let currentPresenceDate = new Date();
let substitutionsNeeded = [];
let allDbData = {};

// =================================================================
// PASSO 3: INICIALIZAÇÃO E CONTROLE DA INTERFACE
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    createRouletteModal();
});

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
    setupAvatarModalEvents();
    setupPasswordModalEvents();
}

function onUserSelect() {
    const selectedLogin = document.getElementById('user-select').value;
    const appContainer = document.getElementById('app-container');
    const profileContainer = document.getElementById('profile-picture-container');

    if (selectedLogin === YODA_LOGIN && currentUserLogin !== YODA_LOGIN) {
        const passwordModal = document.getElementById('password-modal');
        const passwordInput = document.getElementById('jedi-password-input');
        passwordModal.style.display = 'flex';
        passwordInput.value = '';
        passwordInput.focus();
        return;
    }

    currentUserLogin = selectedLogin;

    if (currentUserLogin) {
        const userData = usersData[currentUserLogin];
        document.getElementById('welcome-message').textContent = `Gerenciando dados de: ${userData.name}`;
        appContainer.style.display = 'block';
        profileContainer.style.display = 'block';
        loadUserProfile(currentUserLogin);
        loadUserVacations();
        renderHybridCalendar();
    } else {
        document.getElementById('welcome-message').textContent = '';
        appContainer.style.display = 'none';
        profileContainer.style.display = 'none';
    }
}

function setupPasswordModalEvents() {
    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('jedi-password-input');
    const confirmButton = document.getElementById('jedi-password-confirm');
    const closeButton = document.getElementById('close-password-modal');
    const userSelect = document.getElementById('user-select');
    const JEDI_PASSWORD = 'Mestre@Yoda';

    const handleConfirm = () => {
        if (passwordInput.value === JEDI_PASSWORD) {
            passwordModal.style.display = 'none';
            currentUserLogin = YODA_LOGIN;
            userSelect.value = YODA_LOGIN;
            onUserSelect();
        } else {
            alert('Senha do Conselho incorreta! Tente novamente, jovem Padawan.');
            passwordInput.focus();
        }
    };

    const handleCancel = () => {
        passwordModal.style.display = 'none';
        if (userSelect.value === YODA_LOGIN) {
            userSelect.value = '';
            onUserSelect();
        }
    };

    confirmButton.addEventListener('click', handleConfirm);
    closeButton.addEventListener('click', handleCancel);

    passwordInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleConfirm();
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === passwordModal) {
            handleCancel();
        }
    });
}

async function loadUserProfile(login) {
    const profileImg = document.getElementById('profile-img');
    try {
        const docRef = db.collection('funcionarios').doc(login);
        const doc = await docRef.get();
        let avatarUrl = usersData[login]?.avatar || '';
        if (doc.exists && doc.data().avatar) {
            avatarUrl = doc.data().avatar;
        }
        profileImg.src = avatarUrl;
    } catch (error) {
        console.error("Erro ao carregar perfil do usuário:", error);
        if (usersData[login]) {
            profileImg.src = usersData[login].avatar;
        }
    }
}

async function saveAvatar(login, avatarUrl) {
    if (!login) return;
    try {
        await db.collection('funcionarios').doc(login).set({
            avatar: avatarUrl
        }, { merge: true });
        console.log("Avatar salvo com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar avatar:", error);
        alert("Não foi possível salvar seu novo avatar. Tente novamente.");
    }
}

function setupAvatarModalEvents() {
    const modal = document.getElementById('avatar-modal');
    const profileImg = document.getElementById('profile-img');
    const closeModalBtn = modal.querySelector('.close-modal-button');

    profileImg.addEventListener('click', () => {
        if (currentUserLogin) openAvatarModal();
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function openAvatarModal() {
    const modal = document.getElementById('avatar-modal');
    const avatarGrid = document.getElementById('avatar-grid');
    avatarGrid.innerHTML = '';

    availableAvatars.forEach(avatarFile => {
        const img = document.createElement('img');
        const fullPath = `img/${avatarFile}`;
        img.src = fullPath;
        img.classList.add('avatar-option');
        img.alt = avatarFile;
        img.title = `Selecionar ${avatarFile.split('.')[0]}`;

        img.addEventListener('click', async () => {
            document.getElementById('profile-img').src = fullPath;
            await saveAvatar(currentUserLogin, fullPath);
            modal.style.display = 'none';
        });

        avatarGrid.appendChild(img);
    });

    modal.style.display = 'flex';
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
    if (!currentUserLogin) return;
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
    if (!currentUserData) return;
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
// PASSO 5: LÓGICA DO MAPA DE FÉRIAS E SUBSTITUIÇÃO
// =================================================================

async function refreshSubstitutionData() {
    substitutionsNeeded = [];
    allDbData = {};
    const querySnapshot = await db.collection('funcionarios').get();
    const dayMap = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5 };

    querySnapshot.forEach(doc => {
        allDbData[doc.id] = doc.data();
        const docData = doc.data();
        const userLogin = doc.id;
        const localUserData = usersData[userLogin];

        if (localUserData && docData.vacationPeriods) {
            docData.vacationPeriods.forEach(period => {
                if (period.start && period.end && localUserData.role === 'Secretário' && localUserData.meetingDay) {
                    const meetingDayIndex = dayMap[localUserData.meetingDay];
                    let currentDate = new Date(period.start + 'T12:00:00Z');
                    const endDate = new Date(period.end + 'T12:00:00Z');

                    while (currentDate <= endDate) {
                        if (isBusinessDay(currentDate) && currentDate.getUTCDay() === meetingDayIndex) {
                            substitutionsNeeded.push({
                                date: new Date(currentDate),
                                employeeId: userLogin,
                                employeeName: docData.name,
                                substituteId: null,
                            });
                        }
                        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
                    }
                }
            });
        }
    });
    substitutionsNeeded.sort((a, b) => a.date - b.date);
}

async function renderVacationMap() {
    const mapListDiv = document.getElementById('vacation-map-list');
    mapListDiv.innerHTML = 'Carregando...';
    
    await refreshSubstitutionData(); 
    
    const allVacationsForDisplay = [];
    Object.values(allDbData).forEach(docData => {
        if (docData.vacationPeriods) {
            docData.vacationPeriods.forEach(period => {
                if (period.start && period.end) {
                    allVacationsForDisplay.push({
                        date: new Date(period.start + 'T12:00:00Z'),
                        text: `${docData.name || 'Nome não encontrado'}: ${formatDate(period.start)} a ${formatDate(period.end)}`
                    });
                }
            });
        }
    });

    allVacationsForDisplay.sort((a, b) => a.date - b.date);
    mapListDiv.innerHTML = '';
    if (allVacationsForDisplay.length === 0) {
        mapListDiv.textContent = "Nenhuma férias marcada.";
    } else {
        let currentMonth = -1;
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        allVacationsForDisplay.forEach(vacation => {
            const vacationMonth = vacation.date.getUTCMonth();
            const vacationYear = vacation.date.getUTCFullYear();
            if (vacationMonth !== currentMonth) {
                currentMonth = vacationMonth;
                const monthHeader = document.createElement('h4');
                monthHeader.textContent = `${monthNames[currentMonth]} de ${vacationYear}`;
                mapListDiv.appendChild(monthHeader);
            }
            const p = document.createElement('p');
            p.textContent = vacation.text;
            mapListDiv.appendChild(p);
        });
    }

    await loadAndApplySavedSubstitutions();
}


async function loadAndApplySavedSubstitutions() {
    if (substitutionsNeeded.length > 0) {
        const docIdsToFetch = substitutionsNeeded.map(sub => `${sub.employeeId}_${sub.date.toISOString().slice(0, 10)}`);
        const promises = docIdsToFetch.map(id => db.collection('substituicoes').doc(id).get());
        const results = await Promise.all(promises);

        results.forEach(doc => {
            if (doc.exists) {
                const data = doc.data();
                const subNeeded = substitutionsNeeded.find(s =>
                    s.employeeId === data.employeeOnVacationId && s.date.toISOString().slice(0, 10) === data.date
                );
                if (subNeeded) {
                    // Guarda o estado atual da seleção (que veio do banco)
                    subNeeded.substituteId = data.substituteId;
                    
                    // ⭐ NOVO: Guarda o estado ORIGINAL em uma propriedade separada.
                    // Isso é crucial para detectar se um usuário está tentando ALTERAR um dado já salvo.
                    subNeeded.savedSubstituteId = data.substituteId; 
                }
            }
        });
    }
    renderAlertsAndResultsUI();
}

/**
 * Renderiza os alertas de substituição e os resultados da roleta.
 * ATUALIZADO: Agora exibe todas as substituições necessárias,
 * diferenciando visualmente as que já foram resolvidas (com substituto salvo)
 * das que ainda estão pendentes.
 */
function renderAlertsAndResultsUI() {
    const alertContainerDiv = document.getElementById('vacation-alert-container');
    alertContainerDiv.innerHTML = ''; // Limpa o conteúdo anterior

    // Verifica se há alguma necessidade de substituição
    if (substitutionsNeeded.length > 0) {
        const alertTitle = document.createElement('h4');
        alertTitle.style.color = '#dc3545'; // Vermelho para chamar atenção
        alertTitle.textContent = 'ALERTA! Necessário substituição nas datas:';
        alertContainerDiv.appendChild(alertTitle);

        // Ordena as substituições por data para uma exibição lógica
        substitutionsNeeded.sort((a, b) => a.date - b.date);

        // Itera por TODAS as substituições necessárias, não apenas as pendentes
        substitutionsNeeded.forEach(sub => {
            const p = document.createElement('p');
            p.style.fontWeight = '500'; // Deixa o texto um pouco mais forte

            // ⭐ LÓGICA PRINCIPAL DA MUDANÇA ⭐
            // Verifica se um substituto JÁ FOI atribuído e salvo para esta data
            if (sub.substituteId) {
                // Se sim, busca o nome do substituto
                const substituteName = usersData[sub.substituteId]?.name || 'Substituto Desconhecido';
                
                // Formata a string conforme solicitado, com o nome do substituto e o emoji
                p.innerHTML = `${formatDate(sub.date)} (${sub.employeeName}) - <strong>${substituteName}</strong> ✅`;
                p.style.color = '#198754'; // Verde para indicar sucesso/resolvido
            } else {
                // Se não houver substituto, exibe como pendente
                p.textContent = `${formatDate(sub.date)} (${sub.employeeName})`;
                p.style.color = '#dc3545'; // Vermelho para indicar pendência
            }
            alertContainerDiv.appendChild(p);
        });

    } else {
        // Mensagem padrão se não houver nenhuma substituição necessária
        const p = document.createElement('p');
        p.textContent = "Nenhuma substituição necessária no momento.";
        alertContainerDiv.appendChild(p);
    }

    // Adiciona o botão da Roleta Maluca
    const rouletteButton = document.createElement('button');
    rouletteButton.id = 'global-roulette-button';
    rouletteButton.textContent = 'Roleta Maluca';
    rouletteButton.onclick = runGlobalCrazyRoulette;
    alertContainerDiv.appendChild(rouletteButton);

    // Adiciona o container para os resultados da roleta
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'global-roulette-results';
    alertContainerDiv.appendChild(resultsDiv);

    // Mostra o botão de limpar dados para o Mestre Yoda
    if (currentUserLogin === YODA_LOGIN) {
        const clearButton = document.createElement('button');
        clearButton.id = 'clear-roulette-button';
        clearButton.textContent = 'Limpar Dados da Roleta';
        clearButton.className = 'btn-danger';
        clearButton.style.marginTop = '20px';
        clearButton.onclick = clearRouletteData;
        alertContainerDiv.appendChild(clearButton);
    }
    
    // Renderiza os resultados da última rodada da roleta, se houver
    if (substitutionsNeeded.length > 0) {
        renderSubstitutionResults();
    }
}

// =================================================================
// ⭐⭐ INÍCIO DA LÓGICA CORRIGIDA E APRIMORADA DA ROLETA MALUCA ⭐⭐
// =================================================================

// Mapeamento dos nomes para IDs para criar as regras de cobertura.
const secretaryMap = {
    'Shirlike': 'pr100921',
    'Fernanda': 'pr101546',
    'Gabi': 'pr82925',
    'Tatyellen': 'pr1005047',
    'Gigi': 'pr106995',
    'Marcelle': 'pr100369'
};

/**
 * REGRA B (ATUALIZADA): Matriz de quem pode cobrir quem.
 * A chave é o ID da pessoa de férias, e o valor é um array com os IDs de quem pode substituí-la.
 */
const coverageRules = {
    // Quem pode cobrir a Shirlike (segunda)? -> Gabi, Tatyellen, Gigi
    [secretaryMap.Shirlike]: [secretaryMap.Gabi, secretaryMap.Tatyellen, secretaryMap.Gigi],
    // Quem pode cobrir a Fernanda (terça)? -> Gabi, Tatyellen, Gigi
    [secretaryMap.Fernanda]: [secretaryMap.Gabi, secretaryMap.Tatyellen, secretaryMap.Gigi],
    // Quem pode cobrir a Gabi (quarta)? -> Shirlike, Fernanda, Marcelle
    [secretaryMap.Gabi]: [secretaryMap.Shirlike, secretaryMap.Fernanda, secretaryMap.Marcelle],
    // Quem pode cobrir a Tatyellen (quarta)? -> Shirlike, Gigi, Marcelle
    [secretaryMap.Tatyellen]: [secretaryMap.Shirlike, secretaryMap.Gigi, secretaryMap.Marcelle],
    // Quem pode cobrir a Gigi (quinta)? -> Shirlike, Fernanda, Marcelle
    [secretaryMap.Gigi]: [secretaryMap.Shirlike, secretaryMap.Fernanda, secretaryMap.Marcelle],
    // Quem pode cobrir a Marcelle (sexta)? -> Fernanda, Gabi, Tatyellen
    [secretaryMap.Marcelle]: [secretaryMap.Fernanda, secretaryMap.Gabi, secretaryMap.Tatyellen]
};

/**
 * Função auxiliar que verifica se um funcionário está de férias em uma data específica.
 * @param {string} employeeId - O ID do funcionário a ser verificado.
 * @param {Date} date - A data a ser verificada.
 * @returns {boolean} - True se o funcionário estiver de férias, false caso contrário.
 */
function isEmployeeOnVacation(employeeId, date) {
    const vacationPeriods = allDbData[employeeId]?.vacationPeriods;
    if (!vacationPeriods) return false;
    const checkDate = new Date(date);
    checkDate.setUTCHours(0, 0, 0, 0);

    for (const period of vacationPeriods) {
        if (period.start && period.end) {
            const start = new Date(period.start + 'T00:00:00Z');
            const end = new Date(period.end + 'T00:00:00Z');
            if (checkDate >= start && checkDate <= end) return true;
        }
    }
    return false;
}

/**
 * Encontra todos os substitutos elegíveis para uma ausência específica, aplicando as Regras A e B.
 * @param {object} sub - O objeto da substituição necessária.
 * @returns {string[]} - Um array com os IDs dos substitutos elegíveis.
 */
function findEligibleSubstitutesFor(sub) {
    // REGRA B: Quem pode cobrir a pessoa ausente, de acordo com a matriz de regras atualizada.
    const allowedByMatrix = coverageRules[sub.employeeId] || [];

    // REGRA A: Filtra a lista, removendo qualquer pessoa que também esteja de férias na mesma data.
    const eligibleCandidates = allowedByMatrix.filter(candidateId => {
        return !isEmployeeOnVacation(candidateId, sub.date);
    });
    
    // Fallback: Se NINGUÉM da lista de regras estiver disponível, considera TODAS as outras secretárias que não estejam de férias.
    if (eligibleCandidates.length === 0) {
        const allOtherSecretaries = Object.keys(usersData).filter(id => 
            usersData[id].role === 'Secretário' && id !== sub.employeeId
        );
        const fallbackCandidates = allOtherSecretaries.filter(id => !isEmployeeOnVacation(id, sub.date));
        return fallbackCandidates;
    }

    return eligibleCandidates;
}


/**
 * Algoritmo principal que atribui substitutos para todas as ausências pendentes.
 * Foca em seguir as Regras C e D para uma distribuição justa e rotativa.
 */
function assignSubstitutes() {
    const pendingSubs = substitutionsNeeded.filter(sub => !sub.substituteId);
    if (pendingSubs.length === 0) return;

    pendingSubs.sort((a, b) => a.date - b.date);

    const assignmentCounts = {};
    const allSecretaries = Object.keys(usersData).filter(id => usersData[id].role === 'Secretário');
    allSecretaries.forEach(id => { assignmentCounts[id] = 0; });
    
    substitutionsNeeded.forEach(sub => {
        if (sub.substituteId && assignmentCounts[sub.substituteId] !== undefined) {
            assignmentCounts[sub.substituteId]++;
        }
    });

    let lastAssignedId = null;

    for (const sub of pendingSubs) {
        let eligibleCandidates = findEligibleSubstitutesFor(sub);

        if (eligibleCandidates.length === 0) {
            console.warn(`Nenhum substituto elegível encontrado para ${sub.employeeName} em ${formatDate(sub.date)}.`);
            continue;
        }

        // REGRA C (APRIMORADA): Se houver mais de uma opção, TENTA remover a pessoa que cobriu o dia anterior.
        if (lastAssignedId && eligibleCandidates.length > 1) {
            const candidatesWithoutLast = eligibleCandidates.filter(id => id !== lastAssignedId);
            if (candidatesWithoutLast.length > 0) {
                eligibleCandidates = candidatesWithoutLast; // Usa a lista filtrada se ela não ficou vazia
            }
        }
        
        let minAssignments = Infinity;
        eligibleCandidates.forEach(id => {
            if (assignmentCounts[id] < minAssignments) {
                minAssignments = assignmentCounts[id];
            }
        });

        const bestCandidates = eligibleCandidates.filter(id => assignmentCounts[id] === minAssignments);
        
        const randomIndex = Math.floor(Math.random() * bestCandidates.length);
        const chosenSubstituteId = bestCandidates[randomIndex];

        if (chosenSubstituteId) {
            sub.substituteId = chosenSubstituteId;
            assignmentCounts[chosenSubstituteId]++;
            lastAssignedId = chosenSubstituteId; // Guarda o ID do último escalado
        } else {
            lastAssignedId = null; // Reseta se ninguém foi escalado
        }
    }
}


/**
 * Função principal acionada pelo botão "Roleta Maluca".
 */
async function runGlobalCrazyRoulette() {
    const rouletteButton = document.getElementById('global-roulette-button');
    if (rouletteButton) rouletteButton.disabled = true;

    try {
        await refreshSubstitutionData();
        await loadAndApplySavedSubstitutions();

        showRoulette(() => {
            assignSubstitutes();
            renderSubstitutionResults();
            if (rouletteButton) rouletteButton.disabled = false;
        });

    } catch (error) {
        console.error("Erro ao executar a roleta:", error);
        alert("Ocorreu um erro ao preparar a roleta. Verifique o console para mais detalhes (F12).");
        if (rouletteButton) rouletteButton.disabled = false;
    }
}


/**
 * Renderiza os resultados na tela, permitindo o override manual.
 */
function renderSubstitutionResults() {
    const resultsDiv = document.getElementById('global-roulette-results');
    resultsDiv.innerHTML = `<h4>Resultado da Roleta Maluca:</h4>`;
    
    const isOnVacation = (id, date) => isEmployeeOnVacation(id, date);

    if (substitutionsNeeded.length === 0) {
         resultsDiv.innerHTML += `<p>Nenhuma substituição foi necessária.</p>`;
         return;
    }
    
    // Ordena para exibição
    substitutionsNeeded.sort((a,b) => a.date - b.date);

    substitutionsNeeded.forEach(sub => {
        const resultLine = document.createElement('div');
        resultLine.className = 'substitution-result-line';
        const label = document.createElement('span');
        label.textContent = `${formatDate(sub.date)} (${sub.employeeName}) → `;
        resultLine.appendChild(label);

        const manualOverrideOptions = Object.keys(usersData).filter(id =>
            usersData[id].role === 'Secretário' &&
            id !== sub.employeeId &&
            !isOnVacation(id, sub.date)
        );

        if (manualOverrideOptions.length > 0) {
            const select = document.createElement('select');
            select.className = 'manual-override-select';
            select.dataset.subDate = sub.date.toISOString().slice(0, 10);
            select.dataset.employeeId = sub.employeeId;

            select.onchange = (e) => {
                const changedSub = substitutionsNeeded.find(s => 
                    s.date.toISOString().slice(0, 10) === e.target.dataset.subDate &&
                    s.employeeId === e.target.dataset.employeeId
                );
                if (changedSub) {
                    changedSub.substituteId = e.target.value;
                }
            };

            const emptyOption = document.createElement('option');
            emptyOption.textContent = "Escolha...";
            emptyOption.value = "";
            select.appendChild(emptyOption);
            
            manualOverrideOptions.forEach(id => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = usersData[id].name;
                select.appendChild(option);
            });

            select.value = sub.substituteId || "";

            resultLine.appendChild(select);
        } else {
            const noSub = document.createElement('span');
            noSub.style.color = 'red';
            noSub.textContent = 'Nenhum substituto elegível!';
            resultLine.appendChild(noSub);
        }
        resultsDiv.appendChild(resultLine);
    });

    const oldSaveButton = document.getElementById('save-substitutions-button');
    if (oldSaveButton) oldSaveButton.remove();

    if (substitutionsNeeded.length > 0) {
        const saveButton = document.createElement('button');
        saveButton.id = 'save-substitutions-button';
        saveButton.textContent = 'Salvar Resultados no Banco de Dados';
        saveButton.style.marginTop = '15px';
        saveButton.onclick = saveSubstitutionsToDB;
        resultsDiv.appendChild(saveButton);
    }
}

/**
 * Salva as substituições (calculadas ou alteradas manualmente) no Firestore.
 */
/**
 * Salva as substituições no Firestore, com regras de permissão.
 * - Usuários comuns só podem salvar substituições para datas PENDENTES.
 * - Apenas o Mestre Yoda pode ALTERAR uma substituição já existente.
 */
async function saveSubstitutionsToDB() {
    const saveButton = document.getElementById('save-substitutions-button');
    if (saveButton) saveButton.disabled = true;

    const batch = db.batch();
    let changesToCommit = 0;
    const conflictMessages = [];

    substitutionsNeeded.forEach(sub => {
        // Ignora se não houver substituto selecionado
        if (!sub.substituteId || sub.substituteId === "") return;

        // ==================================================
        // ⭐ LÓGICA DE CONFLITO E PERMISSÃO ⭐
        // ==================================================
        const isChangingSavedData = sub.savedSubstituteId && sub.substituteId !== sub.savedSubstituteId;
        const isNotJedi = currentUserLogin !== YODA_LOGIN;

        // CONFLITO: Ocorre se um usuário que NÃO é o Yoda tenta alterar um dado já salvo.
        if (isChangingSavedData && isNotJedi) {
            const originalSubstituteName = usersData[sub.savedSubstituteId]?.name || 'Desconhecido';
            const conflictMessage = `Por favor, solicite a um Mestre Jedi a alteração: ${formatDate(sub.date)} (${sub.employeeName}) - ${originalSubstituteName} ✅`;
            conflictMessages.push(conflictMessage);
            
            // Pula a adição desta alteração ao batch
            return; 
        }

        // Se não houver conflito, prepara para salvar.
        // Isso inclui: 1. Inserir um novo substituto; 2. Mestre Yoda alterando um existente.
        changesToCommit++;
        const subDateStr = sub.date.toISOString().slice(0, 10);
        const subRef = db.collection('substituicoes').doc(`${sub.employeeId}_${subDateStr}`);
        batch.set(subRef, {
            date: subDateStr,
            employeeOnVacationId: sub.employeeId,
            employeeOnVacationName: sub.employeeName,
            substituteId: sub.substituteId,
            substituteName: usersData[sub.substituteId].name,
            savedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }); // Usar merge para segurança
    });

    // Se houver conflitos, exibe um alerta consolidado para o usuário.
    if (conflictMessages.length > 0) {
        alert(conflictMessages.join('\n'));
    }

    // Se não houver alterações válidas para salvar, apenas para.
    if (changesToCommit === 0) {
        alert("Nenhuma nova substituição válida para salvar.");
        if (saveButton) saveButton.disabled = false;
        // Recarrega o mapa para reverter visualmente as alterações bloqueadas nos dropdowns
        await renderVacationMap(); 
        return;
    }

    // Se houver alterações válidas, executa o salvamento no banco.
    try {
        await batch.commit();
        alert(`${changesToCommit} substituição(ões) salva(s) com sucesso!`);
        // Recarrega o mapa de férias para refletir os dados atualizados do banco
        await renderVacationMap();
    } catch (error) {
        console.error("Erro ao salvar substituições: ", error);
        alert("Ocorreu um erro ao salvar os dados. Verifique o console.");
        if (saveButton) saveButton.disabled = false;
    }
}


/**
 * Função de Mestre Yoda para limpar todos os dados da roleta do banco de dados.
 */
async function clearRouletteData() {
    const confirmation1 = confirm("ATENÇÃO, MESTRE YODA!\n\nVocê tem CERTEZA que deseja apagar TODOS os resultados da Roleta Maluca? Esta ação é irreversível.");
    if (!confirmation1) {
        alert("Ação cancelada. Os dados permanecem seguros.");
        return;
    }
    const confirmation2 = prompt("Para confirmar definitivamente, digite a frase 'apagar dados da roleta' no campo abaixo.");
    if (confirmation2 !== "apagar dados da roleta") {
        alert("A frase digitada não corresponde. Ação cancelada para sua segurança.");
        return;
    }
    const button = document.getElementById('clear-roulette-button');
    if (button) button.disabled = true;
    try {
        alert("Apagando os dados... Por favor, aguarde.");
        
        const subsSnapshot = await db.collection('substituicoes').get();
        if(subsSnapshot.empty) {
            alert("Nenhum dado de substituição para apagar.");
            if (button) button.disabled = false;
            return;
        }

        const batch = db.batch();
        subsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        alert("Todos os dados da Roleta Maluca foram apagados com sucesso!");
        await renderVacationMap();

    } catch (error) {
        console.error("Erro ao apagar dados da roleta: ", error);
        alert("Ocorreu um erro ao apagar os dados. Verifique o console para mais detalhes.");
    } finally {
        if (button) button.disabled = false;
    }
}

/**
 * Renderiza os resultados na tela, permitindo o override manual.
 */
function renderSubstitutionResults() {
    const resultsDiv = document.getElementById('global-roulette-results');
    resultsDiv.innerHTML = `<h4>Resultado da Roleta Maluca:</h4>`;
    
    // Função auxiliar para verificar férias (evita chamar a função global muitas vezes)
    const isOnVacation = (id, date) => isEmployeeOnVacation(id, date);

    if (substitutionsNeeded.length === 0) {
         resultsDiv.innerHTML += `<p>Nenhuma substituição foi necessária.</p>`;
         return;
    }

    substitutionsNeeded.forEach(sub => {
        const resultLine = document.createElement('div');
        resultLine.className = 'substitution-result-line';
        const label = document.createElement('span');
        label.textContent = `${formatDate(sub.date)} (${sub.employeeName}) → `;
        resultLine.appendChild(label);

        // Opções para o dropdown de override manual
        const manualOverrideOptions = Object.keys(usersData).filter(id =>
            usersData[id].role === 'Secretário' &&
            id !== sub.employeeId &&
            !isOnVacation(id, sub.date)
        );

        if (manualOverrideOptions.length > 0) {
            const select = document.createElement('select');
            select.className = 'manual-override-select';
            select.dataset.subDate = sub.date.toISOString().slice(0, 10);
            select.dataset.employeeId = sub.employeeId;

            select.onchange = (e) => {
                const changedSub = substitutionsNeeded.find(s => 
                    s.date.toISOString().slice(0, 10) === e.target.dataset.subDate &&
                    s.employeeId === e.target.dataset.employeeId
                );
                if (changedSub) {
                    changedSub.substituteId = e.target.value;
                }
            };

            // Opção vazia
            const emptyOption = document.createElement('option');
            emptyOption.textContent = sub.substituteId ? usersData[sub.substituteId].name : "Escolha...";
            emptyOption.value = sub.substituteId || "";
            select.appendChild(emptyOption);
            
            // Preenche o select com as outras opções
            manualOverrideOptions.forEach(id => {
                if(id === sub.substituteId) return; // Já foi adicionado
                const option = document.createElement('option');
                option.value = id;
                option.textContent = usersData[id].name;
                select.appendChild(option);
            });

            // Garante que o valor correto esteja selecionado
            select.value = sub.substituteId || "";

            resultLine.appendChild(select);
        } else {
            const noSub = document.createElement('span');
            noSub.style.color = 'red';
            noSub.textContent = 'Nenhum substituto elegível!';
            resultLine.appendChild(noSub);
        }
        resultsDiv.appendChild(resultLine);
    });

    const oldSaveButton = document.getElementById('save-substitutions-button');
    if (oldSaveButton) oldSaveButton.remove();

    if (substitutionsNeeded.length > 0) {
        const saveButton = document.createElement('button');
        saveButton.id = 'save-substitutions-button';
        saveButton.textContent = 'Salvar Resultados no Banco de Dados';
        saveButton.style.marginTop = '15px';
        saveButton.onclick = saveSubstitutionsToDB;
        resultsDiv.appendChild(saveButton);
    }
}

/**
 * Salva as substituições no Firestore, com regras de permissão.
 * - Usuários comuns só podem salvar substituições para datas PENDENTES.
 * - Apenas o Mestre Yoda pode ALTERAR uma substituição já existente.
 * * CORRIGIDO: Usa um loop for...of para um controle de fluxo explícito e correto.
 */
async function saveSubstitutionsToDB() {
    const saveButton = document.getElementById('save-substitutions-button');
    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = 'Salvando...';
    }

    const batch = db.batch();
    let changesToCommit = 0;
    const conflictMessages = [];

    // Usando 'for...of' para ter controle explícito com 'continue'
    for (const sub of substitutionsNeeded) {
        const subDateStr = sub.date.toISOString().slice(0, 10);
        
        // Log para depuração: mostra o estado do item antes de decidir
        console.log(`Verificando: ${subDateStr} (${sub.employeeName})`, {
            selected: sub.substituteId,
            saved: sub.savedSubstituteId,
            user: currentUserLogin
        });

        // Ignora se não houver substituto selecionado na UI
        if (!sub.substituteId || sub.substituteId === "") {
            continue; // Pula para a próxima iteração
        }
        
        // ==================================================
        // ⭐ LÓGICA DE CONFLITO E PERMISSÃO (REVISADA) ⭐
        // ==================================================
        const isChangingSavedData = sub.savedSubstituteId && sub.substituteId !== sub.savedSubstituteId;
        const isNotJedi = currentUserLogin !== YODA_LOGIN;

        // CONFLITO: Ocorre se um usuário que NÃO é o Yoda tenta alterar um dado já salvo.
        if (isChangingSavedData && isNotJedi) {
            const originalSubstituteName = usersData[sub.savedSubstituteId]?.name || 'Desconhecido';
            const conflictMessage = `Por favor, solicite a um Mestre Jedi a alteração: ${formatDate(sub.date)} (${sub.employeeName}) - ${originalSubstituteName} ✅`;
            conflictMessages.push(conflictMessage);

            console.warn('CONFLITO DETECTADO!', { sub, conflictMessage });
            
            // Pula a adição desta alteração ao batch, passando para o próximo item
            continue; 
        }

        // Se não houver conflito, prepara para salvar.
        // Isso inclui: 1. Inserir um novo substituto; 2. Mestre Yoda alterando um existente.
        changesToCommit++;
        const subRef = db.collection('substituicoes').doc(`${sub.employeeId}_${subDateStr}`);
        batch.set(subRef, {
            date: subDateStr,
            employeeOnVacationId: sub.employeeId,
            employeeOnVacationName: sub.employeeName,
            substituteId: sub.substituteId,
            substituteName: usersData[sub.substituteId].name,
            savedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log('OK para salvar:', { sub });
    }

    // --- Lógica Pós-Loop ---

    // 1. Se houver conflitos, exibe um alerta consolidado para o usuário.
    if (conflictMessages.length > 0) {
        alert('Atenção:\n\n' + conflictMessages.join('\n'));
    }

    // 2. Se não houver alterações válidas para salvar, apenas para e reativa o botão.
    if (changesToCommit === 0) {
        if (conflictMessages.length === 0) { // Só mostra este alerta se não houver conflitos
            alert("Nenhuma nova substituição válida para salvar.");
        }
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = 'Salvar Resultados no Banco de Dados';
        }
        // Recarrega o mapa para reverter visualmente as alterações bloqueadas
        await renderVacationMap(); 
        return;
    }

    // 3. Se houver alterações válidas, executa o salvamento no banco.
    try {
        await batch.commit();
        alert(`${changesToCommit} substituição(ões) salva(s) com sucesso!`);
    } catch (error) {
        console.error("Erro ao salvar substituições: ", error);
        alert("Ocorreu um erro ao salvar os dados. Verifique o console.");
    } finally {
        // Garante que o mapa seja recarregado e o botão reativado em qualquer cenário
        await renderVacationMap();
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = 'Salvar Resultados no Banco de Dados';
        }
    }
}


/**
 * Função de Mestre Yoda para limpar todos os dados da roleta do banco de dados.
 */
async function clearRouletteData() {
    const confirmation1 = confirm("ATENÇÃO, MESTRE YODA!\n\nVocê tem CERTEZA que deseja apagar TODOS os resultados da Roleta Maluca? Esta ação é irreversível.");
    if (!confirmation1) {
        alert("Ação cancelada. Os dados permanecem seguros.");
        return;
    }
    const confirmation2 = prompt("Para confirmar definitivamente, digite a frase 'apagar dados da roleta' no campo abaixo.");
    if (confirmation2 !== "apagar dados da roleta") {
        alert("A frase digitada não corresponde. Ação cancelada para sua segurança.");
        return;
    }
    const button = document.getElementById('clear-roulette-button');
    if (button) button.disabled = true;
    try {
        alert("Apagando os dados... Por favor, aguarde.");
        
        const subsSnapshot = await db.collection('substituicoes').get();
        if(subsSnapshot.empty) {
            alert("Nenhum dado de substituição para apagar.");
            if (button) button.disabled = false;
            return;
        }

        const batch = db.batch();
        subsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        alert("Todos os dados da Roleta Maluca foram apagados com sucesso!");
        await renderVacationMap(); // Atualiza a UI

    } catch (error) {
        console.error("Erro ao apagar dados da roleta: ", error);
        alert("Ocorreu um erro ao apagar os dados. Verifique o console para mais detalhes.");
    } finally {
        if (button) button.disabled = false;
    }
}

async function clearRouletteData() {
    const confirmation1 = confirm("ATENÇÃO, MESTRE YODA!\n\nVocê tem CERTEZA que deseja apagar TODOS os resultados da Roleta Maluca? Esta ação é irreversível.");
    if (!confirmation1) {
        alert("Ação cancelada. Os dados permanecem seguros.");
        return;
    }
    const confirmation2 = prompt("Para confirmar definitivamente, digite a frase 'apagar dados da roleta' no campo abaixo.");
    if (confirmation2 !== "apagar dados da roleta") {
        alert("A frase digitada não corresponde. Ação cancelada para sua segurança.");
        return;
    }
    const button = document.getElementById('clear-roulette-button');
    if (button) button.disabled = true;
    try {
        alert("Apagando os dados... Por favor, aguarde.");
        
        const subsSnapshot = await db.collection('substituicoes').get();
        const batch = db.batch();
        subsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        const cycleRef = db.collection('estado_roleta').doc('ciclo_atual');
        batch.delete(cycleRef);

        await batch.commit();
        alert("Todos os dados da Roleta Maluca foram apagados com sucesso!");
        await renderVacationMap();

    } catch (error) {
        console.error("Erro ao apagar dados da roleta: ", error);
        alert("Ocorreu um erro ao apagar os dados. Verifique o console para mais detalhes.");
    } finally {
        if (button) button.disabled = false;
    }
}

// =================================================================
// LÓGICA DA ANIMAÇÃO DA ROLETA (Versão Conic-Gradient)
// =================================================================
const SECRETARY_IDS_FOR_ANIMATION = ['pr101546', 'pr82925', 'pr106995', 'pr100369', 'pr100921', 'pr1005047'];

function createRouletteModal() {
    const modalHTML = `
        <div id="roulette-modal" class="roulette-modal">
            <div class="roulette-container">
                <div class="roulette-pointer"></div>
                <div id="roulette-wheel" class="roulette-wheel"></div>
                <button id="spin-button">Girar!</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showRoulette(onSpinEndCallback) {
    const modal = document.getElementById('roulette-modal');
    const wheel = document.getElementById('roulette-wheel');
    const spinButton = document.getElementById('spin-button');
    wheel.innerHTML = '';
    wheel.style.background = '';
    modal.classList.add('visible');
    const numSegments = SECRETARY_IDS_FOR_ANIMATION.length;
    const angleStep = 360 / numSegments;
    const gradientColors = ['#1abc9c', '#16a085'];
    let gradientString = 'conic-gradient(';
    for (let i = 0; i < numSegments; i++) {
        const startAngle = i * angleStep;
        const endAngle = (i + 1) * angleStep;
        const color = gradientColors[i % 2];
        gradientString += `${color} ${startAngle}deg ${endAngle}deg`;
        if (i < numSegments - 1) {
            gradientString += ', ';
        }
    }
    gradientString += ')';
    wheel.style.background = gradientString;
    const wheelRadius = 190;
    const labelRadius = wheelRadius * 0.65;
    SECRETARY_IDS_FOR_ANIMATION.forEach((id, index) => {
        const label = document.createElement('div');
        label.className = 'roulette-label';
        label.textContent = usersData[id]?.name || 'Desconhecido';
        const labelAngle = (index * angleStep) + (angleStep / 2);
        const angleRad = (labelAngle - 90) * (Math.PI / 180);
        const x = wheelRadius + labelRadius * Math.cos(angleRad);
        const y = wheelRadius + labelRadius * Math.sin(angleRad);
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        wheel.appendChild(label);
    });
    spinButton.onclick = () => spinTheWheel(onSpinEndCallback);
    spinButton.disabled = false;
}

function spinTheWheel(onSpinEndCallback) {
    const modal = document.getElementById('roulette-modal');
    const wheel = document.getElementById('roulette-wheel');
    const spinButton = document.getElementById('spin-button');
    spinButton.disabled = true;
    const numSegments = SECRETARY_IDS_FOR_ANIMATION.length;
    const angleStep = 360 / numSegments;
    const winningIndex = Math.floor(Math.random() * numSegments);
    const targetAngle = -(winningIndex * angleStep + angleStep / 2);
    const randomSpins = 4 + Math.floor(Math.random() * 4);
    const finalAngle = targetAngle + (360 * randomSpins);
    wheel.style.transform = `rotate(${finalAngle}deg)`;
    setTimeout(() => {
        if (onSpinEndCallback) {
            onSpinEndCallback();
        }
        modal.classList.remove('visible');
        setTimeout(() => {
            wheel.style.transition = 'none';
            wheel.style.transform = 'rotate(0deg)';
            setTimeout(() => {
                wheel.style.transition = 'transform 5s ease-out';
            }, 20);
        }, 500);
    }, 5000);
}

// =================================================================
// PASSO 6: FUNÇÕES AUXILIARES E DE VISUALIZAÇÃO RESTANTES
// =================================================================
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
            if (user) {
                const circle = document.createElement('div');
                circle.className = 'user-presence-circle';
                circle.style.backgroundColor = user.color;
                circle.textContent = user.displayLetter || user.name.charAt(0);
                dayCell.innerHTML = '';
                dayCell.appendChild(circle);
                dayCell.insertAdjacentHTML('beforeend', `<span style="font-size:10px; display:block; margin-top:2px;">${i}</span>`);
            }
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

function isPresentialDay(login, date) {
    const user = usersData[login];
    if (!user || !isBusinessDay(date)) return false;

    const dayOfWeekStr = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getUTCDay()];

    if (user.scheduleType === 'fixed') {
        return user.schedule.includes(dayOfWeekStr);
    }
    
    const referenceDate = new Date('2025-08-04T12:00:00Z');
    const referenceWeek = getWeekNumber(referenceDate);
    const currentWeek = getWeekNumber(date);
    const isFirstWeekType = (currentWeek % 2) === (referenceWeek % 2);

    const daysThisWeek = (user.scheduleType === '3_2' && isFirstWeekType) || (user.scheduleType === '2_3' && !isFirstWeekType) ? 3 : 2;

    let presentialDaysForThisWeek = [];

    if (daysThisWeek === 2 && user.schedule_2_days) {
        presentialDaysForThisWeek = user.schedule_2_days;
    } else if (daysThisWeek === 3 && user.schedule_3_days) {
        presentialDaysForThisWeek = user.schedule_3_days;
    } else {
        presentialDaysForThisWeek = user.schedule ? user.schedule.slice(0, daysThisWeek) : [];
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