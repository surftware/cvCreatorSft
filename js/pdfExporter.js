/* ==========================================================================
   ATS Resume Craft - Generador & Exportador de PDF Vectorial ATS
   ========================================================================== */

const PDFExporter = {
  exportToPDF(cvTitle = "Curriculum_ATS") {
    const originalTitle = document.title;
    const cleanFileName = (cvTitle || "Curriculum_ATS").replace(/[^a-zA-Z0-9_-]/g, "_");
    
    // Cambiamos el título del documento temporalmente para que al guardar PDF sugiera este nombre de archivo
    document.title = cleanFileName;

    // Disparamos el diálogo nativo de impresión del navegador
    // El archivo css styles/ats-templates.css aplicará las reglas @media print
    window.print();

    // Restauramos el título original de la app
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }
};
