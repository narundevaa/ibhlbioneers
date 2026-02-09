// --- Data: Add your PDF URLs and quizzes here ---
const guides =
    [
        { id: 'g1', title: 'Water Study Guide', level: 'HLY1', tags: ['water', 'solvation', 'solvent', 'polar', 'hydr'], pdf: 'assets/guides/WaterStudyGuide.pdf', thumb: 'assets/thumbnails/WaterStudyGuide.png' },
        { id: 'g2', title: 'Photosynthesis', level: 'HLY2', tags: ['photosynthesis'], pdf: '' },
        { id: 'g3', title: 'Fire Study Guide', level: 'HLY1', tags: ['fir', 'solvation', 'solvent', 'polar', 'hydr'], pdf: '', thumb: '' },
        { id: 'g4', title: 'Earth Study Guide', level: 'HLY1', tags: ['earth', 'solvation', 'solvent', 'polar', 'hydr'], pdf: '', thumb: '' },
        { id: 'g5', title: 'Air Study Guide', level: 'HLY1', tags: ['air', 'solvation', 'solvent', 'polar', 'hydr'], pdf: '', thumb: '' }
    ];

const quizzes =
    [
        {
            id: 'q1', title: 'Cell Structure', level: 'HLY1', questions:
                [
                    { q: 'Which organelle is the site of ATP production?', choices: ['Nucleus', 'Mitochondrion', 'Golgi apparatus', 'Ribosome'], answer: 1 },
                    { q: 'Which structure is present in plant cells but not animal cells?', choices: ['Centrioles', 'Cell wall', 'Lysosome', 'Flagellum'], answer: 1 }
                ]
        },

        {
            id: 'q2', title: 'Basic Genetics', level: 'HLY2', questions:
                [
                    { q: 'If a diploid organism has 8 chromosomes, how many will be in a gamete?', choices: ['4', '8', '16', '2'], answer: 0 },
                    { q: 'What is the term for a segment of DNA that codes for a protein?', choices: ['Chromosome', 'Gene', 'Allele', 'Genome'], answer: 1 }
                ]
        }
    ];

// --- Router ---
function navigate(hash) {
    location.hash = hash
}

function render() {
    const app = document.getElementById('app');
    const route = location.hash || '#/';
    if (route == '#/')
        renderHome(app);
    else if (route.startsWith('#/guides'))
        renderGuides(app);
    else if (route.startsWith('#/quizzes'))
        renderQuizzes(app);
    else renderNotFound(app);
}

// --- Helpers ---
function el(tag, className, inner) {
    const e = document.createElement(tag);
    if (className)
        e.className = className;
    if (inner !== undefined)
        e.innerHTML = inner;
    return e;
}

// --- Home ---
function renderHome(container) {
    container.innerHTML = '';
    const h = el('div', '', `<h2>Welcome to IBHL Bioneers</h2><p class="large">Home page for your bioneering journey!</p>`);
    container.appendChild(h);

    // Quick links
    const grid = el('div', 'grid');

    // show 4 "featured" items
    let lower = ((Math.random() * (guides.length - 3)) / 1);
    let upper = lower + 4;

    const featuredGuides = guides.slice(lower, upper);

    featuredGuides.forEach(g => {
        const c = el('div', 'guide');
        const thumb = el('div', 'thumb', g.thumb ? `<img src="${g.thumb}" alt="Preview of ${g.title}" />` : `<span>No preview</span>`);
        const title = el('div', '', `<strong>${g.title}</strong>`);
        const meta = el('div', 'meta', `<div class="tag">${g.level}</div><div><button onclick="openGuide('${g.id}')">Open</button></div>`);
        c.appendChild(thumb); c.appendChild(title); c.appendChild(meta);
        grid.appendChild(c);
    });
    container.appendChild(grid);
}

// --- Guides page ---
function renderGuides(container, filter = '') {
    container.innerHTML = '';
    const header = el('div', '', `<h2>Study Guides</h2><p class="small">Click a card to open the PDF (opens in new tab). Guides are grouped by HL/SL and searchable.</p>`);
    container.appendChild(header);
    const grid = el('div', 'grid');
    const results = guides.filter(g => {
        if (!filter)
            return true;
        const s = filter.toLowerCase();
        return g.title.toLowerCase().includes(s) || g.level.toLowerCase().includes(s) || (g.tags && g.tags.join(' ').toLowerCase().includes(s));
    });

    if (results.length === 0) {
        container.appendChild(el('p', 'small', 'No guides matched your search.')); return
    }
    results.forEach(g => {
        const card = el('div', 'guide');
        const thumb = el('div', 'thumb', g.thumb ? `<img src="${g.thumb}" alt="Preview of ${g.title}" />` : `<span>No preview</span>`);
        const title = el('div', '', `<strong>${g.title}</strong>`);
        const meta = el('div', 'meta', `<div class="tag">${g.level}</div><div><button onclick="openGuide('${g.id}')">Open</button></div>`);
        card.appendChild(thumb);
        card.appendChild(title);
        card.appendChild(meta);
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

function openGuide(id) {
    const g = guides.find(x => x.id === id);
    if (!g)
        return alert('Guide not found');
    if (g.pdf) {
        window.open(g.pdf, '_blank');
    }
    else alert('PDF not uploaded yet. Place the PDF in /assets/guides and update the guides array in index.html with its filename.');
}

// --- Quizzes page ---
function renderQuizzes(container, filter = '') {
    container.innerHTML = '';
    const header = el('div', '', `<h2>Study Quizzes</h2><p class="small">Select a quiz to start. Answers are shown at the end and stored locally for review.</p>`);
    container.appendChild(header);
    const list = el('div', 'grid');
    const results = quizzes.filter(q => {
        if (!filter)
            return true;
        const s = filter.toLowerCase();
        return q.title.toLowerCase().includes(s) || q.level.toLowerCase().includes(s)
    });

    if (results.length === 0) {
        container.appendChild(el('p', 'small', 'No quizzes matched your search.')); return
    }
    results.forEach(q => {
        const card = el('div', 'guide');
        const thumb = el('div', 'thumb', `<span>Quiz</span>`);
        const title = el('div', '', `<strong>${q.title}</strong>`);
        const meta = el('div', 'meta', `<div class="tag">${q.level}</div><div><button onclick="startQuiz('${q.id}')">Start</button></div>`);
        card.appendChild(thumb);
        card.appendChild(title);
        card.appendChild(meta);
        list.appendChild(card);
    });
    container.appendChild(list);
}

// --- Quiz runner ---
let current = { quiz: null, index: 0, score: 0, answers: [] };
function startQuiz(id) {
    const q = quizzes.find(x => x.id === id); if (!q) return;
    current.quiz = q; current.index = 0; current.score = 0; current.answers = [];
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const container = document.getElementById('app'); container.innerHTML = '';
    const q = current.quiz.questions[current.index];
    const card = el('div', 'quiz-card');
    card.innerHTML = `<h3>${current.quiz.title} — Q${current.index + 1}/${current.quiz.questions.length}</h3><p class="small">${q.q}</p>`;
    const choices = el('div', 'choices');
    q.choices.forEach((c, i) => {
        const ch = el('div', 'choice', c);
        ch.onclick = () => selectChoice(i);
        choices.appendChild(ch);
    });
    card.appendChild(choices);
    container.appendChild(card);
}

function selectChoice(i) {
    const qObj = current.quiz.questions[current.index];
    const isCorrect = i === qObj.answer;
    current.answers.push({ question: qObj.q, chosen: i, correct: qObj.answer });
    if (isCorrect)
        current.score += 1;

    // show feedback
    const choices = document.querySelectorAll('.choice');
    choices.forEach((c, idx) => {
        c.classList.remove('correct', 'wrong');
        if (idx === qObj.answer)
            c.classList.add('correct');
        if (idx === i && idx !== qObj.answer)
            c.classList.add('wrong');
        c.onclick = null;
    });

    // next button
    setTimeout(() => {
        current.index += 1;
        if (current.index < current.quiz.questions.length)
            renderQuizQuestion();
        else
            renderQuizResult();
    }, 700);
}

function renderQuizResult() {
    const container = document.getElementById('app'); container.innerHTML = '';
    const card = el('div', 'quiz-card');
    card.innerHTML = `<h3>${current.quiz.title} — Result</h3><p class="small">Score: ${current.score} / ${current.quiz.questions.length}</p>`;
    const review = el('div');
    current.answers.forEach((a, idx) => {
        const correct = a.correct; const chosen = a.chosen;
        const q = current.quiz.questions[idx];
        const item = el('div', '', `<strong>Q${idx + 1}.</strong> ${a.question} <div class="small">Your answer: ${q.choices[chosen]} | Correct: ${q.choices[correct]}</div><hr/>`);
        review.appendChild(item);
    });
    card.appendChild(review);
    const back = el('div', '', `<div style="margin-top:12px"><button onclick="navigate('#/quizzes')">Back to quizzes</button></div>`);
    card.appendChild(back);
    container.appendChild(card);
}

function renderNotFound(container) {
    container.innerHTML = '<h2>Page not found</h2>'
}

// --- Search ---
function doSearch(term) {
    if (!term) {
        navigate('#/');
        return;
    }

    // search guides and quizzes
    const gMatches = guides.filter(g => (g.title + ' ' + g.tags.join(' ') + ' ' + g.level).toLowerCase().includes(term.toLowerCase()));
    const qMatches = quizzes.filter(q => (q.title + ' ' + q.level).toLowerCase().includes(term.toLowerCase()));

    // If both empty, show no results on guides page
    if (gMatches.length === 0 && qMatches.length === 0) {
        // show generic page with no results
        const app = document.getElementById('app'); app.innerHTML = `<h2>No results found for "${term}"</h2><p class="small">Try different keywords or check HL1 / HL2 / SL tags.</p>`; return;
    }

    // Prefer showing the combined results page
    const app = document.getElementById('app'); app.innerHTML = '';
    const h = el('div', '', `<h2>Search results for "${term}"</h2>`); app.appendChild(h);
    if (gMatches.length) {
        const gsec = el('div', '', `<h3>Guides</h3>`);
        app.appendChild(gsec); const grid = el('div', 'grid');
        gMatches.forEach(g => {
            const card = el('div', 'guide');
            const thumb = el('div', 'thumb', g.thumb ? `<img src="${g.thumb}" alt="Preview of ${g.title}" />` : `<span>No preview</span>`);
            const title = el('div', '', `<strong>${g.title}</strong>`);
            const meta = el('div', 'meta', `<div class="tag">${g.level}</div><div><button onclick="openGuide('${g.id}')">Open</button></div>`);
            card.appendChild(thumb);
            card.appendChild(title);
            card.appendChild(meta);
            grid.appendChild(card);
        });
        app.appendChild(grid);
    }

    if (qMatches.length) {
        const qsec = el('div', '', `<h3>Quizzes</h3>`);
        app.appendChild(qsec); const grid2 = el('div', 'grid');
        qMatches.forEach(q => {
            const card = el('div', 'guide');
            card.innerHTML = `<div class="thumb">Quiz</div><strong>${q.title}</strong><div class="meta"><div class="tag">${q.level}</div><div><button onclick="startQuiz('${q.id}')">Start</button></div></div>`;
            grid2.appendChild(card);
        }); app.appendChild(grid2)
    }
}

// --- events ---
document.getElementById('searchBtn').addEventListener('click', () => {
    const v = document.getElementById('searchInput').value.trim();
    doSearch(v);
});

document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        doSearch(e.target.value.trim())
    }
});
window.addEventListener('hashchange', render);

// initial render
render();

// --- Notes for maintainer (visible in code) ---
/*

To add guides:
- Place PDFs in /assets/guides
- Add an entry to `guides` array with {id,title,level,tags,pdf:'assets/guides/yourfile.pdf'}

To add quizzes:
- Edit `quizzes` array. Each quiz: {id,title,level,questions:[{q,choices:[..],answer:index}]}

This is a pure static site (single file). For production you may split into files and add proper thumbnails.
*/
