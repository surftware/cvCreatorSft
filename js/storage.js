/* ==========================================================================
   ATS Resume Craft - Gestor de Almacenamiento Local (LocalStorage & JSON)
   ========================================================================== */

const STORAGE_KEYS = {
  CV_LIST: 'ats_cv_list_v1',
  ACTIVE_ID: 'ats_active_cv_id_v1',
  THEME: 'ats_theme_v1'
};

const StorageManager = {
  // Obtener lista completa de CVs guardados
  getAllCVs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CV_LIST);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error al leer LocalStorage:", e);
      return [];
    }
  },

  // Guardar lista completa
  saveAllCVs(cvList) {
    try {
      localStorage.setItem(STORAGE_KEYS.CV_LIST, JSON.stringify(cvList));
    } catch (e) {
      console.error("Error al guardar en LocalStorage:", e);
    }
  },

  // Obtener ID del CV activo
  getActiveCVID() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
  },

  // Establecer ID del CV activo
  setActiveCVID(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id);
  },

  // Obtener objeto del CV activo actual
  getCurrentCV() {
    const list = this.getAllCVs();
    let activeId = this.getActiveCVID();

    if (list.length === 0) {
      // Si no hay ningún CV, inicializamos con el perfil de Software Engineer de muestra
      const initialCV = JSON.parse(JSON.stringify(SAMPLE_PROFILES.software_engineer));
      initialCV.id = "cv_" + Date.now();
      initialCV.title = "Mi Primer CV ATS";
      this.saveAllCVs([initialCV]);
      this.setActiveCVID(initialCV.id);
      return initialCV;
    }

    let activeCV = list.find(item => item.id === activeId);
    if (!activeCV) {
      activeCV = list[0];
      this.setActiveCVID(activeCV.id);
    }

    return activeCV;
  },

  // Guardar/Actualizar cambios del CV actual
  saveCurrentCV(updatedData) {
    const list = this.getAllCVs();
    const activeId = this.getActiveCVID();

    const index = list.findIndex(item => item.id === activeId);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedData, id: activeId };
      this.saveAllCVs(list);
    }
  },

  // Crear un nuevo CV en blanco o con título
  createNewCV(title = "Nuevo Currículum ATS") {
    const list = this.getAllCVs();
    const newId = "cv_" + Date.now();
    
    const newCV = {
      id: newId,
      title: title,
      personal: {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: ""
      },
      summary: "",
      experience: [],
      education: [],
      skills: { technical: "", soft: "", tools: "" },
      projects: [],
      certifications: [],
      languages: []
    };

    list.push(newCV);
    this.saveAllCVs(list);
    this.setActiveCVID(newId);
    return newCV;
  },

  // Eliminar un CV
  deleteCV(id) {
    let list = this.getAllCVs();
    if (list.length <= 1) {
      alert("Debes conservar al menos un currículum en la aplicación.");
      return null;
    }

    list = list.filter(item => item.id !== id);
    this.saveAllCVs(list);

    // Si borramos el activo, activamos el primero disponible
    if (this.getActiveCVID() === id) {
      this.setActiveCVID(list[0].id);
    }

    return list[0];
  },

  // Exportar el CV activo como archivo JSON de respaldo
  exportCVToJSON(cvData) {
    const filename = `${(cvData.title || "curriculum_ats").toLowerCase().replace(/[^a-z0-9]/g, "_")}.json`;
    const jsonStr = JSON.stringify(cvData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Importar desde archivo JSON
  importCVFromJSON(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.personal || !parsed.title) {
        throw new Error("El archivo JSON no tiene una estructura de CV válida.");
      }

      parsed.id = "cv_imported_" + Date.now();
      parsed.title = parsed.title + " (Importado)";

      const list = this.getAllCVs();
      list.push(parsed);
      this.saveAllCVs(list);
      this.setActiveCVID(parsed.id);

      return parsed;
    } catch (err) {
      alert("Error al importar el archivo JSON: " + err.message);
      return null;
    }
  }
};
