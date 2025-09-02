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
// LISTA DE FERIADOS E AVATARES (DADOS INICIAIS)
// =================================================================
// ⭐ MODIFICADO: Estes são agora os dados INICIAIS para semear o banco.
// Os dados reais serão carregados do Firestore para as variáveis globais abaixo.
const initialHolidays = [
    '2025-08-15', '2025-10-27', '2025-11-15', '2025-11-20', '2025-11-21',
    '2025-12-08', '2025-12-25', '2025-12-31', '2026-01-01', '2026-01-02',
    '2026-02-16', '2026-02-17', '2026-04-03', '2026-04-21', '2026-05-01',
    '2026-06-04', '2026-09-07', '2026-10-12', '2026-11-02', '2026-11-15',
    '2026-12-25'
];

const initialAvatars = [
    'yoda.png', 'ben.png', 'trump.png', 'lula.png', 'goku.jpg', `capivaraFeliz.jpg`,
    'Chloe.png', 'pepa.png', 'magali.png', `bozo.jpg`, 'sofor.png', `capivaraMood.jpg`
];

// ⭐ NOVO: Variáveis globais para armazenar as configurações dinâmicas
let globalHolidays = [];
let globalAvatars = [];

const YODA_LOGIN = 'pr1182589';

// =================================================================
// PASSO 2: DADOS DOS USUÁRIOS
// =================================================================
const initialUsersData = {
    // ================== GERENTE ==================
    'pr1182589': {
        name: 'Mestre Yoda',
        role: 'Gerente',
        scheduleType: 'fixed',
        schedule: ['mon', 'tue', 'wed', 'thu', 'fri'],
        color: '#3cb44b',
        avatar: 'img/yoda.png'
    },

    // ================== ADMINISTRATIVO ==================
    'pr115447': {
        name: 'Bibi Perigosa',
        displayLetter: 'Bi',
        role: 'Administrativo',
        scheduleType: '2_3',
        schedule_2_days: ['tue', 'thu'],
        schedule_3_days: ['tue', 'wed', 'thu'],
        color: '#ffe119',
        avatar: 'img/pepa.png'
    },
    'prps019624': {
        name: 'Mestre Gabe, o melhor!',
        displayLetter: 'MG',
        role: 'Administrativo',
        scheduleType: '2_3',
        schedule_2_days: ['wed', 'fri'],
        schedule_3_days: ['mon', 'wed', 'fri'],
        color: '#0f0fc0ff',
        avatar: 'img/sofor.png'
    },
    'pr115627': {
        name: 'Pedrin do coração',
        displayLetter: 'P',
        role: 'Administrativo',
        scheduleType: '3_2',
        schedule_2_days: ['tue', 'thu'],
        schedule_3_days: ['tue', 'wed', 'thu'],
        color: '#f032e6',
        avatar: 'img/trump.png'
    },
    'pres324670': {
        name: 'Samuquinha',
        displayLetter: 'S',
        role: 'Administrativo',
        scheduleType: 'fixed',
        schedule: ['mon', 'wed', 'fri'],
        color: '#bfef45',
        avatar: 'img/goku.jpg'
    },

    // ================== SECRETÁRIOS ==================
    'pr101546': {
        name: 'Fernanda',
        displayLetter: 'Fe',
        role: 'Secretário',
        scheduleType: '2_3',
        schedule_2_days: ['tue', 'thu'],
        schedule_3_days: ['mon', 'tue', 'thu'],
        color: '#4363d8',
        avatar: 'img/Chloe.png',
        meetingDay: 'tue'
    },
    'pr82925': {
        name: 'Gabi',
        displayLetter: 'Ga',
        role: 'Secretário',
        scheduleType: '2_3',
        schedule_2_days: ['mon', 'fri'],
        schedule_3_days: ['mon', 'thu', 'fri'],
        color: '#f58231',
        avatar: 'img/magali.png',
        meetingDay: 'wed'
    },
    'pr106995': {
        name: 'Gigi',
        displayLetter: 'Gi',
        role: 'Secretário',
        scheduleType: '2_3',
        schedule_2_days: ['tue', 'wed'],
        schedule_3_days: ['tue', 'wed', 'thu'],
        color: '#911eb4',
        avatar: 'img/capivara.jpg',
        meetingDay: 'thu'
    },
    'pr100369': {
        name: 'Marcelle',
        displayLetter: 'M',
        role: 'Secretário',
        scheduleType: '3_2',
        schedule_2_days: ['wed', 'fri'],
        schedule_3_days: ['mon', 'wed', 'fri'],
        color: '#42d4f4',
        avatar: 'img/lula.png',
        meetingDay: 'fri'
    },
    'pr100921': {
        name: 'Shirlike',
        displayLetter: 'Sh',
        role: 'Secretário',
        scheduleType: '3_2',
        schedule_2_days: ['tue', 'wed'],
        schedule_3_days: ['mon', 'tue', 'wed'],
        color: '#469990',
        avatar: 'img/Chloe.png',
        meetingDay: 'mon'
    },
    'pr1005047': {
        name: 'Tatyellen',
        displayLetter: 'T',
        role: 'Secretário',
        scheduleType: '3_2',
        schedule_2_days: ['mon', 'tue'],
        schedule_3_days: ['mon', 'tue', 'thu'],
        color: '#dcbeff',
        avatar: 'img/bozo.jpg',
        meetingDay: 'wed'
    }
};

let currentUserLogin = null;
let currentHybridDate = new Date();
let currentPresenceDate = new Date();
let substitutionsNeeded = [];
let allDbData = {};
let globalUsersData = {};

// =================================================================
// PASSO 3: INICIALIZAÇÃO E CONTROLE DA INTERFACE
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    createRouletteModal();
});

// ⭐ MODIFICADO: Função agora é async para aguardar o carregamento das configurações
async function initializeApp() {
    await loadGlobalSettings();
    createYodaAdminPanels();
    populateUserDropdown();

    // Apenas adiciona o listener. As outras funções de renderização
    // serão chamadas pela onUserSelect ou já são independentes.
    document.getElementById('user-select').addEventListener('change', onUserSelect);
    
    // Funções que rodam para todos, sem depender de um usuário selecionado
    renderVacationMap(); 
    renderPresenceTable();
    
    setupNavEventListeners();
    setupAvatarModalEvents();
    setupPasswordModalEvents();
}


// ⭐ ADICIONE ESTA NOVA FUNÇÃO AUXILIAR JUNTO COM A initializeApp
function populateUserDropdown() {
    const userSelect = document.getElementById('user-select');
    // Limpa a lista (mantendo a primeira opção "-- Escolha...")
    while (userSelect.options.length > 1) {
        userSelect.remove(1);
    }

    // Pega os usuários, ordena por nome e preenche o menu
    Object.keys(globalUsersData)
        .sort((a, b) => {
            // Se o nome não existir, usa uma string vazia como fallback para evitar erros.
            const nameA = globalUsersData[a]?.name || '';
            const nameB = globalUsersData[b]?.name || '';
            return nameA.localeCompare(nameB);
        })
        .forEach(login => {
            // Adiciona uma verificação extra para não adicionar usuários sem nome à lista
            if (globalUsersData[login]?.name) {
                const option = document.createElement('option');
                option.value = login;
                option.textContent = globalUsersData[login].name;
                userSelect.appendChild(option);
            }
        });
}


function onUserSelect() {
    const selectedLogin = document.getElementById('user-select').value;
    const appContainer = document.getElementById('app-container');
    const profileContainer = document.getElementById('profile-picture-container');
    const yodaAdminPanel = document.getElementById('yoda-admin-panel');

    if (selectedLogin === YODA_LOGIN && currentUserLogin !== YODA_LOGIN) {
        const passwordModal = document.getElementById('password-modal');
        const passwordInput = document.getElementById('jedi-password-input');
        passwordModal.style.display = 'flex';
        passwordInput.value = '';
        passwordInput.focus();
        return;
    }

    currentUserLogin = selectedLogin;

    if (currentUserLogin === YODA_LOGIN) {
        yodaAdminPanel.style.display = 'block';
        renderYodaAdminPanels();
    } else {
        yodaAdminPanel.style.display = 'none';
    }

    if (currentUserLogin) {
        const userData = globalUsersData[currentUserLogin];
        if (userData) {
            document.getElementById('welcome-message').textContent = `Gerenciando dados de: ${userData.name}`;
            appContainer.style.display = 'block';
            profileContainer.style.display = 'block';
            
            // Funções que DEPENDEM de um usuário selecionado são chamadas AQUI
            loadUserProfile(currentUserLogin);
            loadUserVacations();
            renderHybridCalendar();
        }
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
    
    // Adiciona uma verificação para garantir que o usuário existe antes de continuar
    if (!globalUsersData[login]) {
        console.error(`Usuário com login ${login} não encontrado nos dados globais.`);
        return;
    }
    
    let avatarIdentifier = globalUsersData[login].avatar || '';

    try {
        const docRef = db.collection('funcionarios').doc(login);
        const doc = await docRef.get();

        if (doc.exists && doc.data().avatar) {
            avatarIdentifier = doc.data().avatar;
        }

        profileImg.src = getAvatarSrc(avatarIdentifier);

    } catch (error) {
        console.error("Erro ao carregar perfil do usuário:", error);
        // Fallback: Se der erro na busca, usa o dado que já temos
        profileImg.src = getAvatarSrc(globalUsersData[login].avatar);
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

// 1. Função Auxiliar para determinar o SRC da imagem
function getAvatarSrc(identifier) {
    if (!identifier) return ''; // Retorna string vazia se não houver identificador

    // Se começar com 'data:image' (Base64) ou 'http' (URL de internet), é um caminho completo.
    if (identifier.startsWith('data:image') || identifier.startsWith('http')) {
        return identifier;
    }
    // Senão, é um arquivo local da pasta img/
    return `img/${identifier}`;
}


function openAvatarModal() {
    const modal = document.getElementById('avatar-modal');
    const avatarGrid = document.getElementById('avatar-grid');
    avatarGrid.innerHTML = '';

    globalAvatars.forEach(avatarIdentifier => {
        const img = document.createElement('img');
        const fullPath = getAvatarSrc(avatarIdentifier); // Usa a função auxiliar

        img.src = fullPath;
        img.classList.add('avatar-option');
        img.alt = "Avatar";
        img.title = `Selecionar este avatar`;

        img.addEventListener('click', async () => {
            document.getElementById('profile-img').src = fullPath;
            await saveAvatar(currentUserLogin, avatarIdentifier);
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
    // Usa a variável global em vez da constante
    if (globalHolidays.includes(dateString)) return false;
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
            name: globalUsersData[currentUserLogin].name,
            role: globalUsersData[currentUserLogin].role,
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
    const currentUserData = globalUsersData[currentUserLogin];
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
    const dayMap = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5 };

    // PASSO 1: Carrega todos os funcionários (como antes)
    const querySnapshot = await db.collection('funcionarios').get();
    querySnapshot.forEach(doc => {
        allDbData[doc.id] = doc.data();
    });

    // PASSO 2: Processa as FÉRIAS para gerar substituições (como antes)
    Object.keys(allDbData).forEach(userLogin => {
        const docData = allDbData[userLogin];
        const localUserData = globalUsersData[userLogin];

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
                                isManual: false // Marcador para diferenciar de ausência manual
                            });
                        }
                        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
                    }
                }
            });
        }
    });

    // ⭐ NOVO TRECHO: Processa as SUBSTITUIÇÕES MANUAIS do painel do Yoda
    try {
        const manualSubsSnapshot = await db.collection('substituicoesManuais').get();
        manualSubsSnapshot.forEach(doc => {
            const data = doc.data();
            // Evita adicionar duplicado se por algum motivo a data já estiver na lista de férias
            const alreadyExists = substitutionsNeeded.some(sub => 
                sub.employeeId === data.employeeId && 
                sub.date.toISOString().slice(0, 10) === data.date
            );

            if (!alreadyExists) {
                substitutionsNeeded.push({
                    date: new Date(data.date + 'T12:00:00Z'),
                    employeeId: data.employeeId,
                    employeeName: data.employeeName,
                    substituteId: null,
                    isManual: true // Marcador especial para o item manual
                });
            }
        });
    } catch (error) {
        console.error("Erro ao carregar substituições manuais:", error);
    }
    
    // Ordena a lista final
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

        // Itera por TODAS as substituições necessárias
        substitutionsNeeded.forEach(sub => {
            const p = document.createElement('p');
            p.style.fontWeight = '500'; // Deixa o texto um pouco mais forte

            const substituteName = (sub.substituteId && globalUsersData[sub.substituteId]?.name) 
                                   ? ` - <strong>${globalUsersData[sub.substituteId].name}</strong> ✅`
                                   : '';
            
            const baseText = `${formatDate(sub.date)} (${sub.employeeName})`;

            // ⭐ LÓGICA PRINCIPAL DA MUDANÇA ⭐
            if (sub.isManual) {
                // Se for manual, será SEMPRE AZUL, com ou sem substituto.
                p.innerHTML = baseText + substituteName;
                p.style.color = '#0d6efd'; // Azul
            } else if (sub.substituteId) {
                // Se for de FÉRIAS e TIVER substituto, fica VERDE.
                p.innerHTML = baseText + substituteName;
                p.style.color = '#198754'; // Verde
            } else {
                // Se for de FÉRIAS e NÃO TIVER substituto, fica VERMELHO.
                p.innerHTML = baseText; // Não mostra emoji aqui
                p.style.color = '#dc3545'; // Vermelho
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
        const allOtherSecretaries = Object.keys(globalUsersData).filter(id =>
            globalUsersData[id].role === 'Secretário' && id !== sub.employeeId
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
    const allSecretaries = Object.keys(globalUsersData).filter(id => globalUsersData[id].role === 'Secretário');
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

    if (substitutionsNeeded.length === 0) {
        resultsDiv.innerHTML += `<p>Nenhuma substituição foi necessária.</p>`;
        return;
    }

    substitutionsNeeded.sort((a, b) => a.date - b.date);

    substitutionsNeeded.forEach(sub => {
        const resultLine = document.createElement('div');
        resultLine.className = 'substitution-result-line';
        const label = document.createElement('span');
        label.textContent = `${formatDate(sub.date)} (${sub.employeeName}) → `;
        resultLine.appendChild(label);

        // A regra para o menu manual do Yoda: Pega todas as secretárias que não estão de férias no mesmo dia.
        const yodaManualOverrideOptions = Object.keys(globalUsersData).filter(id =>
            globalUsersData[id].role === 'Secretário' &&
            id !== sub.employeeId &&
            !isEmployeeOnVacation(id, sub.date)
        );

        if (yodaManualOverrideOptions.length > 0) {
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

            yodaManualOverrideOptions.forEach(id => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = globalUsersData[id].name;
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
    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = 'Salvando...';
    }

    const batch = db.batch();
    let changesToCommit = 0;
    const conflictMessages = [];

    for (const sub of substitutionsNeeded) {
        const subDateStr = sub.date.toISOString().slice(0, 10);
        const subRef = db.collection('substituicoes').doc(`${sub.employeeId}_${subDateStr}`);

        const hasChanged = sub.substituteId !== sub.savedSubstituteId;
        const isBeingCleared = hasChanged && (sub.substituteId === "" || !sub.substituteId);
        const isNotJedi = currentUserLogin !== YODA_LOGIN;
        
        if (!hasChanged) {
            continue;
        }

        if (sub.savedSubstituteId && isNotJedi) {
            const originalSubstituteName = globalUsersData[sub.savedSubstituteId]?.name || 'Desconhecido';
            const conflictMessage = `Por favor, solicite a um Mestre Jedi a alteração: ${formatDate(sub.date)} (${sub.employeeName}) - ${originalSubstituteName} ✅`;
            conflictMessages.push(conflictMessage);
            continue;
        }
        
        // AÇÃO 1: REMOVER a substituição se o campo foi limpo
        if (isBeingCleared) {
            batch.delete(subRef);
            changesToCommit++;
        // AÇÃO 2: ADICIONAR ou ATUALIZAR a substituição
        } else if (sub.substituteId) {
            batch.set(subRef, {
                date: subDateStr,
                employeeOnVacationId: sub.employeeId,
                employeeOnVacationName: sub.employeeName,
                substituteId: sub.substituteId,
                substituteName: globalUsersData[sub.substituteId].name,
                savedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            changesToCommit++;
        }
    }

    if (conflictMessages.length > 0) {
        alert('Atenção:\n\n' + conflictMessages.join('\n'));
    }

    if (changesToCommit > 0) {
        try {
            await batch.commit();
            alert(`${changesToCommit} alteração(ões) salva(s) com sucesso!`);
        } catch (error) {
            console.error("Erro ao salvar substituições: ", error);
            alert("Ocorreu um erro ao salvar os dados. Verifique o console.");
        }
    } else if (conflictMessages.length === 0) {
        alert("Nenhuma alteração válida para salvar.");
    }

    await renderVacationMap();
    if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = 'Salvar Resultados no Banco de Dados';
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
        if (subsSnapshot.empty) {
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
        if (subsSnapshot.empty) {
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
        label.textContent = globalUsersData[id]?.name || 'Desconhecido';
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
// ⭐ NOVO: SEÇÃO DE GERENCIAMENTO DO MESTRE YODA
// =================================================================

/**
 * Carrega as configurações globais e os dados dos funcionários.
 * Esta função agora MESCLA os dados iniciais com os dados do Firestore
 * para garantir que todos os funcionários existam, preservando as alterações do usuário.
 */
/**
 * Carrega as configurações globais e os dados dos funcionários.
 * Esta função mescla os dados iniciais com os do Firestore de forma "profunda",
 * garantindo que nenhum campo padrão seja perdido e que todas as alterações do
 * usuário sejam preservadas.
 */
async function loadGlobalSettings() {
    // 1. Carrega Configurações (Feriados e Avatares) - Sem alterações aqui
    const configRef = db.collection('configuracoes').doc('geral');
    try {
        const doc = await configRef.get();
        if (doc.exists) {
            const data = doc.data();
            globalHolidays = data.holidays || initialHolidays;
            globalAvatars = data.availableAvatars || initialAvatars;
        } else {
            await configRef.set({ holidays: initialHolidays, availableAvatars: initialAvatars });
            globalHolidays = initialHolidays;
            globalAvatars = initialAvatars;
        }
    } catch (error) {
        console.error("Erro ao carregar configurações globais:", error);
        globalHolidays = initialHolidays; // Fallback
        globalAvatars = initialAvatars; // Fallback
    }

    // --- Lógica de Sincronização de Funcionários (VERSÃO FINAL) ---

    // 2. Carrega todos os usuários que existem no Firestore
    const usersSnapshot = await db.collection('funcionarios').get();
    const loadedUsersFromFirestore = {};
    usersSnapshot.forEach(doc => {
        loadedUsersFromFirestore[doc.id] = doc.data();
    });

    // 3. Cria o objeto de dados final, que será usado na aplicação
    const finalUsersData = {};
    const batch = db.batch();
    let dbNeedsUpdate = false;

    // 4. Itera sobre a lista de usuários INICIAL (a fonte da verdade sobre quem deve existir)
    Object.keys(initialUsersData).forEach(login => {
        const initialUser = initialUsersData[login];
        const firestoreUser = loadedUsersFromFirestore[login];

        if (firestoreUser) {
            // O usuário EXISTE no Firestore.
            // Mescla as propriedades: as do Firestore sobrescrevem as iniciais.
            // Isso preserva os dados iniciais (como 'schedule') se eles foram apagados do DB,
            // e mantém as alterações do usuário (como 'avatar').
            finalUsersData[login] = { ...initialUser, ...firestoreUser };
        } else {
            // O usuário NÃO EXISTE no Firestore.
            // Usa os dados iniciais e prepara para adicioná-los ao banco.
            finalUsersData[login] = initialUser;
            
            console.log(`Adicionando usuário ausente ao Firestore: ${initialUser.name}`);
            const userRef = db.collection('funcionarios').doc(login);
            batch.set(userRef, initialUser);
            dbNeedsUpdate = true;
        }
    });

    // 5. Se houver usuários novos para adicionar, envia para o banco de uma vez
    if (dbNeedsUpdate) {
        console.log("Sincronizando novos usuários com o banco de dados...");
        await batch.commit();
    }

    // 6. Define a variável global com os dados finalmente corretos e completos
    globalUsersData = finalUsersData;
}


/**
 * Cria a estrutura HTML para os painéis de administração do Yoda.
 * É chamado uma vez na inicialização do app.
 */
function createYodaAdminPanels() {
    const yodaPanelContainer = document.createElement('div');
    yodaPanelContainer.classList.add('card');
    yodaPanelContainer.id = 'yoda-admin-panel';
    yodaPanelContainer.style.display = 'none';
    yodaPanelContainer.style.border = '2px solid #3cb44b';

    const listStyle = "max-height: 180px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;";

    yodaPanelContainer.innerHTML = `
        <h2 style="text-align: center; color: #3cb44b;">Painel do Mestre Jedi</h2>
        
        <div id="holiday-manager-container" class="admin-panel-section" style="margin-bottom: 20px;">
            <h4>Gerenciar Feriados Globais 🗓️</h4>
            <div id="holiday-list" style="${listStyle}"></div>
            <div>
                <input type="date" id="new-holiday-input">
                <button id="add-holiday-button">Adicionar Feriado</button>
            </div>
        </div>
        
        <hr>

        <div id="manual-substitution-container" class="admin-panel-section">
          <h4>Adicionar Substituição Manual 🔵</h4>
          <p style="font-size: 0.9em; color: #666;">Use esta opção para ausências que não são férias (ex: licença médica, etc.).</p>
          <div>
              <label for="manual-sub-date">Data:</label>
              <input type="date" id="manual-sub-date" style="margin-right: 10px;">
              
              <label for="manual-sub-secretary">Secretário(a):</label>
              <select id="manual-sub-secretary" style="margin-right: 10px;">
                  <option value="">-- Escolha --</option>
              </select>
              
              <button id="add-manual-sub-button">Adicionar Alerta</button>
          </div>
        </div>

        <div id="user-manager-container" class="admin-panel-section">
            <h4>Gerenciar Funcionários 🧑‍🤝‍🧑</h4>
            <div id="user-list" style="${listStyle}"></div>
            <div class="add-user-form" style="margin-top: 15px;">
                <h5>Adicionar Novo Funcionário</h5>
                <input type="text" id="new-user-login" placeholder="Login (ex: pr123456)" style="margin-right: 5px;">
                <input type="text" id="new-user-name" placeholder="Nome Completo" style="margin-right: 5px;">
                <select id="new-user-role" style="margin-right: 5px;">
                    <option value="Administrativo">Administrativo</option>
                    <option value="Secretário">Secretário</option>
                    <option value="Gerente">Gerente</option>
                </select>
                <button id="add-user-button">Adicionar Funcionário</button>
            </div>
        </div>

        <hr>

        <div id="schedule-manager-container" class="admin-panel-section">
            <h4>Tipo de Escala ⚖️</h4>
            <div style="margin-bottom: 10px;">
                <label for="schedule-user-select">Funcionário:</label>
                <select id="schedule-user-select">
                    <option value="">-- Escolha um funcionário --</option>
                </select>
            </div>

            <div id="schedule-editor" style="display: none; padding-left: 15px; border-left: 2px solid #eee;">
                <div style="margin-bottom: 10px;">
                    <label for="schedule-type-select">Tipo de Escala:</label>
                    <select id="schedule-type-select">
                        <option value="fixed">Fixo</option>
                        <option value="2_3">Variável (2 dias / 3 dias)</option>
                        <option value="3_2">Variável (3 dias / 2 dias)</option>
                    </select>
                </div>

                <div id="fixed-schedule-settings" style="display: none;">
                    <p><strong>Dias fixos da semana:</strong></p>
                    <div id="fixed-days-checkboxes"></div>
                </div>

                <div id="variable-schedule-settings" style="display: none;">
                    <p><strong>Semana de 2 dias:</strong></p>
                    <div id="variable-days-2-checkboxes"></div>
                    <p style="margin-top: 10px;"><strong>Semana de 3 dias:</strong></p>
                    <div id="variable-days-3-checkboxes"></div>
                </div>
                
                <button id="save-schedule-button" style="margin-top: 15px;">Salvar Escala</button>
            </div>
        </div>

        <hr>

        <div id="avatar-manager-container" class="admin-panel-section" style="margin-top: 20px;">
            <h4>Gerenciar Avatares Disponíveis 🖼️</h4>
            <div id="avatar-list" style="${listStyle}"></div>
            <div>
                <input type="file" id="new-avatar-input" accept="image/png, image/jpeg, image/gif">
                <button id="add-avatar-button">Adicionar Avatar</button>
            </div>
        </div>
    `;

    const hybridCalendarContainer = document.getElementById('hybrid-calendar-container');
    if (hybridCalendarContainer) {
        hybridCalendarContainer.parentNode.insertBefore(yodaPanelContainer, hybridCalendarContainer.nextSibling);

        // Adiciona os event listeners para os botões e seletores
        document.getElementById('add-holiday-button').addEventListener('click', handleAddHoliday);
        document.getElementById('add-avatar-button').addEventListener('click', handleAddAvatar);
        document.getElementById('add-user-button').addEventListener('click', handleAddUser);
        
        // Listeners para o novo painel
        document.getElementById('schedule-user-select').addEventListener('change', renderScheduleEditor);
        document.getElementById('schedule-type-select').addEventListener('change', updateScheduleEditorUI);
        document.getElementById('save-schedule-button').addEventListener('click', handleSaveSchedule);
        document.getElementById('add-manual-sub-button').addEventListener('click', handleAddManualSubstitution);
    }
}

/**
 * Renderiza/atualiza o conteúdo dos painéis de administração do Yoda com os dados atuais.
 */
function renderYodaAdminPanels() {
    const itemMarginBottom = '3px';

    // Renderiza a lista de feriados (sem alterações)
    const holidayListDiv = document.getElementById('holiday-list');
    holidayListDiv.innerHTML = '';
    globalHolidays.sort().forEach(holiday => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.marginBottom = itemMarginBottom;
        item.innerHTML = `<span>${formatDate(holiday)}</span><button class="remove-btn" data-holiday="${holiday}">❌</button>`;
        holidayListDiv.appendChild(item);
    });
    holidayListDiv.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => handleRemoveHoliday(e.currentTarget.dataset.holiday));
    });

    // Renderiza a lista de funcionários COM FUNCIONALIDADES
    const userListDiv = document.getElementById('user-list');
    userListDiv.innerHTML = '';
    const roles = ["Administrativo", "Secretário", "Gerente"];

    Object.keys(globalUsersData).forEach(login => {
        const user = globalUsersData[login];
        if (login === YODA_LOGIN) return; // Não permite editar o Mestre Yoda

        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.marginBottom = itemMarginBottom;
        
        const roleOptions = roles.map(r => `<option value="${r}" ${user.role === r ? 'selected' : ''}>${r}</option>`).join('');

        item.innerHTML = `
            <span>${user.name} (${login})</span>
            <div class="user-actions">
                <select data-login="${login}" class="role-select" style="margin-right: 5px;">${roleOptions}</select>
                <button class="remove-btn" data-login="${login}" data-name="${user.name}">❌</button>
            </div>
        `;
        userListDiv.appendChild(item);
    });
    
    // Adiciona os event listeners para os novos botões e selects
    userListDiv.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => handleRemoveUser(e.currentTarget.dataset.login, e.currentTarget.dataset.name));
    });
    userListDiv.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', (e) => handleRoleChange(e.currentTarget.dataset.login, e.target.value));
    });

    // Renderiza a lista de avatares (sem alterações)
    const avatarListDiv = document.getElementById('avatar-list');
    avatarListDiv.innerHTML = '';
    globalAvatars.forEach(avatar => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.marginBottom = itemMarginBottom;
        const avatarSrc = getAvatarSrc(avatar);
        item.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="${avatarSrc}" alt="avatar" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px;">
                <span style="font-size: 0.9em;">${avatar.length > 30 ? avatar.substring(0,30) + '...' : avatar}</span>
            </div>
            <button class="remove-btn" data-avatar="${avatar}">❌</button>
        `;
        avatarListDiv.appendChild(item);
    });
    avatarListDiv.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => handleRemoveAvatar(e.currentTarget.dataset.avatar));
    });
    // ⭐ NOVO TRECHO PARA POPULAR O SELETOR DE ESCALA ⭐
    const scheduleUserSelect = document.getElementById('schedule-user-select');
    // Salva o valor que estava selecionado antes de limpar
    const previouslySelected = scheduleUserSelect.value;
    scheduleUserSelect.innerHTML = '<option value="">-- Escolha um funcionário --</option>'; // Limpa e adiciona a opção padrão

    Object.keys(globalUsersData)
        .sort((a, b) => globalUsersData[a].name.localeCompare(globalUsersData[b].name))
        .forEach(login => {
            const user = globalUsersData[login];
            const option = document.createElement('option');
            option.value = login;
            option.textContent = user.name;
            scheduleUserSelect.appendChild(option);
        });

    // Restaura a seleção anterior, se ainda for válida
    scheduleUserSelect.value = previouslySelected;
    // Esconde o editor se nenhum usuário estiver selecionado
    if (!scheduleUserSelect.value) {
        document.getElementById('schedule-editor').style.display = 'none';
    }
    // ⭐ NOVO TRECHO PARA POPULAR O SELETOR DE SUBSTITUIÇÃO MANUAL ⭐
    const manualSubSelect = document.getElementById('manual-sub-secretary');
    const prevSelectedSub = manualSubSelect.value;
    manualSubSelect.innerHTML = '<option value="">-- Escolha --</option>';

    Object.keys(globalUsersData)
        .filter(login => globalUsersData[login].role === 'Secretário')
        .sort((a, b) => globalUsersData[a].name.localeCompare(globalUsersData[b].name))
        .forEach(login => {
            const user = globalUsersData[login];
            const option = document.createElement('option');
            option.value = login;
            option.textContent = user.name;
            manualSubSelect.appendChild(option);
        });
    manualSubSelect.value = prevSelectedSub;
}

/**
 * Lida com a adição de um novo feriado.
 */
async function handleAddHoliday() {
    const input = document.getElementById('new-holiday-input');
    const newHoliday = input.value;
    if (!newHoliday) {
        alert("Por favor, selecione uma data para o feriado.");
        return;
    }
    if (globalHolidays.includes(newHoliday)) {
        alert("Este feriado já existe na lista.");
        return;
    }

    try {
        const configRef = db.collection('configuracoes').doc('geral');
        await configRef.update({
            holidays: firebase.firestore.FieldValue.arrayUnion(newHoliday)
        });
        alert("Feriado adicionado com sucesso!");
        input.value = '';
        await loadGlobalSettings(); // Recarrega os dados do banco
        renderYodaAdminPanels(); // Re-renderiza o painel do Yoda
        renderHybridCalendar(); // Re-renderiza calendários para refletir a mudança
        renderPresenceTable();
    } catch (error) {
        console.error("Erro ao adicionar feriado:", error);
        alert("Falha ao adicionar o feriado. Tente novamente.");
    }
}

/**
 * Lida com a remoção de um feriado.
 */
async function handleRemoveHoliday(holidayToRemove) {
    if (!confirm(`Tem certeza que deseja remover o feriado ${formatDate(holidayToRemove)}?`)) return;

    try {
        const configRef = db.collection('configuracoes').doc('geral');
        await configRef.update({
            holidays: firebase.firestore.FieldValue.arrayRemove(holidayToRemove)
        });
        alert("Feriado removido com sucesso!");
        await loadGlobalSettings(); // Recarrega os dados do banco
        renderYodaAdminPanels(); // Re-renderiza o painel do Yoda
        renderHybridCalendar(); // Re-renderiza calendários para refletir a mudança
        renderPresenceTable();
    } catch (error) {
        console.error("Erro ao remover feriado:", error);
        alert("Falha ao remover o feriado. Tente novamente.");
    }
}

/**
 * Lida com a adição de um novo avatar.
 */
async function handleAddAvatar() {
    const input = document.getElementById('new-avatar-input');
    const button = document.getElementById('add-avatar-button');
    const file = input.files[0]; // Pega o arquivo selecionado

    if (!file) {
        alert("Por favor, escolha um arquivo de imagem.");
        return;
    }

    // VERIFICAÇÃO DE TAMANHO CRÍTICA PARA NÃO ESTOURAR O LIMITE DO FIRESTORE
    if (file.size > 700 * 1024) { // Limite de 700 KB
        alert("Erro: A imagem é muito grande! Por favor, escolha uma imagem com menos de 700 KB.");
        input.value = ''; // Limpa a seleção
        return;
    }

    button.disabled = true;
    button.textContent = 'Processando...';

    // Usa a API FileReader para converter a imagem em texto Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // Quando a conversão terminar...
    reader.onload = async () => {
        try {
            const base64String = reader.result; // O texto gigante que representa a imagem

            // Salva a string Base64 no array de avatares no Firestore
            const configRef = db.collection('configuracoes').doc('geral');
            await configRef.update({
                availableAvatars: firebase.firestore.FieldValue.arrayUnion(base64String)
            });

            alert("Avatar adicionado com sucesso!");
            await loadGlobalSettings(); // Recarrega os dados globais
            renderYodaAdminPanels();  // Re-renderiza o painel do admin

        } catch (error) {
            console.error("Erro ao adicionar avatar Base64:", error);
            alert("Falha ao adicionar o avatar. Ocorreu um erro ao salvar no banco de dados.");
        } finally {
            // Limpa o input e reabilita o botão
            input.value = '';
            button.disabled = false;
            button.textContent = 'Adicionar Avatar';
        }
    };

    // Em caso de erro na leitura do arquivo
    reader.onerror = () => {
        alert("Ocorreu um erro ao ler o arquivo de imagem.");
        button.disabled = false;
        button.textContent = 'Adicionar Avatar';
    };
}

/**
 * Lida com a remoção de um avatar.
 */
async function handleRemoveAvatar(avatarToRemove) {
    if (!confirm(`Tem certeza que deseja remover o avatar "${avatarToRemove}"?`)) return;

    try {
        const configRef = db.collection('configuracoes').doc('geral');
        await configRef.update({
            availableAvatars: firebase.firestore.FieldValue.arrayRemove(avatarToRemove)
        });
        alert("Avatar removido com sucesso!");
        await loadGlobalSettings(); // Recarrega os dados do banco
        renderYodaAdminPanels(); // Re-renderiza o painel do Yoda
    } catch (error) {
        console.error("Erro ao remover avatar:", error);
        alert("Falha ao remover o avatar. Tente novamente.");
    }
}


// SUBSTITUA A SUA FUNÇÃO INTEIRA POR ESTA
async function handleAddUser() {
    const login = document.getElementById('new-user-login').value.trim();
    const name = document.getElementById('new-user-name').value.trim();
    const role = document.getElementById('new-user-role').value;

    if (!login || !name) {
        alert("Login e Nome são obrigatórios.");
        return;
    }
    if (globalUsersData[login]) {
        alert("Este login já existe!");
        return;
    }

    const newUser = {
        name: name,
        role: role,
        scheduleType: 'fixed',
        schedule: ['mon', 'tue', 'wed', 'thu', 'fri'],
        color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
        avatar: ''
    };

    try {
        await db.collection('funcionarios').doc(login).set(newUser);
        alert(`Funcionário ${name} adicionado com sucesso!`);

        document.getElementById('new-user-login').value = '';
        document.getElementById('new-user-name').value = '';

        await loadGlobalSettings();
        populateUserDropdown(); // ⭐ ATUALIZAÇÃO FOCADA AQUI
        renderYodaAdminPanels();

    } catch (error) {
        console.error("Erro ao adicionar funcionário:", error);
        alert("Falha ao adicionar funcionário.");
    }
}

async function handleRemoveUser(login, name) {
    if (!confirm(`Tem certeza que deseja remover o funcionário ${name} (${login})? Esta ação é irreversível.`)) return;

    try {
        await db.collection('funcionarios').doc(login).delete();
        alert("Funcionário removido com sucesso!");

        await loadGlobalSettings();
        populateUserDropdown(); // ⭐ ATUALIZAÇÃO FOCADA AQUI
        renderYodaAdminPanels();

    } catch (error) {
        console.error("Erro ao remover funcionário:", error);
        alert("Falha ao remover funcionário.");
    }
}

async function handleRoleChange(login, newRole) {
    try {
        await db.collection('funcionarios').doc(login).update({ role: newRole });
        // ⭐ CORRIGIDO AQUI
        alert(`Função de ${globalUsersData[login].name} atualizada para ${newRole}.`);

        await loadGlobalSettings();
        renderYodaAdminPanels();
    } catch (error) {
        console.error("Erro ao alterar função:", error);
        alert("Falha ao alterar a função.");
    }
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
        // VERIFICAÇÃO DE FÉRIAS (COM EMOJI)
        if (currentUserLogin && isEmployeeOnVacation(currentUserLogin, currentDate)) {
            // Estilos para o dia de férias
            dayCell.style.backgroundColor = 'rgba(144, 238, 144, 0.5)';
            dayCell.style.display = 'flex';         // Ativa o Flexbox
            dayCell.style.flexDirection = 'column';  // Organiza os itens em coluna (um em cima do outro)
            dayCell.style.justifyContent = 'center'; // Centraliza verticalmente
            dayCell.style.alignItems = 'center';     // Centraliza horizontalmente (bônus)

            // Conteúdo da célula
            dayCell.innerHTML = `
                <span style="font-size: 24px; line-height: 0.1; margin-bottom: -10px;">🏖️</span>
                <span style="font-size: 14px;">${i}</span>
            `;
        }
        // Demais verificações com "else if"
        else if (!isBusinessDay(currentDate)) {
            dayCell.classList.add('non-business-day');
        } else if (currentUserLogin && isPresentialDay(currentUserLogin, currentDate)) {
            const user = globalUsersData[currentUserLogin];
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

    Object.keys(globalUsersData).forEach(login => {
        const user = globalUsersData[login];
        const row = document.createElement('tr');
        row.innerHTML = `<td>${user.name}</td>`;
        for (let i = 0; i < 5; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            const utcDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
            const td = document.createElement('td');
            const isPresent = isPresentialDay(login, utcDate);
            const onVacation = isEmployeeOnVacation(login, utcDate); // Verifica se está de férias

            if (isPresent && !onVacation) { // Só marca "X" se for dia presencial E NÃO for férias
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
    const user = globalUsersData[login];
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

// =================================================================
// ⭐ NOVAS FUNÇÕES: GERENCIAMENTO DE ESCALA
// =================================================================

/**
 * Popula e exibe o editor de escala quando um funcionário é selecionado.
 */
function renderScheduleEditor() {
    const selectedLogin = document.getElementById('schedule-user-select').value;
    const editorDiv = document.getElementById('schedule-editor');
    
    if (!selectedLogin) {
        editorDiv.style.display = 'none';
        return;
    }

    const userData = globalUsersData[selectedLogin];
    if (!userData) {
        console.error("Dados do usuário não encontrados para:", selectedLogin);
        editorDiv.style.display = 'none';
        return;
    }

    // Popula o tipo de escala
    document.getElementById('schedule-type-select').value = userData.scheduleType || 'fixed';

    const daysOfWeek = [
        { id: 'mon', name: 'Seg' }, { id: 'tue', name: 'Ter' },
        { id: 'wed', name: 'Qua' }, { id: 'thu', name: 'Qui' },
        { id: 'fri', name: 'Sex' }
    ];

    // Gera checkboxes para um container específico
    const generateCheckboxes = (containerId, scheduleData = []) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        daysOfWeek.forEach(day => {
            const isChecked = scheduleData.includes(day.id);
            container.innerHTML += `
                <label style="margin-right: 10px;">
                    <input type="checkbox" value="${day.id}" ${isChecked ? 'checked' : ''}>
                    ${day.name}
                </label>
            `;
        });
    };

    // Popula os checkboxes com os dados atuais do usuário
    generateCheckboxes('fixed-days-checkboxes', userData.schedule);
    generateCheckboxes('variable-days-2-checkboxes', userData.schedule_2_days);
    generateCheckboxes('variable-days-3-checkboxes', userData.schedule_3_days);

    // Mostra a UI correta (fixa ou variável) e exibe o editor
    updateScheduleEditorUI();
    editorDiv.style.display = 'block';
}

/**
 * Mostra/oculta os campos de dias da semana com base no tipo de escala selecionado.
 */
function updateScheduleEditorUI() {
    const scheduleType = document.getElementById('schedule-type-select').value;
    document.getElementById('fixed-schedule-settings').style.display = (scheduleType === 'fixed') ? 'block' : 'none';
    document.getElementById('variable-schedule-settings').style.display = (scheduleType.includes('_')) ? 'block' : 'none';
}

/**
 * Salva as alterações de escala no Firestore.
 */
async function handleSaveSchedule() {
    const login = document.getElementById('schedule-user-select').value;
    if (!login) {
        alert("Por favor, escolha um funcionário.");
        return;
    }

    const scheduleType = document.getElementById('schedule-type-select').value;
    const dataToUpdate = { scheduleType };

    // Coleta os dias selecionados dos checkboxes
    const getSelectedDays = (containerId) => {
        const checkboxes = document.querySelectorAll(`#${containerId} input:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    };

    if (scheduleType === 'fixed') {
        dataToUpdate.schedule = getSelectedDays('fixed-days-checkboxes');
        // Limpa os campos da escala variável para manter os dados consistentes
        dataToUpdate.schedule_2_days = [];
        dataToUpdate.schedule_3_days = [];
    } else {
        const days2 = getSelectedDays('variable-days-2-checkboxes');
        const days3 = getSelectedDays('variable-days-3-checkboxes');
        
        // Validação simples
        if (days2.length !== 2 || days3.length !== 3) {
            alert("Por favor, selecione exatamente 2 dias para a semana de 2 dias e 3 dias para a semana de 3 dias.");
            return;
        }

        dataToUpdate.schedule_2_days = days2;
        dataToUpdate.schedule_3_days = days3;
        // Limpa o campo da escala fixa
        dataToUpdate.schedule = [];
    }

    // Salva no Firestore
    try {
        const userRef = db.collection('funcionarios').doc(login);
        await userRef.update(dataToUpdate);

        alert(`Escala de ${globalUsersData[login].name} salva com sucesso!`);
        
        // Recarrega os dados e atualiza a interface
        await loadGlobalSettings();
        renderPresenceTable();
        renderScheduleEditor(); // Recarrega o editor com os dados salvos

    } catch (error) {
        console.error("Erro ao salvar a escala:", error);
        alert("Ocorreu um erro ao salvar a escala. Verifique o console.");
    }
}

/**
 * ⭐ NOVA FUNÇÃO: Lida com a adição de uma substituição manual pelo Mestre Yoda.
 * Salva um registro na nova coleção 'substituicoesManuais'.
 */
async function handleAddManualSubstitution() {
    const dateInput = document.getElementById('manual-sub-date');
    const secretarySelect = document.getElementById('manual-sub-secretary');
    const button = document.getElementById('add-manual-sub-button');

    const date = dateInput.value;
    const secretaryId = secretarySelect.value;

    if (!date || !secretaryId) {
        alert("Por favor, preencha a data e escolha um(a) secretário(a).");
        return;
    }

    const secretaryName = globalUsersData[secretaryId]?.name || 'Nome Desconhecido';
    const docId = `${secretaryId}_${date}`; // Cria um ID único para evitar duplicatas

    button.disabled = true;
    button.textContent = 'Salvando...';

    try {
        const subRef = db.collection('substituicoesManuais').doc(docId);
        await subRef.set({
            date: date,
            employeeId: secretaryId,
            employeeName: secretaryName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert(`Alerta de substituição para ${secretaryName} em ${formatDate(date)} adicionado com sucesso!`);
        
        // Limpa os campos
        dateInput.value = '';
        secretarySelect.value = '';

        // Recarrega o mapa de férias para exibir o novo alerta azul
        await renderVacationMap();

    } catch (error) {
        console.error("Erro ao adicionar substituição manual:", error);
        alert("Ocorreu um erro ao salvar o alerta. Verifique o console.");
    } finally {
        button.disabled = false;
        button.textContent = 'Adicionar Alerta';
    }
}