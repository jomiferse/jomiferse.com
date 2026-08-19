import type { Locale } from "@/i18n";

const englishVowelSoundExceptions = /^(hour|honest|honour|heir)/i;
const englishConsonantSoundExceptions = /^(uni(?:t|v)|user|euro|one)/i;

export const getEnglishIndefiniteArticle = (value: string) => {
	const normalized = value.trim();
	if (englishVowelSoundExceptions.test(normalized)) return "an";
	if (englishConsonantSoundExceptions.test(normalized)) return "a";
	return /^[aeiou]/i.test(normalized) ? "an" : "a";
};

export interface ServicePresentationProfile {
	placement: "before-pricing" | "after-scope" | "before-proof";
	eyebrow: string;
	title: string;
	intro: string;
	failureTitle: string;
	failureModes: string[];
	acceptanceTitle: string;
	acceptanceCriteria: string[];
	titles: {
		outcome: string;
		pricing: string;
		scope: string;
		process: string;
		proof: string;
		faq: string;
	};
}

const profiles: Record<Locale, Record<string, ServicePresentationProfile>> = {
	es: {
		"it-consulting:1": {
			placement: "before-pricing",
			eyebrow: "Decisiones antes de invertir",
			title: "Qué debe quedar claro antes de elegir tecnología o proveedor",
			intro:
				"Una asesoría útil termina con decisiones y límites, no con una lista de herramientas posibles.",
			failureTitle: "Señales de una mala decisión",
			failureModes: [
				"Empezar por la tecnología sin describir el problema y los usuarios.",
				"Aceptar un presupuesto que no separa alcance, riesgos y dependencias.",
				"Confundir una demostración rápida con una solución operable.",
			],
			acceptanceTitle: "Qué debe quedar al cerrar",
			acceptanceCriteria: [
				"Problema, prioridad y restricciones documentados.",
				"Opciones comparadas con coste, riesgo y mantenimiento.",
				"Siguiente paso acotado y criterio para validarlo.",
			],
			titles: {
				outcome: "Qué decisión debe desbloquear una asesoría informática",
				pricing: "Qué cambia el alcance de una revisión técnica",
				scope: "Qué información y entregables forman parte de la asesoría",
				process: "Cómo convierto incertidumbre en una decisión comprobable",
				proof: "Criterio técnico aplicado en sistemas reales",
				faq: "Preguntas antes de pedir una segunda opinión técnica",
			},
		},
		"it-consulting:4": {
			placement: "after-scope",
			eyebrow: "Riesgos de integración",
			title:
				"Dónde fallan las integraciones cuando el caso real se sale del recorrido feliz",
			intro:
				"La conexión no termina cuando una petición devuelve 200. Hay que decidir propiedad del dato, reintentos y tratamiento de excepciones.",
			failureTitle: "Fallos que deben diseñarse",
			failureModes: [
				"Eventos repetidos o recibidos fuera de orden.",
				"Credenciales caducadas y límites del proveedor.",
				"Registros parciales que nadie puede reconciliar.",
			],
			acceptanceTitle: "Criterios de aceptación",
			acceptanceCriteria: [
				"Contrato y sistema propietario definidos para cada dato.",
				"Errores, reintentos e idempotencia probados.",
				"Trazabilidad suficiente para reparar un fallo sin adivinar.",
			],
			titles: {
				outcome: "Qué trabajo manual debe eliminar una integración API",
				pricing: "Qué encarece conectar sistemas de negocio",
				scope: "Qué contratos, datos y errores cubre la integración",
				process: "Cómo valido la integración antes de darle autonomía",
				proof: "Integraciones y contratos aplicados en backend",
				faq: "Preguntas antes de conectar dos sistemas",
			},
		},
		"it-consulting:5": {
			placement: "before-pricing",
			eyebrow: "Automatizar con límites",
			title: "Qué debe seguir bajo control humano",
			intro:
				"Una automatización útil reduce repetición y mantiene visibles las excepciones, responsables y decisiones sensibles.",
			failureTitle: "Cuándo el flujo se vuelve frágil",
			failureModes: [
				"El proceso cambia cada semana o nadie es dueño del dato.",
				"Un error financiero o contractual puede ejecutarse sin revisión.",
				"Las excepciones quedan ocultas en otra herramienta.",
			],
			acceptanceTitle: "Qué debe demostrar el primer flujo",
			acceptanceCriteria: [
				"Entrada, salida y responsable definidos.",
				"Errores visibles y recorrido manual de respaldo.",
				"Comparación con una línea base de tiempo o errores.",
			],
			titles: {
				outcome: "Qué tarea repetida merece automatizarse primero",
				pricing: "Qué determina el coste de una automatización operable",
				scope: "Qué incluye un primer flujo y qué debe quedarse fuera",
				process: "Cómo paso de proceso manual a automatización controlada",
				proof: "Sistemas e integraciones detrás de la automatización",
				faq: "Preguntas antes de automatizar un proceso",
			},
		},
		"ai-automation:3": {
			placement: "after-scope",
			eyebrow: "Autonomía con control",
			title:
				"Dónde un agente necesita permisos, trazabilidad y revisión humana",
			intro:
				"Un agente no debería recibir más autonomía de la que el equipo puede observar, limitar y corregir.",
			failureTitle: "Riesgos que hay que contener",
			failureModes: [
				"Acciones irreversibles con datos incompletos.",
				"Herramientas con permisos más amplios de lo necesario.",
				"Resultados que no conservan fuentes, pasos ni responsable.",
			],
			acceptanceTitle: "Condiciones para ampliar autonomía",
			acceptanceCriteria: [
				"Conjunto de evaluación y límites explícitos.",
				"Confirmación humana en acciones sensibles.",
				"Registro de cada herramienta, entrada y resultado.",
			],
			titles: {
				outcome: "Qué decisión o tarea puede asumir un agente de IA",
				pricing: "Qué aumenta el coste de un agente conectado a herramientas",
				scope: "Qué permisos, datos y acciones entran en la primera versión",
				process: "Cómo evalúo un agente antes de darle más autonomía",
				proof: "Experiencia aplicable a flujos conectados y observables",
				faq: "Preguntas antes de desplegar un agente de IA",
			},
		},
		"base:internal-tools": {
			placement: "before-proof",
			eyebrow: "Primera versión útil",
			title: "Qué debe resolver una herramienta interna antes de crecer",
			intro:
				"La primera entrega debe hacer visible un flujo concreto y reducir dependencia de hojas, mensajes y memoria humana.",
			failureTitle: "Señales de alcance inflado",
			failureModes: [
				"Intentar sustituir CRM, ERP y reporting en una sola fase.",
				"Diseñar pantallas sin acordar estados y responsables.",
				"Importar datos inconsistentes sin una regla de limpieza.",
			],
			acceptanceTitle: "Qué debe poder comprobar el equipo",
			acceptanceCriteria: [
				"Un flujo principal completo con permisos proporcionados.",
				"Estado, responsable e historial visibles.",
				"Exportación y recuperación ante errores definidas.",
			],
			titles: {
				outcome: "Qué cambia cuando el flujo deja de vivir en hojas y mensajes",
				pricing: "Qué determina el coste de una herramienta interna",
				scope: "Qué necesita la primera versión para ser operable",
				process: "Cómo convierto el flujo actual en software mantenible",
				proof: "Herramientas internas construidas alrededor del trabajo real",
				faq: "Preguntas antes de sustituir hojas por una herramienta interna",
			},
		},
	},
	en: {},
};

profiles.en = {
	"it-consulting:1": {
		...profiles.es["it-consulting:1"],
		eyebrow: "Decisions before investment",
		title: "What must be clear before choosing technology or a supplier",
		intro:
			"Useful advisory work ends with decisions and boundaries, not a list of possible tools.",
		failureTitle: "Signs of a poor decision",
		failureModes: [
			"Starting with technology before defining the problem and users.",
			"Accepting an estimate that does not separate scope, risk and dependencies.",
			"Treating a quick demonstration as an operable solution.",
		],
		acceptanceTitle: "What should be clear at the end",
		acceptanceCriteria: [
			"Documented problem, priority and constraints.",
			"Options compared by cost, risk and maintenance.",
			"A bounded next step with a validation rule.",
		],
		titles: {
			outcome: "Which decision should IT advisory unblock?",
			pricing: "What changes the scope of a technical review?",
			scope: "Which inputs and deliverables belong in the advisory work?",
			process: "How I turn uncertainty into a testable decision",
			proof: "Technical judgement applied to real systems",
			faq: "Questions before requesting a technical second opinion",
		},
	},
	"it-consulting:4": {
		...profiles.es["it-consulting:4"],
		eyebrow: "Integration risks",
		title: "Where integrations fail beyond the happy path",
		intro:
			"A connection is not complete when one request returns 200. Data ownership, retries and exceptions still need explicit rules.",
		failureTitle: "Failures the design must cover",
		failureModes: [
			"Events repeated or received out of order.",
			"Expired credentials and supplier rate limits.",
			"Partial records nobody can reconcile.",
		],
		acceptanceTitle: "Acceptance criteria",
		acceptanceCriteria: [
			"A contract and owner for each data field.",
			"Tested errors, retries and idempotency.",
			"Enough traceability to repair a failure without guessing.",
		],
		titles: {
			outcome: "Which manual work should an API integration remove?",
			pricing: "What makes a business-system integration more expensive?",
			scope: "Which contracts, data and failures are included?",
			process: "How I validate an integration before giving it autonomy",
			proof: "Backend integrations and contracts in practice",
			faq: "Questions before connecting two systems",
		},
	},
	"it-consulting:5": {
		...profiles.es["it-consulting:5"],
		eyebrow: "Automation with boundaries",
		title: "What should remain under human control",
		intro:
			"Useful automation removes repetition while keeping exceptions, owners and sensitive decisions visible.",
		failureTitle: "When the workflow becomes fragile",
		failureModes: [
			"The process changes weekly or no one owns the data.",
			"A financial or contractual mistake can run without review.",
			"Exceptions disappear into another tool.",
		],
		acceptanceTitle: "What the first workflow must prove",
		acceptanceCriteria: [
			"Defined input, output and owner.",
			"Visible failures and a manual fallback.",
			"Comparison with a baseline for time or errors.",
		],
		titles: {
			outcome: "Which repeated task should be automated first?",
			pricing: "What determines the cost of operable automation?",
			scope: "What belongs in the first workflow, and what does not?",
			process: "How I move from manual work to controlled automation",
			proof: "The systems and integrations behind automation",
			faq: "Questions before automating a process",
		},
	},
	"ai-automation:3": {
		...profiles.es["ai-automation:3"],
		eyebrow: "Autonomy with control",
		title: "Where an agent needs permissions, traceability and human review",
		intro:
			"An agent should not receive more autonomy than the team can observe, limit and correct.",
		failureTitle: "Risks that need containment",
		failureModes: [
			"Irreversible actions based on incomplete data.",
			"Tools with broader permissions than the task requires.",
			"Outputs that retain no sources, steps or owner.",
		],
		acceptanceTitle: "Conditions for expanding autonomy",
		acceptanceCriteria: [
			"An evaluation set and explicit boundaries.",
			"Human confirmation for sensitive actions.",
			"A record of every tool, input and result.",
		],
		titles: {
			outcome: "Which task or decision can an AI agent handle?",
			pricing: "What increases the cost of an agent connected to tools?",
			scope: "Which permissions, data and actions enter the first release?",
			process: "How I evaluate an agent before expanding its autonomy",
			proof: "Experience relevant to connected, observable workflows",
			faq: "Questions before deploying an AI agent",
		},
	},
	"base:internal-tools": {
		...profiles.es["base:internal-tools"],
		eyebrow: "A useful first release",
		title: "What an internal tool must solve before it grows",
		intro:
			"The first delivery should make one workflow visible and reduce dependence on spreadsheets, messages and memory.",
		failureTitle: "Signs of inflated scope",
		failureModes: [
			"Trying to replace CRM, ERP and reporting in one phase.",
			"Designing screens before agreeing statuses and owners.",
			"Importing inconsistent data without a cleaning rule.",
		],
		acceptanceTitle: "What the team should be able to verify",
		acceptanceCriteria: [
			"One complete primary flow with proportionate permissions.",
			"Visible status, owner and history.",
			"Defined export and failure-recovery paths.",
		],
		titles: {
			outcome: "What changes when work leaves spreadsheets and messages?",
			pricing: "What determines the cost of an internal tool?",
			scope: "What does the first release need to be operable?",
			process: "How I turn the current workflow into maintainable software",
			proof: "Internal tools built around real work",
			faq: "Questions before replacing spreadsheets with an internal tool",
		},
	},
};

export const getServicePresentation = (locale: Locale, serviceKey: string) =>
	profiles[locale][serviceKey];

export const getServiceSectionTitles = (
	locale: Locale,
	serviceKey: string,
	serviceTitle: string,
) => {
	const presentation = getServicePresentation(locale, serviceKey);
	if (presentation) return presentation.titles;

	return locale === "es"
		? {
				outcome: `Qué cambia con ${serviceTitle}`,
				pricing: `Qué determina el precio de ${serviceTitle}`,
				scope: `Qué incluye un proyecto de ${serviceTitle}`,
				process: `Cómo trabajo en ${serviceTitle}`,
				proof: `Experiencia aplicable a ${serviceTitle}`,
				faq: `Preguntas antes de contratar ${serviceTitle}`,
			}
		: {
				outcome: `What changes with ${serviceTitle}`,
				pricing: `What determines the price of ${serviceTitle}`,
				scope: `What ${getEnglishIndefiniteArticle(serviceTitle)} ${serviceTitle} project includes`,
				process: `How I deliver ${serviceTitle}`,
				proof: `Experience relevant to ${serviceTitle}`,
				faq: `Questions before hiring ${serviceTitle}`,
			};
};
