import type { Locale } from "@/i18n";

export type EvidenceContext =
	"home" | "granada" | "api-integrations" | "it-advisory" | "custom-software";

export interface EvidenceProfile {
	projectId: string;
	eyebrow: string;
	title: string;
	body: string;
	action: string;
}

const profiles: Record<Locale, Record<EvidenceContext, EvidenceProfile>> = {
	es: {
		home: {
			projectId: "getyourticket-ticketing-platform",
			eyebrow: "Evidencia de trabajo",
			title: "Recuperar primero, ampliar después",
			body: "GetYourTicket partía de Attendize, una base de ticketing sin mantenimiento que no estaba preparada para operar eventos reales. Mi trabajo consistió en recuperar el código existente, corregir bloqueos, contenerizar el despliegue con Docker y configurar una VPS con HTTPS. También adapté el registro para gestores de eventos e integré Stripe, manteniendo después la plataforma conforme se incorporaban nuevos eventos. La decisión importante fue conservar la funcionalidad útil y reparar el sistema antes de plantear una reescritura. El resultado que puede comprobarse en el caso publicado es una plataforma que continúa en producción y ha gestionado más de diez eventos, cada uno con más de mil asistentes. No se presenta como una promesa para otros proyectos: documenta el contexto, las restricciones, las decisiones y el alcance concreto de este trabajo.",
			action: "Ver el caso completo",
		},
		granada: {
			projectId: "getyourticket-ticketing-platform",
			eyebrow: "Prueba de ejecución",
			title: "Una plataforma web existente llevada de nuevo a producción",
			body: "Este caso no es una maqueta de diseño: es una plataforma web que debía volver a funcionar con usuarios, pagos y eventos reales. Partí de Attendize, corregí los errores que impedían operar, preparé Docker y la VPS, configuré HTTPS con Certbot e integré Stripe. El registro también se adaptó para que nuevos gestores pudieran incorporarse al sistema. Elegir recuperación frente a reescritura mantuvo la funcionalidad de ticketing y concentró el presupuesto en los bloqueos que impedían publicar. La plataforma sigue bajo mantenimiento y el proyecto documenta un resultado concreto: más de diez eventos gestionados, cada uno con más de mil asistentes. Sirve como evidencia del enfoque aplicado a una web existente —diagnóstico, alcance, despliegue y continuidad—, no como una garantía de que otro proyecto obtendrá las mismas cifras.",
			action: "Revisar contexto y resultado",
		},
		"api-integrations": {
			projectId: "realtime-websocket-gateway",
			eyebrow: "Evidencia técnica",
			title: "Contratos y eventos visibles antes de escalar",
			body: "La prueba de concepto de gateway en tiempo real debía coordinar conexiones WebSocket, usuarios agrupados por salas y eventos procedentes de servicios internos. Mi contribución se centró en separar la gestión de conexiones del intercambio de eventos, utilizar Redis pub/sub para difundir mensajes entre instancias y gRPC para los contratos internos. El entorno incluía Micrometer, Docker, Helm y Kubernetes, además de escenarios documentados para ejecutar y probar el servicio localmente. El resultado no se expresa como una mejora comercial inventada: la evidencia es técnica y acotada. La PoC permitió validar la gestión de sesiones y el intercambio de eventos entre instancias con una ejecución reproducible. Ese mismo criterio —contratos claros, fallos observables y pruebas antes de ampliar el volumen— es el que aplico al integrar APIs y herramientas de negocio.",
			action: "Ver decisiones del proyecto",
		},
		"it-advisory": {
			projectId: "microservices-modernization",
			eyebrow: "Criterio aplicado",
			title: "Modernizar sin perder el control de cada release",
			body: "En una plataforma enterprise, la modernización debía avanzar mientras el monolito legacy seguía sosteniendo comportamiento crítico y el producto continuaba cambiando. Como backend software engineer trabajé sobre límites de servicio, APIs seguras, cambios de base de datos con PostgreSQL y Liquibase, y pruebas de contrato con Pact. El objetivo no era imponer una arquitectura nueva de una sola vez, sino hacer visibles las incompatibilidades y reducir el riesgo de cada entrega mientras convivían ambos sistemas. El caso no atribuye una cifra que no se haya medido. Documenta decisiones verificables en el stack y en la forma de entrega: servicios Spring Boot, seguridad, contract testing, automatización de base de datos y despliegue sobre Kubernetes. Es el tipo de contexto que utilizo al revisar alcance, prioridades y riesgo técnico antes de recomendar una inversión mayor.",
			action: "Ver el caso de modernización",
		},
		"custom-software": {
			projectId: "cv-studio",
			eyebrow: "Producto entregado",
			title: "Separar datos, edición y documento final",
			body: "CV Studio nació como una herramienta profesional para editar currículums sin trabajar directamente sobre una plantilla rígida. Construí un editor con React y TypeScript donde los datos estructurados, la validación, la vista previa y la exportación PDF se mantienen sincronizados. La decisión de arquitectura fue separar el modelo de CV, la edición, las plantillas y la generación documental para que cada parte pudiera evolucionar sin mezclar responsabilidades. Zod y React Hook Form sostienen la validación; Puppeteer se utiliza en la salida PDF orientada a ATS. El resultado descrito es funcional, no una métrica comercial: el cliente recibió un flujo único para editar información, revisar el documento y exportarlo con un layout consistente. El caso permite revisar restricciones, tecnologías, decisiones y entregables antes de valorar un proyecto de software a medida similar.",
			action: "Ver el caso de CV Studio",
		},
	},
	en: {
		home: {
			projectId: "getyourticket-ticketing-platform",
			eyebrow: "Work evidence",
			title: "Recover first, extend second",
			body: "GetYourTicket started from Attendize, an unmaintained ticketing codebase that was not ready to operate live events. My work covered recovering the existing application, removing blockers, containerising deployment with Docker and configuring a VPS with HTTPS. I also adapted registration for event managers, integrated Stripe and continued maintaining the platform as new events were added. The important decision was to preserve useful functionality and repair the system before considering a rewrite. The published case records a concrete result: the platform remains in production and has handled more than ten events, each with over one thousand attendees. This is not presented as a promise for another project. It documents the context, constraints, decisions and exact scope of one piece of work so a prospective client can assess how I approach an existing product.",
			action: "View the complete case",
		},
		granada: {
			projectId: "getyourticket-ticketing-platform",
			eyebrow: "Delivery evidence",
			title: "An existing web platform returned to production",
			body: "This case is not a design mock-up. It is a web platform that needed to work again with real users, payments and events. I started from Attendize, corrected the failures that blocked operation, prepared Docker and the VPS, configured HTTPS with Certbot and integrated Stripe. Registration was also adapted so new event managers could join the system. Choosing recovery over a rewrite preserved the useful ticketing behaviour and focused the budget on the blockers that prevented launch. The platform remains under maintenance, and the case records a concrete outcome: more than ten events managed, each with over one thousand attendees. It demonstrates the approach applied to an existing website —diagnosis, scope, deployment and continuity— rather than guaranteeing that another project will produce the same figures.",
			action: "Review context and outcome",
		},
		"api-integrations": {
			projectId: "realtime-websocket-gateway",
			eyebrow: "Technical evidence",
			title: "Make contracts and events visible before scaling",
			body: "The real-time gateway proof of concept had to coordinate WebSocket connections, users grouped into rooms and events arriving from internal services. My contribution separated connection management from event exchange, used Redis pub/sub to broadcast messages across instances and gRPC for internal contracts. The environment also included Micrometer, Docker, Helm and Kubernetes, with documented scenarios for running and testing the service locally. The result is not described as an invented commercial improvement: the evidence is technical and bounded. The PoC validated session management and cross-instance event exchange in a reproducible setup. I apply the same discipline to business API integrations: explicit contracts, observable failures and a testable flow before adding volume or allowing an integration to become an invisible operational dependency.",
			action: "View the project decisions",
		},
		"it-advisory": {
			projectId: "microservices-modernization",
			eyebrow: "Judgement in practice",
			title: "Modernise without losing control of each release",
			body: "On an enterprise platform, modernisation had to progress while the legacy monolith still carried critical behaviour and the product continued to change. As a backend software engineer, I worked on service boundaries, secure APIs, PostgreSQL and Liquibase database delivery, and Pact contract tests. The aim was not to impose a new architecture in one step. It was to expose incompatibilities and reduce delivery risk while both systems coexisted. The case does not attach a number that was never measured. It records verifiable decisions in the stack and delivery approach: Spring Boot services, security, contract testing, automated database changes and Kubernetes deployment. This is the kind of evidence I use when reviewing scope, priorities and technical risk before recommending a larger technology investment.",
			action: "View the modernisation case",
		},
		"custom-software": {
			projectId: "cv-studio",
			eyebrow: "Delivered product",
			title: "Separate the data, editing flow and final document",
			body: "CV Studio began as a professional tool for editing CVs without working directly inside a rigid template. I built a React and TypeScript editor where structured data, validation, live preview and PDF export remain synchronised. The architectural decision was to separate the CV model, editing flow, templates and document generation so each part could evolve without mixing responsibilities. Zod and React Hook Form support validation, while Puppeteer produces the ATS-oriented PDF output. The stated result is functional rather than a marketing metric: the client received one flow for editing information, reviewing the document and exporting it with a consistent layout. The case exposes constraints, technologies, decisions and deliverables that a prospective client can inspect before considering a similar custom-software project.",
			action: "View the CV Studio case",
		},
	},
};

const serviceContexts: Record<string, EvidenceContext> = {
	"base:api-integrations": "api-integrations",
	"it-consulting:4": "api-integrations",
	"it-consulting:1": "it-advisory",
	"base:custom-web-application": "custom-software",
	"it-consulting:3": "custom-software",
};

export const getEvidenceProfile = (locale: Locale, context: EvidenceContext) =>
	profiles[locale][context];

export const getServiceEvidenceProfile = (
	locale: Locale,
	serviceKey: string,
) => {
	const context = serviceContexts[serviceKey];
	return context ? profiles[locale][context] : undefined;
};
