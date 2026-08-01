/* ==========================================================================
   ATS Resume Craft - Evaluador & Diagnóstico de Compatibilidad ATS
   ========================================================================== */

const ATSEvaluator = {
  // Lista de verbos de acción para detectar en las viñetas
  actionVerbs: [
    "lideró", "lidero", "optimizó", "optimizo", "diseñó", "diseño", "implementó", "implemento",
    "desarrolló", "desarrollo", "creó", "creo", "incrementó", "incremento", "redujo", "automatizó",
    "coordinó", "gestiónó", "gestionó", "refactorizó", "supervisó", "dirigió", "logró", "aumentó",
    "desplegó", "desplego", "audito", "auditó", "construyó", "escaló", "negoció"
  ],

  evaluate(cv) {
    let score = 0;
    const checklist = [];

    // 1. Evaluación de Información de Contacto (Máx: 20 pts)
    const p = cv.personal || {};
    let contactPts = 0;
    const missingContact = [];

    if (p.fullName && p.fullName.trim().length > 3) contactPts += 5; else missingContact.push("Nombre Completo");
    if (p.jobTitle && p.jobTitle.trim().length > 3) contactPts += 5; else missingContact.push("Título Profesional");
    if (p.email && p.email.includes("@")) contactPts += 4; else missingContact.push("Correo Electrónico");
    if (p.phone && p.phone.trim().length > 5) contactPts += 3; else missingContact.push("Teléfono");
    if (p.location && p.location.trim().length > 3) contactPts += 3; else missingContact.push("Ubicación");

    score += contactPts;

    if (contactPts === 20) {
      checklist.push({ status: 'pass', text: 'Información de Contacto Completa (Nombre, Cargo, Email, Teléfono, Ubicación).' });
    } else {
      checklist.push({ status: 'warn', text: `Faltan datos de contacto clave: ${missingContact.join(', ')}.` });
    }

    // 2. Perfil / Resumen Profesional (Máx: 15 pts)
    const summary = cv.summary || "";
    const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;

    if (wordCount >= 40 && wordCount <= 100) {
      score += 15;
      checklist.push({ status: 'pass', text: `Perfil Profesional con longitud ideal (${wordCount} palabras).` });
    } else if (wordCount > 0) {
      score += 8;
      checklist.push({ status: 'warn', text: `Perfil Profesional breve o extenso (${wordCount} palabras). Se recomiendan entre 40 y 90 palabras.` });
    } else {
      checklist.push({ status: 'fail', text: 'No has agregado un Perfil Profesional. Los filtros ATS priorizan este resumen.' });
    }

    // 3. Experiencia Laboral & Verbos de Acción (Máx: 25 pts)
    const experiences = cv.experience || [];
    if (experiences.length > 0) {
      let expPts = 15;
      let totalBullets = 0;
      let bulletsWithActionVerbs = 0;

      experiences.forEach(exp => {
        const bullets = exp.bullets || [];
        totalBullets += bullets.length;

        bullets.forEach(bullet => {
          const lower = bullet.toLowerCase();
          const hasVerb = this.actionVerbs.some(verb => lower.includes(verb));
          if (hasVerb) bulletsWithActionVerbs++;
        });
      });

      if (totalBullets >= 3) expPts += 5;
      if (bulletsWithActionVerbs >= 2) expPts += 5;

      score += expPts;

      checklist.push({
        status: bulletsWithActionVerbs >= 2 ? 'pass' : 'warn',
        text: `Experiencia Laboral registrada (${experiences.length} empleos, ${bulletsWithActionVerbs} viñetas con verbos de acción cuantificables).`
      });
    } else {
      checklist.push({ status: 'fail', text: 'No se ha registrado ninguna Experiencia Laboral.' });
    }

    // 4. Educación (Máx: 15 pts)
    const education = cv.education || [];
    if (education.length > 0 && education[0].degree && education[0].institution) {
      score += 15;
      checklist.push({ status: 'pass', text: `Grado o Titulación Académica especificada (${education[0].degree}).` });
    } else {
      checklist.push({ status: 'fail', text: 'Falta información de Educación o Titulación Principal.' });
    }

    // 5. Habilidades Técnicas (Hard Skills) (Máx: 15 pts)
    const skills = cv.skills || {};
    const techSkills = (skills.technical || "").split(',').filter(s => s.trim().length > 0);

    if (techSkills.length >= 5) {
      score += 15;
      checklist.push({ status: 'pass', text: `Habilidades Técnicas bien estructuradas (${techSkills.length} competencias identificadas).` });
    } else if (techSkills.length > 0) {
      score += 8;
      checklist.push({ status: 'warn', text: `Se han incluido solo ${techSkills.length} habilidades técnicas. Agrega al menos 5 para optimizar palabras clave ATS.` });
    } else {
      checklist.push({ status: 'fail', text: 'No se han especificado Habilidades Técnicas (Hard Skills).' });
    }

    // 6. Proyectos, Certificaciones & Idiomas (Máx: 10 pts)
    let extrasPts = 0;
    const certs = cv.certifications || [];
    const langs = cv.languages || [];
    const projs = cv.projects || [];

    if (certs.length > 0) extrasPts += 4;
    if (langs.length > 0) extrasPts += 3;
    if (projs.length > 0) extrasPts += 3;

    score += extrasPts;

    if (extrasPts >= 7) {
      checklist.push({ status: 'pass', text: 'Excelente presencia de secciones complementarias (Certificaciones, Idiomas o Proyectos).' });
    } else {
      checklist.push({ status: 'warn', text: 'Agrega Certificaciones o Idiomas para diferenciarte competitivamente.' });
    }

    // Determinar categoría del Score
    let statusText = "Poco Optimizado";
    let statusClass = "fail";

    if (score >= 85) {
      statusText = "Excelente Compatibilidad ATS";
      statusClass = "pass";
    } else if (score >= 65) {
      statusText = "Buena Compatibilidad";
      statusClass = "warn";
    }

    return {
      score: Math.min(score, 100),
      statusText,
      statusClass,
      checklist
    };
  }
};
