/* ==========================================================================
   ATS Resume Craft - Controlador Principal de la Aplicación
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  currentCV: null,
  activePhraseTargetInput: null,
  currentZoom: 1,

  init() {
    // 1. Cargar el CV activo desde LocalStorage
    this.currentCV = StorageManager.getCurrentCV();

    // 2. Inicializar Tema (Oscuro/Claro)
    this.initTheme();

    // 3. Inicializar Vista Móvil
    this.initMobileView();

    // 4. Renderizar Formularios y Selector de CVs
    this.renderCVSelector();
    this.fillFormsFromData();

    // 5. Renderizar Vista Previa y Calcular Score ATS Inicial
    this.renderLivePreview();
    this.updateATSScore();

    // 6. Vincular Eventos de la Interfaz
    this.bindEvents();
  },

  initMobileView() {
    if (window.innerWidth <= 1024) {
      document.body.classList.add("mobile-view-editor");
    }
  },

  /* --- GESTIÓN DE TEMAS (Oscuro / Claro) --- */
  initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
  },

  /* --- POBLAR FORMULARIOS CON LOS DATOS DEL CV --- */
  fillFormsFromData() {
    const cv = this.currentCV;

    // Datos Personales
    const p = cv.personal || {};
    document.getElementById("fullName").value = p.fullName || "";
    document.getElementById("jobTitle").value = p.jobTitle || "";
    document.getElementById("email").value = p.email || "";
    document.getElementById("phone").value = p.phone || "";
    document.getElementById("location").value = p.location || "";
    document.getElementById("linkedin").value = p.linkedin || "";
    document.getElementById("website").value = p.website || "";

    // Perfil / Resumen
    document.getElementById("summaryText").value = cv.summary || "";
    this.updateSummaryWordCount();

    // Listas Dinámicas
    this.renderExperienceList();
    this.renderEducationList();

    // Habilidades
    const sk = cv.skills || {};
    document.getElementById("techSkillsInput").value = sk.technical || "";
    document.getElementById("softSkillsInput").value = sk.soft || "";
    document.getElementById("toolsInput").value = sk.tools || "";

    // Proyectos & Extras
    this.renderProjectsList();
    this.renderCertificationsList();
    this.renderLanguagesList();
  },

  /* --- OBTENER DATOS DE LOS FORMULARIOS AL EDITAR --- */
  syncDataFromForms() {
    if (!this.currentCV) return;

    // Personal
    this.currentCV.personal = {
      fullName: document.getElementById("fullName").value,
      jobTitle: document.getElementById("jobTitle").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      location: document.getElementById("location").value,
      linkedin: document.getElementById("linkedin").value,
      website: document.getElementById("website").value
    };

    // Summary
    this.currentCV.summary = document.getElementById("summaryText").value;

    // Habilidades
    this.currentCV.skills = {
      technical: document.getElementById("techSkillsInput").value,
      soft: document.getElementById("softSkillsInput").value,
      tools: document.getElementById("toolsInput").value
    };

    // Guardar cambios en LocalStorage
    StorageManager.saveCurrentCV(this.currentCV);

    // Actualizar vista previa y score ATS
    this.renderLivePreview();
    this.updateATSScore();
    this.updateSummaryWordCount();
  },

  updateSummaryWordCount() {
    const text = document.getElementById("summaryText").value || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const el = document.getElementById("summaryCharCount");
    if (el) {
      el.textContent = `${words} palabras (Recomendado: 40-90 palabras)`;
    }
  },

  /* --- RENDERIZADO DE EXPERIENCIA LABORAL --- */
  renderExperienceList() {
    const container = document.getElementById("experienceList");
    container.innerHTML = "";

    const list = this.currentCV.experience || [];
    list.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card-item";
      card.innerHTML = `
        <div class="card-header-bar">
          <span class="card-item-title">${item.role || "Nuevo Empleo"} ${item.company ? `en ${item.company}` : ""}</span>
          <button type="button" class="btn-remove-item" onclick="App.removeExperience(${index})">Eliminar</button>
        </div>
        <div class="form-grid">
          <div class="form-group col-half">
            <label>Puesto / Cargo *</label>
            <input type="text" class="form-control exp-role" value="${item.role || ''}" placeholder="Ej. Senior Frontend Dev" oninput="App.updateExpItem(${index})">
          </div>
          <div class="form-group col-half">
            <label>Empresa *</label>
            <input type="text" class="form-control exp-company" value="${item.company || ''}" placeholder="Ej. Google" oninput="App.updateExpItem(${index})">
          </div>
          <div class="form-group col-half">
            <label>Ubicación</label>
            <input type="text" class="form-control exp-location" value="${item.location || ''}" placeholder="Ej. México (Remoto)" oninput="App.updateExpItem(${index})">
          </div>
          <div class="form-group col-half">
            <label>Fechas (Inicio - Fin) *</label>
            <input type="text" class="form-control exp-date" value="${item.startDate || ''} - ${item.endDate || ''}" placeholder="Ej. 2021-03 - Presente" oninput="App.updateExpItem(${index})">
          </div>
          <div class="form-group col-full">
            <div class="textarea-header">
              <label>Logros & Viñetas (Una por línea) *</label>
              <button type="button" class="btn-text-link" onclick="App.openPhraseBankForExp(${index})">✨ Sugerir frase</button>
            </div>
            <textarea class="form-control textarea-large exp-bullets" rows="3" placeholder="Diseñó la arquitectura de microservicios reduciendo el tiempo de latencia en un 40%..." oninput="App.updateExpItem(${index})">${(item.bullets || []).join('\n')}</textarea>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  addExperience() {
    if (!this.currentCV.experience) this.currentCV.experience = [];
    this.currentCV.experience.push({
      id: "exp_" + Date.now(),
      role: "",
      company: "",
      location: "",
      startDate: "2022-01",
      endDate: "Presente",
      bullets: [""]
    });
    this.renderExperienceList();
    this.syncDataFromForms();
  },

  updateExpItem(index) {
    const card = document.querySelectorAll("#experienceList .card-item")[index];
    if (!card) return;

    const role = card.querySelector(".exp-role").value;
    const company = card.querySelector(".exp-company").value;
    const location = card.querySelector(".exp-location").value;
    const dateStr = card.querySelector(".exp-date").value;
    const bulletsText = card.querySelector(".exp-bullets").value;

    const dates = dateStr.split(" - ");

    this.currentCV.experience[index] = {
      ...this.currentCV.experience[index],
      role,
      company,
      location,
      startDate: dates[0] || "",
      endDate: dates[1] || "",
      bullets: bulletsText.split("\n").filter(b => b.trim().length > 0)
    };

    StorageManager.saveCurrentCV(this.currentCV);
    this.renderLivePreview();
    this.updateATSScore();
  },

  removeExperience(index) {
    this.currentCV.experience.splice(index, 1);
    this.renderExperienceList();
    this.syncDataFromForms();
  },

  /* --- RENDERIZADO DE EDUCACIÓN --- */
  renderEducationList() {
    const container = document.getElementById("educationList");
    container.innerHTML = "";

    const list = this.currentCV.education || [];
    list.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card-item";
      card.innerHTML = `
        <div class="card-header-bar">
          <span class="card-item-title">${item.degree || "Estudio"}</span>
          <button type="button" class="btn-remove-item" onclick="App.removeEducation(${index})">Eliminar</button>
        </div>
        <div class="form-grid">
          <div class="form-group col-half">
            <label>Titulación / Grado *</label>
            <input type="text" class="form-control edu-degree" value="${item.degree || ''}" placeholder="Ej. Lic. en Ciencias de la Computación" oninput="App.updateEduItem(${index})">
          </div>
          <div class="form-group col-half">
            <label>Institución Educativa *</label>
            <input type="text" class="form-control edu-inst" value="${item.institution || ''}" placeholder="Ej. Universidad Nacional" oninput="App.updateEduItem(${index})">
          </div>
          <div class="form-group col-half">
            <label>Ubicación</label>
            <input type="text" class="form-control edu-loc" value="${item.location || ''}" placeholder="Ej. Madrid, España" oninput="App.updateEduItem(${index})">
          </div>
          <div class="form-group col-half">
            <label>Año de Graduación / Periodo</label>
            <input type="text" class="form-control edu-date" value="${item.endDate || ''}" placeholder="Ej. 2018 - 2022" oninput="App.updateEduItem(${index})">
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  addEducation() {
    if (!this.currentCV.education) this.currentCV.education = [];
    this.currentCV.education.push({
      id: "edu_" + Date.now(),
      degree: "",
      institution: "",
      location: "",
      endDate: "2022"
    });
    this.renderEducationList();
    this.syncDataFromForms();
  },

  updateEduItem(index) {
    const card = document.querySelectorAll("#educationList .card-item")[index];
    if (!card) return;

    this.currentCV.education[index] = {
      ...this.currentCV.education[index],
      degree: card.querySelector(".edu-degree").value,
      institution: card.querySelector(".edu-inst").value,
      location: card.querySelector(".edu-loc").value,
      endDate: card.querySelector(".edu-date").value
    };

    StorageManager.saveCurrentCV(this.currentCV);
    this.renderLivePreview();
    this.updateATSScore();
  },

  removeEducation(index) {
    this.currentCV.education.splice(index, 1);
    this.renderEducationList();
    this.syncDataFromForms();
  },

  /* --- RENDERIZADO DE PROYECTOS --- */
  renderProjectsList() {
    const container = document.getElementById("projectsList");
    container.innerHTML = "";

    const list = this.currentCV.projects || [];
    list.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card-item";
      card.innerHTML = `
        <div class="card-header-bar">
          <span class="card-item-title">${item.name || "Proyecto"}</span>
          <button type="button" class="btn-remove-item" onclick="App.removeProject(${index})">Eliminar</button>
        </div>
        <div class="form-grid">
          <div class="form-group col-half">
            <label>Nombre del Proyecto</label>
            <input type="text" class="form-control proj-name" value="${item.name || ''}" placeholder="Ej. E-Commerce SaaS" oninput="App.updateProjItem(${index})">
          </div>
          <div class="form-group col-half">
            <label>Enlace / GitHub</label>
            <input type="text" class="form-control proj-link" value="${item.link || ''}" placeholder="github.com/mi-proyecto" oninput="App.updateProjItem(${index})">
          </div>
          <div class="form-group col-full">
            <label>Descripción corta & Tecnologías clave</label>
            <textarea class="form-control proj-desc" rows="2" placeholder="Sistema de reservas en tiempo real..." oninput="App.updateProjItem(${index})">${item.description || ''}</textarea>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  addProject() {
    if (!this.currentCV.projects) this.currentCV.projects = [];
    this.currentCV.projects.push({ id: "proj_" + Date.now(), name: "", link: "", description: "" });
    this.renderProjectsList();
    this.syncDataFromForms();
  },

  updateProjItem(index) {
    const card = document.querySelectorAll("#projectsList .card-item")[index];
    if (!card) return;

    this.currentCV.projects[index] = {
      ...this.currentCV.projects[index],
      name: card.querySelector(".proj-name").value,
      link: card.querySelector(".proj-link").value,
      description: card.querySelector(".proj-desc").value
    };

    StorageManager.saveCurrentCV(this.currentCV);
    this.renderLivePreview();
    this.updateATSScore();
  },

  removeProject(index) {
    this.currentCV.projects.splice(index, 1);
    this.renderProjectsList();
    this.syncDataFromForms();
  },

  /* --- RENDERIZADO DE CERTIFICACIONES E IDIOMAS --- */
  renderCertificationsList() {
    const container = document.getElementById("certificationsList");
    container.innerHTML = "";

    const list = this.currentCV.certifications || [];
    list.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card-item";
      card.innerHTML = `
        <div class="card-header-bar">
          <span class="card-item-title">${item.title || "Certificación"}</span>
          <button type="button" class="btn-remove-item" onclick="App.removeCert(${index})">Eliminar</button>
        </div>
        <div class="form-grid">
          <div class="form-group col-half">
            <label>Título de Certificación</label>
            <input type="text" class="form-control cert-title" value="${item.title || ''}" placeholder="Ej. AWS Solutions Architect" oninput="App.updateCertItem(${index})">
          </div>
          <div class="form-group col-half">
            <label>Emisor / Organización</label>
            <input type="text" class="form-control cert-issuer" value="${item.issuer || ''}" placeholder="Ej. Amazon Web Services" oninput="App.updateCertItem(${index})">
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  addCert() {
    if (!this.currentCV.certifications) this.currentCV.certifications = [];
    this.currentCV.certifications.push({ id: "cert_" + Date.now(), title: "", issuer: "" });
    this.renderCertificationsList();
    this.syncDataFromForms();
  },

  updateCertItem(index) {
    const card = document.querySelectorAll("#certificationsList .card-item")[index];
    if (!card) return;

    this.currentCV.certifications[index] = {
      ...this.currentCV.certifications[index],
      title: card.querySelector(".cert-title").value,
      issuer: card.querySelector(".cert-issuer").value
    };

    StorageManager.saveCurrentCV(this.currentCV);
    this.renderLivePreview();
    this.updateATSScore();
  },

  removeCert(index) {
    this.currentCV.certifications.splice(index, 1);
    this.renderCertificationsList();
    this.syncDataFromForms();
  },

  renderLanguagesList() {
    const container = document.getElementById("languagesList");
    container.innerHTML = "";

    const list = this.currentCV.languages || [];
    list.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card-item";
      card.innerHTML = `
        <div class="card-header-bar">
          <span class="card-item-title">${item.name || "Idioma"}</span>
          <button type="button" class="btn-remove-item" onclick="App.removeLang(${index})">Eliminar</button>
        </div>
        <div class="form-grid">
          <div class="form-group col-half">
            <label>Idioma</label>
            <input type="text" class="form-control lang-name" value="${item.name || ''}" placeholder="Ej. Inglés" oninput="App.updateLangItem(${index})">
          </div>
          <div class="form-group col-half">
            <label>Nivel de Dominio</label>
            <input type="text" class="form-control lang-level" value="${item.level || ''}" placeholder="Ej. Avanzado C1 / Bilingüe" oninput="App.updateLangItem(${index})">
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  addLang() {
    if (!this.currentCV.languages) this.currentCV.languages = [];
    this.currentCV.languages.push({ id: "lang_" + Date.now(), name: "", level: "" });
    this.renderLanguagesList();
    this.syncDataFromForms();
  },

  updateLangItem(index) {
    const card = document.querySelectorAll("#languagesList .card-item")[index];
    if (!card) return;

    this.currentCV.languages[index] = {
      ...this.currentCV.languages[index],
      name: card.querySelector(".lang-name").value,
      level: card.querySelector(".lang-level").value
    };

    StorageManager.saveCurrentCV(this.currentCV);
    this.renderLivePreview();
    this.updateATSScore();
  },

  removeLang(index) {
    this.currentCV.languages.splice(index, 1);
    this.renderLanguagesList();
    this.syncDataFromForms();
  },

  /* --- RENDERIZADO DE LA VISTA PREVIA ATS --- */
  renderLivePreview() {
    const paper = document.getElementById("atsResumePaper");
    if (!paper) return;

    const cv = this.currentCV;
    const p = cv.personal || {};

    // Formateo de Contacto Bar
    const contactParts = [];
    if (p.email) contactParts.push(`<span class="ats-contact-item">${p.email}</span>`);
    if (p.phone) contactParts.push(`<span class="ats-contact-item">${p.phone}</span>`);
    if (p.location) contactParts.push(`<span class="ats-contact-item">${p.location}</span>`);
    if (p.linkedin) contactParts.push(`<span class="ats-contact-item">${p.linkedin}</span>`);
    if (p.website) contactParts.push(`<span class="ats-contact-item">${p.website}</span>`);

    let html = `
      <header class="ats-header">
        <h1 class="ats-name">${p.fullName || 'TU NOMBRE COMPLETO'}</h1>
        <div class="ats-title">${p.jobTitle || 'TÍTULO PROFESIONAL / CARGO OBJETIVO'}</div>
        <div class="ats-contact-bar">
          ${contactParts.join(' <span class="ats-contact-separator">•</span> ')}
        </div>
      </header>
    `;

    // 1. Resumen
    if (cv.summary && cv.summary.trim()) {
      html += `
        <section class="ats-section">
          <h2 class="ats-section-title">PERFIL PROFESIONAL</h2>
          <p class="ats-summary-text">${cv.summary}</p>
        </section>
      `;
    }

    // 2. Experiencia Laboral
    const exps = cv.experience || [];
    if (exps.length > 0) {
      html += `<section class="ats-section"><h2 class="ats-section-title">EXPERIENCIA LABORAL</h2>`;
      exps.forEach(exp => {
        if (!exp.role && !exp.company) return;
        const bulletsHtml = (exp.bullets || [])
          .filter(b => b.trim())
          .map(b => `<li>${b}</li>`)
          .join('');

        html += `
          <div class="ats-entry-item">
            <div class="ats-entry-header">
              <div>
                <span class="ats-entry-role">${exp.role || ''}</span> 
                ${exp.company ? `<span class="ats-entry-company">| ${exp.company}</span>` : ''}
              </div>
              <div class="ats-entry-date">${exp.startDate || ''} ${exp.endDate ? `- ${exp.endDate}` : ''}</div>
            </div>
            ${exp.location ? `<div class="ats-entry-location">${exp.location}</div>` : ''}
            ${bulletsHtml ? `<ul class="ats-bullet-list">${bulletsHtml}</ul>` : ''}
          </div>
        `;
      });
      html += `</section>`;
    }

    // 3. Educación
    const edus = cv.education || [];
    if (edus.length > 0) {
      html += `<section class="ats-section"><h2 class="ats-section-title">EDUCACIÓN & FORMACIÓN</h2>`;
      edus.forEach(edu => {
        if (!edu.degree) return;
        html += `
          <div class="ats-entry-item">
            <div class="ats-entry-header">
              <div>
                <span class="ats-entry-role">${edu.degree}</span> 
                ${edu.institution ? `<span class="ats-entry-company">| ${edu.institution}</span>` : ''}
              </div>
              <div class="ats-entry-date">${edu.endDate || ''}</div>
            </div>
            ${edu.location ? `<div class="ats-entry-location">${edu.location}</div>` : ''}
          </div>
        `;
      });
      html += `</section>`;
    }

    // 4. Habilidades
    const sk = cv.skills || {};
    if (sk.technical || sk.soft || sk.tools) {
      html += `<section class="ats-section"><h2 class="ats-section-title">HABILIDADES & COMPETENCIAS</h2><div class="ats-skills-container">`;
      if (sk.technical) html += `<div class="ats-skill-group"><span class="ats-skill-label">Técnicas (Hard Skills):</span> ${sk.technical}</div>`;
      if (sk.soft) html += `<div class="ats-skill-group"><span class="ats-skill-label">Interpersonales (Soft Skills):</span> ${sk.soft}</div>`;
      if (sk.tools) html += `<div class="ats-skill-group"><span class="ats-skill-label">Herramientas:</span> ${sk.tools}</div>`;
      html += `</div></section>`;
    }

    // 5. Proyectos
    const projs = cv.projects || [];
    if (projs.length > 0) {
      html += `<section class="ats-section"><h2 class="ats-section-title">PROYECTOS DESTACADOS</h2>`;
      projs.forEach(pj => {
        if (!pj.name) return;
        html += `
          <div class="ats-entry-item">
            <div class="ats-entry-header">
              <span class="ats-entry-role">${pj.name}</span>
              ${pj.link ? `<span class="ats-entry-date">${pj.link}</span>` : ''}
            </div>
            ${pj.description ? `<p class="ats-summary-text">${pj.description}</p>` : ''}
          </div>
        `;
      });
      html += `</section>`;
    }

    // 6. Certificaciones & Idiomas
    const certs = cv.certifications || [];
    const langs = cv.languages || [];

    if (certs.length > 0 || langs.length > 0) {
      html += `<section class="ats-section"><h2 class="ats-section-title">CERTIFICACIONES E IDIOMAS</h2><div class="ats-inline-list">`;
      if (certs.length > 0) {
        const certStr = certs.map(c => `${c.title}${c.issuer ? ` (${c.issuer})` : ''}`).join(', ');
        html += `<div class="ats-inline-item"><span class="ats-bold">Certificaciones:</span> ${certStr}</div>`;
      }
      if (langs.length > 0) {
        const langStr = langs.map(l => `${l.name}${l.level ? ` (${l.level})` : ''}`).join(', ');
        html += `<div class="ats-inline-item"><span class="ats-bold">Idiomas:</span> ${langStr}</div>`;
      }
      html += `</div></section>`;
    }

    paper.innerHTML = html;
  },

  /* --- ACTUALIZAR WIDGET Y MODAL ATS SCORE --- */
  updateATSScore() {
    const result = ATSEvaluator.evaluate(this.currentCV);

    // Actualizar Widget Header
    const progressPath = document.getElementById("atsScoreProgress");
    const scoreValText = document.getElementById("atsScoreText");
    const statusText = document.getElementById("atsScoreStatus");

    if (progressPath) progressPath.setAttribute("stroke-dasharray", `${result.score}, 100`);
    if (scoreValText) scoreValText.textContent = `${result.score}%`;
    if (statusText) {
      statusText.textContent = result.statusText;
      statusText.className = `score-status ${result.statusClass}`;
    }

    // Modal
    const modalScoreVal = document.getElementById("modalScoreVal");
    const modalScoreTitle = document.getElementById("modalScoreStatusTitle");
    const modalScoreSummary = document.getElementById("modalScoreSummary");
    const checklistUl = document.getElementById("atsChecklist");

    if (modalScoreVal) modalScoreVal.textContent = `${result.score}%`;
    if (modalScoreTitle) modalScoreTitle.textContent = result.statusText;
    if (modalScoreSummary) modalScoreSummary.textContent = `Tu CV cumple con ${result.checklist.filter(c => c.status === 'pass').length} de los ${result.checklist.length} criterios clave de evaluación de los algoritmos ATS.`;

    if (checklistUl) {
      checklistUl.innerHTML = result.checklist.map(item => `
        <li class="ats-check-item ${item.status}">
          <span>${item.status === 'pass' ? '✅' : item.status === 'warn' ? '⚠️' : '❌'}</span>
          <span>${item.text}</span>
        </li>
      `).join('');
    }
  },

  /* --- RENDERIZAR SELECTOR DE CVS --- */
  renderCVSelector() {
    const select = document.getElementById("cvSelect");
    if (!select) return;

    const list = StorageManager.getAllCVs();
    const activeId = StorageManager.getActiveCVID();

    select.innerHTML = list.map(cv => `
      <option value="${cv.id}" ${cv.id === activeId ? 'selected' : ''}>
        ${cv.title || 'CV sin título'}
      </option>
    `).join('');
  },

  switchActiveCV(id) {
    StorageManager.setActiveCVID(id);
    this.currentCV = StorageManager.getCurrentCV();
    this.fillFormsFromData();
    this.renderLivePreview();
    this.updateATSScore();
    this.renderCVSelector();
  },

  currentStepIndex: 0,
  stepsOrder: ['personal', 'summary', 'experience', 'skills', 'extras'],

  goToStep(index) {
    if (index < 0 || index >= this.stepsOrder.length) return;
    this.currentStepIndex = index;
    const targetTab = this.stepsOrder[index];

    // Actualizar barra de pasos CotizadorSft
    document.querySelectorAll(".cotizador-step").forEach((step, i) => {
      if (i === index) step.classList.add("active");
      else step.classList.remove("active");
    });

    // Actualizar Pestañas
    document.querySelectorAll(".tab-btn").forEach(b => {
      if (b.getAttribute("data-tab") === targetTab) b.classList.add("active");
      else b.classList.remove("active");
    });

    // Actualizar Paneles
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    const pane = document.getElementById(`pane-${targetTab}`);
    if (pane) pane.classList.add("active");

    // Actualizar Botones del Pie de Navegación
    const prevBtn = document.getElementById("btnPrevStep");
    const nextBtn = document.getElementById("btnNextStep");
    const indicatorText = document.getElementById("stepIndicatorText");

    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) {
      if (index === this.stepsOrder.length - 1) {
        nextBtn.textContent = "🖨️ Descargar PDF";
      } else {
        nextBtn.textContent = "Siguiente →";
      }
    }
    if (indicatorText) {
      indicatorText.textContent = `Paso ${index + 1} de ${this.stepsOrder.length}`;
    }
  },

  /* --- EVENTOS DE INTERFAZ Y EVENT LISTENERS --- */
  bindEvents() {
    // Mobile View Toggle Switch
    document.querySelectorAll(".mobile-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".mobile-toggle-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const view = btn.getAttribute("data-view");
        if (view === "preview") {
          document.body.classList.remove("mobile-view-editor");
          document.body.classList.add("mobile-view-preview");
        } else {
          document.body.classList.remove("mobile-view-preview");
          document.body.classList.add("mobile-view-editor");
        }
      });
    });

    // 0. Pasos del CotizadorSft
    document.querySelectorAll(".cotizador-step").forEach((stepBtn, idx) => {
      stepBtn.addEventListener("click", () => {
        this.goToStep(idx);
      });
    });

    document.getElementById("btnPrevStep")?.addEventListener("click", () => {
      this.goToStep(this.currentStepIndex - 1);
    });

    document.getElementById("btnNextStep")?.addEventListener("click", () => {
      if (this.currentStepIndex === this.stepsOrder.length - 1) {
        PDFExporter.exportToPDF(this.currentCV.title);
      } else {
        this.goToStep(this.currentStepIndex + 1);
      }
    });

    // 1. Selector de Pestañas
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        const stepIdx = this.stepsOrder.indexOf(targetTab);
        if (stepIdx !== -1) {
          this.goToStep(stepIdx);
        } else {
          document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
          document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
          btn.classList.add("active");
          const pane = document.getElementById(`pane-${targetTab}`);
          if (pane) pane.classList.add("active");
        }
      });
    });

    // 2. Inputs de Formularios (Sincronización en tiempo real)
    const inputs = document.querySelectorAll("#form-personal input, #summaryText, #techSkillsInput, #softSkillsInput, #toolsInput");
    inputs.forEach(input => {
      input.addEventListener("input", () => this.syncDataFromForms());
    });

    // 3. Botones Agregar Elementos
    document.getElementById("btnAddExperience")?.addEventListener("click", () => this.addExperience());
    document.getElementById("btnAddEducation")?.addEventListener("click", () => this.addEducation());
    document.getElementById("btnAddProject")?.addEventListener("click", () => this.addProject());
    document.getElementById("btnAddCert")?.addEventListener("click", () => this.addCert());
    document.getElementById("btnAddLang")?.addEventListener("click", () => this.addLang());

    // 4. Selector de CV activo
    document.getElementById("cvSelect")?.addEventListener("change", (e) => {
      this.switchActiveCV(e.target.value);
    });

    // 5. Botón de Tema (Claro/Oscuro)
    document.getElementById("btnThemeToggle")?.addEventListener("click", () => this.toggleTheme());

    // 6. Botón Exportar PDF
    document.getElementById("btnExportPDF")?.addEventListener("click", () => {
      PDFExporter.exportToPDF(this.currentCV.title);
    });

    // 7. Botón Exportar JSON
    document.getElementById("btnExportJSON")?.addEventListener("click", () => {
      StorageManager.exportCVToJSON(this.currentCV);
    });

    // 8. Selector de Fuente ATS en Vista Previa
    document.getElementById("atsFontSelect")?.addEventListener("change", (e) => {
      const paper = document.getElementById("atsResumePaper");
      if (paper) {
        paper.className = `ats-paper-page ${e.target.value}`;
      }
    });

    // 9. Zoom Vista Previa
    document.getElementById("btnZoomIn")?.addEventListener("click", () => {
      if (this.currentZoom < 1.4) {
        this.currentZoom += 0.1;
        document.getElementById("atsResumePaper").style.transform = `scale(${this.currentZoom})`;
      }
    });

    document.getElementById("btnZoomOut")?.addEventListener("click", () => {
      if (this.currentZoom > 0.6) {
        this.currentZoom -= 0.1;
        document.getElementById("atsResumePaper").style.transform = `scale(${this.currentZoom})`;
      }
    });

    // 10. Modales (Abrir / Cerrar)
    document.getElementById("atsScoreWidget")?.addEventListener("click", () => {
      this.openModal("atsScoreModal");
    });

    document.getElementById("btnManageCVs")?.addEventListener("click", () => {
      this.renderManageCVModal();
      this.openModal("cvManageModal");
    });

    document.getElementById("btnLoadSample")?.addEventListener("click", () => {
      this.openModal("sampleProfileModal");
    });

    document.querySelectorAll(".btn-close-modal").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal-backdrop");
        if (modal) modal.classList.remove("active");
      });
    });

    // 11. Modal Cargar Perfil Ejemplo
    document.querySelectorAll(".sample-card-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const key = e.currentTarget.getAttribute("data-sample");
        if (SAMPLE_PROFILES[key]) {
          const sample = JSON.parse(JSON.stringify(SAMPLE_PROFILES[key]));
          sample.id = "cv_" + Date.now();
          
          const list = StorageManager.getAllCVs();
          list.push(sample);
          StorageManager.saveAllCVs(list);
          StorageManager.setActiveCVID(sample.id);

          this.currentCV = sample;
          this.fillFormsFromData();
          this.renderLivePreview();
          this.updateATSScore();
          this.renderCVSelector();

          this.closeModal("sampleProfileModal");
        }
      });
    });

    // 12. Banco de Frases Modal & Categorías
    document.querySelectorAll(".btn-phrase-suggest").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetId = e.currentTarget.getAttribute("data-target");
        this.activePhraseTargetInput = document.getElementById(targetId);
        this.renderPhraseList("tech");
        this.openModal("phraseBankModal");
      });
    });

    document.getElementById("phraseCategorySelect")?.addEventListener("change", (e) => {
      this.renderPhraseList(e.target.value);
    });

    // 13. Importar JSON
    document.getElementById("btnTriggerImportJSON")?.addEventListener("click", () => {
      document.getElementById("importJsonInput")?.click();
    });

    document.getElementById("importJsonInput")?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const imported = StorageManager.importCVFromJSON(event.target.result);
        if (imported) {
          this.currentCV = imported;
          this.fillFormsFromData();
          this.renderLivePreview();
          this.updateATSScore();
          this.renderCVSelector();
          this.closeModal("cvManageModal");
        }
      };
      reader.readAsText(file);
    });

    // 14. Crear Nuevo CV en Modal de Gestión
    document.getElementById("btnCreateNewCV")?.addEventListener("click", () => {
      const titleInput = document.getElementById("newCvTitleInput");
      const title = titleInput.value.trim() || "Nuevo CV Personalizado";
      
      const newCV = StorageManager.createNewCV(title);
      this.currentCV = newCV;
      this.fillFormsFromData();
      this.renderLivePreview();
      this.updateATSScore();
      this.renderCVSelector();
      titleInput.value = "";
      this.closeModal("cvManageModal");
    });
  },

  openPhraseBankForExp(expIndex) {
    const card = document.querySelectorAll("#experienceList .card-item")[expIndex];
    if (card) {
      this.activePhraseTargetInput = card.querySelector(".exp-bullets");
      this.renderPhraseList("tech");
      this.openModal("phraseBankModal");
    }
  },

  renderPhraseList(category) {
    const container = document.getElementById("phraseListContainer");
    if (!container) return;

    const phrases = PHRASE_BANK[category] || [];
    container.innerHTML = phrases.map((phrase, idx) => `
      <div class="phrase-item-card">
        <span>${phrase}</span>
        <button type="button" class="btn btn-secondary btn-sm" onclick="App.insertPhrase('${category}', ${idx})">
          + Usar Frase
        </button>
      </div>
    `).join('');
  },

  insertPhrase(category, idx) {
    const phrase = PHRASE_BANK[category][idx];
    if (this.activePhraseTargetInput && phrase) {
      const currentVal = this.activePhraseTargetInput.value.trim();
      this.activePhraseTargetInput.value = currentVal ? `${currentVal}\n${phrase}` : phrase;
      this.activePhraseTargetInput.dispatchEvent(new Event('input'));
      this.closeModal("phraseBankModal");
    }
  },

  renderManageCVModal() {
    const container = document.getElementById("cvStoredList");
    if (!container) return;

    const list = StorageManager.getAllCVs();
    const activeId = StorageManager.getActiveCVID();

    container.innerHTML = list.map(item => `
      <div class="cv-stored-item ${item.id === activeId ? 'active' : ''}">
        <div>
          <strong>${item.title || 'Sin Título'}</strong>
          <div class="text-subtle" style="font-size: 0.75rem;">${item.personal?.jobTitle || 'Sin cargo definido'}</div>
        </div>
        <div style="display: flex; gap: 0.4rem;">
          ${item.id !== activeId ? `<button class="btn btn-outline btn-sm" onclick="App.switchActiveCV('${item.id}'); App.closeModal('cvManageModal');">Activar</button>` : '<span class="brand-badge">Activo</span>'}
          <button class="btn btn-secondary btn-sm" onclick="App.deleteCVItem('${item.id}')">🗑️</button>
        </div>
      </div>
    `).join('');
  },

  deleteCVItem(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este currículum?")) {
      const remaining = StorageManager.deleteCV(id);
      if (remaining) {
        this.currentCV = StorageManager.getCurrentCV();
        this.fillFormsFromData();
        this.renderLivePreview();
        this.updateATSScore();
        this.renderCVSelector();
        this.renderManageCVModal();
      }
    }
  },

  openModal(modalId) {
    document.getElementById(modalId)?.classList.add("active");
  },

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove("active");
  }
};
