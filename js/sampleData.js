/* ==========================================================================
   ATS Resume Craft - Perfiles Profesionales de Demostración
   ========================================================================== */

const SAMPLE_PROFILES = {
  software_engineer: {
    id: "sample_se",
    title: "CV Senior Software Engineer",
    personal: {
      fullName: "Carlos Eduardo Mendoza",
      jobTitle: "Senior Full Stack Engineer & Cloud Architect",
      email: "carlos.mendoza.dev@email.com",
      phone: "+52 55 8765 4321",
      location: "Ciudad de México, México",
      linkedin: "linkedin.com/in/carlosmendoza-dev",
      website: "github.com/carlosmendoza-dev"
    },
    summary: "Ingeniero de Software Senior con más de 7 años de experiencia liderando el desarrollo de aplicaciones web de alto impacto y arquitectura de microservicios en la nube. Especializado en JavaScript/TypeScript (React, Node.js), Python y plataformas AWS. Trayectoria comprobada optimizando el rendimiento de bases de datos en un 45% y reduciendo tiempos de despliegue mediante automatización CI/CD en equipos multidisciplinarios.",
    experience: [
      {
        id: "exp_1",
        role: "Senior Full Stack Engineer",
        company: "TechNova Solutions",
        location: "Ciudad de México, México",
        startDate: "2022-03",
        endDate: "Presente",
        current: true,
        bullets: [
          "Diseñó y desplegó una arquitectura de microservicios en AWS (ECS, Lambda, DynamoDB) que procesa más de 2 millones de transacciones diarias con 99.99% de disponibilidad.",
          "Optimizó las consultas de base de datos PostgreSQL y la estrategia de caché Redis, reduciendo los tiempos de respuesta de la API de 450ms a 85ms.",
          "Lideró la migración del frontend legado a React 18 con TypeScript y Next.js, mejorando la puntuación Lighthouse de velocidad web del 62% al 98%.",
          "Mentoreó a 5 desarrolladores juniors e implementó pruebas automatizadas (Jest, Cypress) elevando la cobertura de código al 88%."
        ]
      },
      {
        id: "exp_2",
        role: "Full Stack Developer",
        company: "Innovatech Labs",
        location: "Guadalajara, México",
        startDate: "2019-06",
        endDate: "2022-02",
        current: false,
        bullets: [
          "Desarrolló e integró pasarelas de pago (Stripe, PayPal) para una plataforma e-commerce B2B que incrementó la conversión de ventas en un 28%.",
          "Implementó pipelines de CI/CD automatizados utilizando GitHub Actions y Docker, reduciendo el tiempo de despliegue de 40 minutos a solo 6 minutos.",
          "Colaboró estrechamente con el equipo de producto mediante metodologías Scrum para entregar 14 épicas dentro de los plazos establecidos."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Licenciatura en Ingeniería en Sistemas Computacionales",
        institution: "Instituto Tecnológico y de Estudios Superiores de Monterrey (ITESM)",
        location: "Monterrey, México",
        startDate: "2015-08",
        endDate: "2019-06",
        gpa: "Mención Honorífica"
      }
    ],
    skills: {
      technical: "JavaScript, TypeScript, React, Node.js, Express, Python, PostgreSQL, MongoDB, Redis, AWS (S3, ECS, Lambda), Docker, GraphQL, REST APIs",
      soft: "Liderazgo técnico, Arquitectura de software, Resolución de problemas complejos, Comunicación asertiva, Trabajo bajo metodología Agile/Scrum",
      tools: "Git, GitHub Actions, VS Code, JIRA, Postman, Figma, Datadog"
    },
    projects: [
      {
        id: "proj_1",
        name: "CloudMetrics - Dashboard de Monitoreo Serverless",
        link: "github.com/carlosmendoza/cloudmetrics",
        description: "Herramienta open-source para visualizar métricas en tiempo real de arquitecturas serverless en AWS mediante WebSockets y D3.js con más de 1,200 estrellas en GitHub."
      }
    ],
    certifications: [
      { id: "cert_1", title: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", date: "2023-05" },
      { id: "cert_2", title: "Meta Certified Front-End Developer", issuer: "Meta", date: "2022-01" }
    ],
    languages: [
      { id: "lang_1", name: "Español", level: "Nativo" },
      { id: "lang_2", name: "Inglés", level: "Avanzado C1 (C1 Professional Certificate)" }
    ]
  },

  marketing_specialist: {
    id: "sample_mk",
    title: "CV Growth & Digital Marketing Manager",
    personal: {
      fullName: "Mariana Alarcón Ríos",
      jobTitle: "Growth & Digital Marketing Manager",
      email: "mariana.alarcon.mkt@email.com",
      phone: "+52 55 4321 8765",
      location: "Bogotá, Colombia",
      linkedin: "linkedin.com/in/mariana-alarcon-growth",
      website: "mariana-growth.com"
    },
    summary: "Especialista en Growth Marketing y Estrategia Digital con más de 6 años de experiencia acelerando el crecimiento de startups SaaS y e-commerce B2B. Experta en optimización de embudos de conversión (CRO), campañas SEM/SEO, analítica avanzada de datos y automatización de marketing. Historial comprobado de escalar el ROI en publicidad en un 150% y multiplicar el tráfico orgánico por 3x.",
    experience: [
      {
        id: "exp_mk1",
        role: "Head of Growth Marketing",
        company: "Nexus SaaS Latin America",
        location: "Bogotá, Colombia",
        startDate: "2021-09",
        endDate: "Presente",
        current: true,
        bullets: [
          "Diseñó y ejecutó la estrategia de adquisición omnicanal alcanzando un incremento del 210% en Leads Calificados por Ventas (MQL) año contra año.",
          "Gestionó un presupuesto publicitario mensual de $45,000 USD en Google Ads, Meta Ads y LinkedIn Ads con un retorno de inversión publicitaria (ROAS) promedio de 4.2x.",
          "Lideró experimentos de A/B testing en landing pages que aumentaron la tasa de conversión global del sitio web del 2.1% al 4.8%.",
          "Supervisó la producción de contenido SEO enfocado en palabras clave transaccionales, posicionando 15 artículos en el Top 3 de Google."
        ]
      },
      {
        id: "exp_mk2",
        role: "Senior Digital Marketing Specialist",
        company: "E-Commerce Latam Group",
        location: "Bogotá, Colombia",
        startDate: "2018-04",
        endDate: "2021-08",
        current: false,
        bullets: [
          "Implementó flujos de automatización de email marketing (Klaviyo/HubSpot) que recuperaron el 18% de carritos abandonados y generaron $320,000 USD adicionales en ventas.",
          "Auditó y optimizó la estructura técnica del sitio web para SEO, incrementando el tráfico orgánico de 50k a 180k visitas mensuales."
        ]
      }
    ],
    education: [
      {
        id: "edu_mk1",
        degree: "Profesional en Mercadeo y Publicidad",
        institution: "Universidad de los Andes",
        location: "Bogotá, Colombia",
        startDate: "2013-08",
        endDate: "2017-12",
        gpa: "Graduada con Honores"
      }
    ],
    skills: {
      technical: "SEO Técnico, SEM (Google Ads), Paid Social (Meta/LinkedIn), CRO (A/B Testing), Email Marketing, Funnel Optimization, Google Analytics 4 (GA4), SQL básico",
      soft: "Pensamiento analítico, Creatividad estratégica, Liderazgo de equipos creativos, Gestión presupuestaria, Comunicación de datos (Data Storytelling)",
      tools: "HubSpot, GA4, Semrush, Ahrefs, Mixpanel, Hotjar, Google Tag Manager, Looker Studio"
    },
    projects: [
      {
        id: "proj_mk1",
        name: "Campaña de Lanzamiento 'SaaS Scale 2023'",
        link: "nexus-saas.com/scale",
        description: "Estrategia integral de inbound marketing y webinar que atrajo a más de 3,500 asistentes en vivo y generó $180k USD en contratos anuales (ARR)."
      }
    ],
    certifications: [
      { id: "cert_mk1", title: "Google Search & Display Ads Certified Professional", issuer: "Google Academy", date: "2023-02" },
      { id: "cert_mk2", title: "HubSpot Inbound Marketing & Revenue Operations Certification", issuer: "HubSpot", date: "2022-09" }
    ],
    languages: [
      { id: "lang_mk1", name: "Español", level: "Nativo" },
      { id: "lang_mk2", name: "Inglés", level: "Bilingüe C2 (TOEFL 112/120)" }
    ]
  },

  project_manager: {
    id: "sample_pm",
    title: "CV Senior Project Manager PMP",
    personal: {
      fullName: "Roberto Carlos Fuentes",
      jobTitle: "Senior IT Project Manager & Scrum Master (PMP®)",
      email: "roberto.fuentes.pm@email.com",
      phone: "+52 55 9988 7766",
      location: "Santiago, Chile",
      linkedin: "linkedin.com/in/roberto-fuentes-pmp",
      website: "robertofuentes-pm.com"
    },
    summary: "Gerente de Proyectos IT certificado PMP® y PMI-ACP® con más de 8 años de experiencia dirigiendo proyectos complejos de transformación digital, migración de infraestructura y desarrollo de software a gran escala. Experto en metodologías ágiles (Scrum, Kanban) y tradicionales (PMBOK). Historial de entregar proyectos críticos dentro del presupuesto y tiempo estimado en un 94% de las ocasiones.",
    experience: [
      {
        id: "exp_pm1",
        role: "Senior IT Project Manager",
        company: "Banco Financiero Internacional",
        location: "Santiago, Chile",
        startDate: "2021-01",
        endDate: "Presente",
        current: true,
        bullets: [
          "Dirigió un portafolio de 4 proyectos de banca digital con un presupuesto combinado de $3.2 millones de USD y un equipo multidisciplinario de 28 profesionales.",
          "Lideró la migración del core bancario a arquitectura en la nube de acuerdo a estrictas normativas financieras, finalizando 3 semanas antes del plazo límite.",
          "Facilitó la adopción de metodologías Scrum en 5 células de desarrollo, mejorando la velocidad de entregables (Velocity) en un 35%.",
          "Gestionó los riesgos y matrices de partes interesadas (Stakeholders) reportando avances semanales a la junta directiva y directores de división."
        ]
      },
      {
        id: "exp_pm2",
        role: "Project Manager & Scrum Master",
        company: "Global Tech Consulting",
        location: "Santiago, Chile",
        startDate: "2017-05",
        endDate: "2020-12",
        current: false,
        bullets: [
          "Coordinó el desarrollo e implementación de un sistema ERP personalizado para una cadena minorista con más de 50 sucursales a nivel nacional.",
          "Implementó tableros Kanban y métricas de flujo (Cycle Time, Lead Time) reduciendo el tiempo de resolución de bloqueos en un 40%."
        ]
      }
    ],
    education: [
      {
        id: "edu_pm1",
        degree: "Ingeniería Civil Industrial",
        institution: "Pontificia Universidad Católica de Chile",
        location: "Santiago, Chile",
        startDate: "2011-03",
        endDate: "2016-12",
        gpa: "Graduado con Excelencia"
      }
    ],
    skills: {
      technical: "Gestión de Portafolios (PPM), Gestión de Riesgos, Estimación Presupuestaria, Scrum, Kanban, PMBOK 7ma Edición, Análisis de Negocio, Matriz RACI",
      soft: "Liderazgo situacional, Negociación con clientes y proveedores, Gestión del cambio organizacional, Resolución de conflictos",
      tools: "JIRA, Confluence, MS Project, Asana, Monday.com, Power BI, Slack, Trello"
    },
    projects: [
      {
        id: "proj_pm1",
        name: "Proyecto Digital Branch Transformation",
        link: "bancofinanciero.cl/digital-branch",
        description: "Implementación de kioscos de autoservicio y app móvil en 40 sucursales bancarias reduciendo los tiempos de atención en ventanilla en un 50%."
      }
    ],
    certifications: [
      { id: "cert_pm1", title: "PMP® - Project Management Professional", issuer: "Project Management Institute (PMI)", date: "2020-08" },
      { id: "cert_pm2", title: "PMI-ACP® - PMI Agile Certified Practitioner", issuer: "PMI", date: "2021-11" },
      { id: "cert_pm3", title: "Certified ScrumMaster® (CSM)", issuer: "Scrum Alliance", date: "2019-04" }
    ],
    languages: [
      { id: "lang_pm1", name: "Español", level: "Nativo" },
      { id: "lang_pm2", name: "Inglés", level: "Avanzado Profesional C1" }
    ]
  }
};
