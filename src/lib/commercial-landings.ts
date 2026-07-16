import type { Locale } from "@/i18n";

export interface CommercialLandingPage {
	slug: string;
	translationKey: string;
	metaTitle: string;
	metaDescription: string;
	keywords: string[];
	eyebrow: string;
	title: string;
	intro: string;
	primaryCta: string;
	secondaryCta: string;
	problem: {
		eyebrow: string;
		title: string;
		body: string[];
	};
	whenWorthIt: {
		title: string;
		items: string[];
	};
	cases: {
		title: string;
		intro: string;
		items: Array<{
			title: string;
			body: string;
		}>;
	};
	builds: {
		title: string;
		items: string[];
	};
	process: {
		title: string;
		steps: string[];
	};
	avoid: {
		title: string;
		items: string[];
	};
	relatedServicesTitle: string;
	relatedPostsTitle: string;
	relatedServiceKeys: string[];
	relatedPosts: Array<{
		title: string;
		description: string;
		href: string;
	}>;
	faq: Array<{
		question: string;
		answer: string;
	}>;
	cta: {
		eyebrow: string;
		title: string;
		text: string;
		button: string;
	};
	schema: {
		serviceType: string;
		areaServed: string;
		audience: string[];
	};
}

interface FocusedLandingSeed {
	slug: string;
	translationKey: string;
	metaTitle: string;
	metaDescription: string;
	keywords: string[];
	eyebrow: string;
	title: string;
	intro: string;
	problemTitle: string;
	problemBody: string[];
	when: string[];
	cases: Array<[title: string, body: string]>;
	builds: string[];
	process: string[];
	avoid: string[];
	relatedServiceKeys: string[];
	relatedPosts: CommercialLandingPage["relatedPosts"];
	faq: CommercialLandingPage["faq"];
	ctaTitle: string;
	ctaText: string;
	ctaButton: string;
	serviceType: string;
	audience: string[];
}

const createFocusedLanding = (
	locale: Locale,
	seed: FocusedLandingSeed,
): CommercialLandingPage => {
	const es = locale === "es";

	return {
		...seed,
		primaryCta: es ? "Revisar mi caso" : "Review my case",
		secondaryCta: es ? "Ver servicios relacionados" : "View related services",
		problem: {
			eyebrow: es ? "Problema que resuelve" : "Problem it solves",
			title: seed.problemTitle,
			body: seed.problemBody,
		},
		whenWorthIt: {
			title: es ? "Cuándo merece la pena" : "When it is worth it",
			items: seed.when,
		},
		cases: {
			title: es ? "Casos habituales" : "Common use cases",
			intro: es
				? "El alcance debe partir de un problema observable y una forma clara de comprobar la mejora."
				: "Scope should start with an observable problem and a clear way to verify the improvement.",
			items: seed.cases.map(([title, body]) => ({ title, body })),
		},
		builds: {
			title: es ? "Qué puede incluir" : "What it can include",
			items: seed.builds,
		},
		process: {
			title: es ? "Cómo trabajo" : "How I work",
			steps: seed.process,
		},
		avoid: {
			title: es ? "Qué conviene evitar" : "What to avoid",
			items: seed.avoid,
		},
		relatedServicesTitle: es ? "Servicios relacionados" : "Related services",
		relatedPostsTitle: es ? "Lecturas relacionadas" : "Related reading",
		cta: {
			eyebrow: es ? "Siguiente paso" : "Next step",
			title: seed.ctaTitle,
			text: seed.ctaText,
			button: seed.ctaButton,
		},
		schema: {
			serviceType: seed.serviceType,
			areaServed: es ? "España y remoto" : "Spain and remote",
			audience: seed.audience,
		},
	};
};

const focusedCommercialLandingPages: Record<Locale, CommercialLandingPage[]> = {
	es: [
		createFocusedLanding("es", {
			slug: "mantenimiento-spring-boot",
			translationKey: "spring-boot-maintenance",
			metaTitle:
				"Mantenimiento Spring Boot para empresas | José Miguel Fernández",
			metaDescription:
				"Mantenimiento y evolución de aplicaciones Java Spring Boot: incidencias, APIs, rendimiento, seguridad, deuda técnica y entregas controladas.",
			keywords: [
				"mantenimiento Spring Boot",
				"soporte Java Spring Boot",
				"evolución backend Java",
			],
			eyebrow: "Continuidad técnica para backend Java",
			title: "Mantenimiento y evolución de aplicaciones Spring Boot",
			intro:
				"Ayudo a mantener y evolucionar backends Java/Spring Boot que ya sostienen producto u operaciones, con cambios acotados, diagnóstico antes de tocar código y una forma visible de gestionar el riesgo.",
			problemTitle:
				"Evitar que cada cambio en el backend se convierta en una apuesta",
			problemBody: [
				"Una aplicación en producción acumula incidencias, dependencias, decisiones antiguas y tareas que no caben en un proyecto nuevo.",
				"El mantenimiento útil combina correcciones, observabilidad, pruebas y mejoras pequeñas que reducen el coste del siguiente cambio.",
			],
			when: [
				"Hay incidencias repetidas o cambios que dan miedo desplegar.",
				"El equipo necesita apoyo puntual para APIs, base de datos o integraciones.",
				"Las dependencias o la versión de Spring Boot se han quedado atrás.",
				"Faltan logs, métricas o pruebas en recorridos críticos.",
			],
			cases: [
				[
					"Incidencias y estabilidad",
					"Diagnóstico de errores, timeouts, consumo de recursos y fallos de integración.",
				],
				[
					"Evolución de APIs",
					"Nuevos endpoints, validaciones y cambios de contrato con compatibilidad controlada.",
				],
				[
					"Actualizaciones",
					"Plan de dependencias, Spring Boot, Java y librerías con validación por fases.",
				],
				[
					"Deuda técnica",
					"Mejoras concretas donde el código frena cambios o aumenta riesgo operativo.",
				],
			],
			builds: [
				"Diagnóstico y priorización de incidencias.",
				"Correcciones, pruebas y mejoras de observabilidad.",
				"Evolución de APIs e integraciones existentes.",
				"Actualizaciones técnicas con rollback y alcance claro.",
			],
			process: [
				"Reviso contexto, repositorio, despliegue y problemas observados.",
				"Separo urgencias, riesgo y mejoras que pueden esperar.",
				"Trabajo en cambios pequeños con una verificación explícita.",
				"Documento decisiones, límites y siguientes pasos.",
			],
			avoid: [
				"Mezclar una incidencia urgente con una reescritura completa.",
				"Actualizar dependencias sin entender compatibilidad y despliegue.",
				"Corregir síntomas sin mejorar logs o pruebas cuando hacen falta.",
			],
			relatedServiceKeys: [
				"base:backend-spring-boot",
				"it-consulting:2",
				"it-consulting:1",
			],
			relatedPosts: [
				{
					title: "Spring Boot en producción",
					description:
						"Configuración, observabilidad y despliegue para operar con más contexto.",
					href: "/es/blog/spring-boot-produccion-checklist-devops/",
				},
				{
					title: "Rendimiento en Spring Boot",
					description: "Cambios que conviene medir antes de optimizar.",
					href: "/es/blog/rendimiento-spring-boot-cambios-que-de-verdad-se-notan/",
				},
			],
			faq: [
				{
					question: "¿Puede ser un apoyo puntual?",
					answer:
						"Sí. Puede empezar con una incidencia, una revisión o un bloque de evolución bien delimitado.",
				},
				{
					question: "¿Trabajas sobre código existente?",
					answer:
						"Sí, siempre que pueda revisar el estado del repositorio, el entorno y el alcance antes de comprometer cambios.",
				},
				{
					question: "¿Cómo se entrega el trabajo?",
					answer:
						"Con cambios revisables, pruebas proporcionadas al riesgo y documentación de decisiones y despliegue.",
				},
			],
			ctaTitle: "Cuéntame qué está frenando el backend",
			ctaText:
				"Con el síntoma, la versión de Java/Spring Boot y el contexto de despliegue puedo proponer un primer diagnóstico razonable.",
			ctaButton: "Consultar mantenimiento",
			serviceType: "Mantenimiento de aplicaciones Java Spring Boot",
			audience: [
				"Empresas",
				"Equipos de producto",
				"Equipos técnicos",
				"Startups",
			],
		}),
		createFocusedLanding("es", {
			slug: "modernizacion-backend-legacy",
			translationKey: "legacy-backend-modernization",
			metaTitle:
				"Modernización de backend legacy por fases | José Miguel Fernández",
			metaDescription:
				"Modernización de backends legacy sin reescrituras a ciegas: diagnóstico, límites, migración incremental, pruebas y convivencia por fases.",
			keywords: [
				"modernización backend legacy",
				"migración backend",
				"migrar a Spring Boot",
			],
			eyebrow: "Cambiar sin detener el negocio",
			title: "Modernización de backend legacy por fases",
			intro:
				"Ayudo a decidir qué mantener, qué aislar y qué migrar cuando un backend antiguo frena cambios, complica despliegues o concentra demasiado riesgo.",
			problemTitle: "Reducir riesgo antes de decidir una reescritura",
			problemBody: [
				"Un sistema antiguo puede contener deuda, pero también años de reglas reales que no están documentadas.",
				"La modernización empieza por entender dependencias, recorridos críticos y una frontera pequeña que pueda evolucionar sin romper la operación.",
			],
			when: [
				"Los cambios pequeños tardan demasiado o rompen zonas inesperadas.",
				"La tecnología limita contratación, seguridad o despliegue.",
				"No hay pruebas suficientes para una migración segura.",
				"Se plantea reescribir, pero faltan datos sobre coste y riesgo.",
			],
			cases: [
				[
					"Mapa de riesgos",
					"Dependencias, módulos críticos, integraciones y puntos sin observabilidad.",
				],
				[
					"Extracción por fronteras",
					"Separar una capacidad concreta antes de mover el resto.",
				],
				[
					"Compatibilidad",
					"Contratos, datos y despliegues que permiten convivencia temporal.",
				],
				[
					"Plan de migración",
					"Fases, criterios de salida, rollback y trabajo que no conviene hacer.",
				],
			],
			builds: [
				"Diagnóstico técnico y mapa de dependencias.",
				"Pruebas de caracterización para recorridos críticos.",
				"Plan incremental con hitos y criterios de parada.",
				"Primer corte de modernización o migración a Spring Boot.",
			],
			process: [
				"Recojo objetivos, fallos y límites operativos.",
				"Identifico reglas críticas y dependencias reales.",
				"Comparo mantener, encapsular, migrar o sustituir.",
				"Propongo una primera fase verificable y reversible.",
			],
			avoid: [
				"Reescribir sin capturar comportamiento actual.",
				"Mover todo a microservicios por defecto.",
				"Cambiar tecnología y modelo de datos a la vez sin necesidad.",
				"Ocultar incertidumbre detrás de una estimación cerrada.",
			],
			relatedServiceKeys: [
				"base:backend-spring-boot",
				"it-consulting:2",
				"it-consulting:1",
			],
			relatedPosts: [
				{
					title: "Cuándo migrar un backend legacy a Spring Boot",
					description: "Señales, riesgos y estrategia incremental.",
					href: "/es/blog/cuando-deberia-una-empresa-migrar-un-backend-legacy-a-java-spring-boot/",
				},
				{
					title: "Monolito modular vs microservicios",
					description:
						"Cómo elegir una frontera razonable sin añadir distribución antes de tiempo.",
					href: "/es/blog/monolito-modular-vs-microservicios/",
				},
			],
			faq: [
				{
					question: "¿Hay que reescribir todo?",
					answer:
						"Normalmente no. Conviene localizar el mayor coste o riesgo y empezar por una frontera que pueda validarse.",
				},
				{
					question: "¿Se puede migrar mientras el sistema sigue funcionando?",
					answer:
						"Sí, si se diseñan contratos, datos, despliegue y rollback para una convivencia temporal.",
				},
				{
					question: "¿El destino tiene que ser Spring Boot?",
					answer:
						"No. Spring Boot encaja en muchos equipos Java, pero la decisión depende del sistema, capacidades y mantenimiento esperado.",
				},
			],
			ctaTitle: "Revisemos el backend antes de elegir una reescritura",
			ctaText:
				"Una revisión acotada puede convertir una decisión abierta en un primer paso con riesgo y salida conocidos.",
			ctaButton: "Consultar modernización",
			serviceType: "Modernización de backend legacy",
			audience: [
				"Empresas",
				"Equipos técnicos",
				"Responsables de producto",
				"CTOs",
			],
		}),
		createFocusedLanding("es", {
			slug: "auditoria-backend-api-arquitectura",
			translationKey: "backend-api-architecture-audit",
			metaTitle:
				"Auditoría de backend, API y arquitectura | José Miguel Fernández",
			metaDescription:
				"Auditoría técnica de backend, APIs y arquitectura para priorizar riesgos, rendimiento, seguridad, mantenibilidad y próximos pasos.",
			keywords: [
				"auditoría backend",
				"auditoría API",
				"revisión arquitectura software",
			],
			eyebrow: "Una revisión antes de invertir más",
			title: "Auditoría técnica de backend, API y arquitectura",
			intro:
				"Reviso un sistema existente para separar problemas demostrables de preferencias técnicas y convertirlos en un orden de trabajo útil.",
			problemTitle: "Saber qué corregir, qué medir y qué dejar quieto",
			problemBody: [
				"Una auditoría útil no es una lista automática de reglas ni una excusa para reescribir.",
				"Debe conectar evidencia técnica con impacto operativo, coste del cambio y una prioridad defendible.",
			],
			when: [
				"El sistema falla o rinde peor, pero no está clara la causa.",
				"Hay una propuesta de reescritura o migración que necesita contraste.",
				"Las APIs son difíciles de cambiar o integrar.",
				"Se necesita un plan técnico antes de presupuesto o contratación.",
			],
			cases: [
				[
					"Backend",
					"Errores, límites, persistencia, concurrencia, observabilidad y pruebas.",
				],
				["APIs", "Contratos, validación, idempotencia, seguridad y evolución."],
				[
					"Arquitectura",
					"Acoplamiento, fronteras, dependencias y complejidad operativa.",
				],
				[
					"Entrega",
					"Build, despliegue, configuración, rollback y diagnóstico en producción.",
				],
			],
			builds: [
				"Mapa de hallazgos con evidencia.",
				"Prioridad por impacto, esfuerzo y riesgo.",
				"Acciones inmediatas y decisiones que requieren más datos.",
				"Plan por fases listo para presupuestar o ejecutar.",
			],
			process: [
				"Acordamos preguntas y alcance de la revisión.",
				"Leo código, configuración y documentación relevante.",
				"Verifico los hallazgos y descarto preferencias sin impacto.",
				"Entrego conclusiones priorizadas y las explico con contexto.",
			],
			avoid: [
				"Auditar sin una pregunta de negocio o técnica.",
				"Confundir estilo con riesgo real.",
				"Proponer una tecnología nueva sin medir el coste de transición.",
				"Entregar una lista larga sin orden de ejecución.",
			],
			relatedServiceKeys: [
				"it-consulting:2",
				"it-consulting:1",
				"base:backend-spring-boot",
			],
			relatedPosts: [
				{
					title: "Arquitectura hexagonal en backend",
					description: "Qué aporta y cuándo introduce complejidad innecesaria.",
					href: "/es/blog/arquitectura-hexagonal-que-es-como-aplicarla-proyectos-backend/",
				},
				{
					title: "APIs idempotentes",
					description:
						"Un ejemplo de riesgo técnico que conviene revisar en flujos críticos.",
					href: "/es/blog/apis-idempotentes-que-sobreviven-a-reintentos/",
				},
			],
			faq: [
				{
					question: "¿La auditoría incluye cambios de código?",
					answer:
						"No por defecto. Primero separo diagnóstico y prioridades; la ejecución puede plantearse después con alcance propio.",
				},
				{
					question: "¿Qué acceso necesitas?",
					answer:
						"Depende del alcance: repositorio, documentación, configuración no secreta, diagramas, métricas o ejemplos de incidencias.",
				},
				{
					question: "¿Puedo usar el informe con otro proveedor?",
					answer:
						"Sí. Las conclusiones deben ser comprensibles y útiles aunque la ejecución la haga otro equipo.",
				},
			],
			ctaTitle: "Cuéntame qué decisión necesita evidencia",
			ctaText:
				"Podemos acotar la revisión alrededor de una API, un problema de rendimiento, una migración o el sistema completo.",
			ctaButton: "Solicitar auditoría",
			serviceType: "Auditoría técnica de backend y APIs",
			audience: [
				"Equipos técnicos",
				"Startups",
				"Empresas",
				"Responsables de producto",
			],
		}),
		createFocusedLanding("es", {
			slug: "integracion-crm-formularios-pagos-erp",
			translationKey: "crm-forms-payments-erp-integration",
			metaTitle:
				"Integración de CRM, formularios, pagos y ERP | José Miguel Fernández",
			metaDescription:
				"Integración de CRM, formularios web, pagos, ERP y hojas de cálculo con validación, reintentos, alertas y trazabilidad.",
			keywords: [
				"integrar CRM formulario web",
				"integración pagos ERP",
				"integración herramientas negocio",
			],
			eyebrow: "Datos conectados sin copiar y pegar",
			title: "Integración de CRM, formularios, pagos y ERP",
			intro:
				"Conecto las herramientas que participan en captación, venta y operación para que los datos lleguen completos, una sola vez y con errores visibles.",
			problemTitle: "Quitar al equipo del papel de puente entre sistemas",
			problemBody: [
				"Copiar datos entre formularios, CRM, pagos y ERP consume tiempo y crea diferencias difíciles de rastrear.",
				"Una integración fiable define qué sistema manda, cómo se validan los datos y qué ocurre cuando algo falla.",
			],
			when: [
				"Los leads se copian manualmente al CRM.",
				"Un pago debe crear pedidos, tareas o avisos.",
				"CRM y ERP contienen información distinta del mismo cliente.",
				"Los errores de sincronización se descubren tarde.",
			],
			cases: [
				[
					"Formulario y CRM",
					"Contactos limpios con fuente, consentimiento y estado inicial.",
				],
				[
					"Pagos y operación",
					"Pedidos, tareas y avisos a partir de eventos confirmados.",
				],
				[
					"CRM y ERP",
					"Sincronización con reglas claras de propiedad y conflicto.",
				],
				[
					"Revisión de errores",
					"Cola o panel para reintentar y resolver casos pendientes.",
				],
			],
			builds: [
				"Mapeo de campos y reglas de validación.",
				"APIs, webhooks o jobs de sincronización.",
				"Idempotencia, reintentos y alertas.",
				"Logs y revisión de operaciones fallidas.",
			],
			process: [
				"Dibujo el flujo y el sistema responsable de cada dato.",
				"Defino formatos, permisos, duplicados y fallos.",
				"Construyo y pruebo casos normales y repetidos.",
				"Documento operación y cambios de API que conviene vigilar.",
			],
			avoid: [
				"Sincronizar todo sin necesidad.",
				"Guardar datos sensibles en más sistemas de los necesarios.",
				"Reintentar sin controlar duplicados.",
				"Depender de un flujo que falla sin avisar.",
			],
			relatedServiceKeys: [
				"it-consulting:4",
				"it-consulting:5",
				"base:internal-tools",
			],
			relatedPosts: [
				{
					title: "APIs idempotentes",
					description:
						"Cómo evitar operaciones duplicadas cuando hay reintentos.",
					href: "/es/blog/apis-idempotentes-que-sobreviven-a-reintentos/",
				},
				{
					title: "Kafka, RabbitMQ o base de datos",
					description:
						"Opciones para coordinar trabajo asíncrono sin sobredimensionar.",
					href: "/es/blog/cuando-deberias-usar-kafka-rabbitmq-o-simplemente-una-base-de-datos/",
				},
			],
			faq: [
				{
					question: "¿Necesitan API todas las herramientas?",
					answer:
						"Es lo más fiable, pero también pueden existir webhooks, conectores o exportaciones. Conviene evaluar sus límites antes de depender de ellos.",
				},
				{
					question: "¿Cómo se evitan duplicados?",
					answer:
						"Con identificadores, reglas de idempotencia y una política explícita para reintentos y conflictos.",
				},
				{
					question: "¿Qué pasa si un sistema deja de responder?",
					answer:
						"El flujo debe registrar el fallo, avisar y permitir reintento o revisión sin perder el evento.",
				},
			],
			ctaTitle: "Dime qué herramientas tienen que hablar entre sí",
			ctaText:
				"Con el origen, destino y dato que hoy se copia a mano podemos acotar la primera integración.",
			ctaButton: "Consultar integración",
			serviceType: "Integración de CRM, formularios, pagos y ERP",
			audience: [
				"Pymes",
				"Equipos de operaciones",
				"Negocios digitales",
				"Equipos comerciales",
			],
		}),
		createFocusedLanding("es", {
			slug: "automatizacion-ia-operaciones-documentos",
			translationKey: "ai-automation-operations-documents",
			metaTitle:
				"Automatización con IA para operaciones y documentos | José Miguel Fernández",
			metaDescription:
				"Automatización con IA para clasificar mensajes, extraer datos, revisar documentos y preparar borradores con control humano.",
			keywords: [
				"automatización de procesos con IA",
				"IA documentos empresa",
				"automatización IA operaciones",
			],
			eyebrow: "IA aplicada con control",
			title: "Automatización con IA para operaciones y documentos",
			intro:
				"Diseño flujos que usan IA para interpretar texto o documentos cuando una regla no basta, con validación, trazabilidad y revisión humana donde el error importa.",
			problemTitle: "Reducir trabajo repetitivo sin ocultar incertidumbre",
			problemBody: [
				"La IA puede ayudar a clasificar, extraer o preparar, pero no convierte una respuesta probable en un dato fiable por sí sola.",
				"El flujo debe decidir qué puede automatizarse, qué se valida y qué llega a una persona.",
			],
			when: [
				"Se revisan muchos emails o documentos parecidos.",
				"Hay que extraer campos de texto no totalmente estructurado.",
				"El equipo clasifica solicitudes antes de trabajar en ellas.",
				"Un borrador ahorra tiempo, pero la decisión final sigue siendo humana.",
			],
			cases: [
				[
					"Clasificación",
					"Etiquetar mensajes y dirigirlos a la cola adecuada.",
				],
				[
					"Extracción",
					"Preparar campos estructurados desde documentos con validaciones.",
				],
				[
					"Borradores",
					"Respuestas, resúmenes o informes para revisión humana.",
				],
				[
					"Búsqueda interna",
					"Consultar documentación con fuentes y límites visibles.",
				],
			],
			builds: [
				"Flujo de entrada, preparación y validación.",
				"Integración con modelos y herramientas existentes.",
				"Umbrales, revisión humana y tratamiento de excepciones.",
				"Logs, costes y evaluación de calidad.",
			],
			process: [
				"Defino el error aceptable y quién toma la decisión final.",
				"Preparo ejemplos reales y una evaluación pequeña.",
				"Construyo el flujo con controles y salida estructurada.",
				"Mido calidad, coste y casos que deben escalarse.",
			],
			avoid: [
				"Usar IA para reglas deterministas sencillas.",
				"Automatizar decisiones sensibles sin revisión.",
				"Enviar datos sin revisar permisos y retención.",
				"Medir solo si la respuesta suena bien.",
			],
			relatedServiceKeys: [
				"ai-automation:2",
				"it-consulting:5",
				"base:internal-tools",
			],
			relatedPosts: [
				{
					title: "Usar IA en un producto sin humo",
					description: "Dónde aporta valor y qué límites conviene diseñar.",
					href: "/es/blog/usar-ia-en-tu-producto-sin-humo/",
				},
				{
					title: "Cuándo automatizar procesos",
					description: "Cómo elegir primero un flujo útil y medible.",
					href: "/es/blog/automatizar-procesos-empresa-cuando-merece-la-pena/",
				},
			],
			faq: [
				{
					question: "¿Hace falta eliminar la revisión humana?",
					answer:
						"No. En muchos casos el mayor valor está en preparar y priorizar, manteniendo la decisión sensible en una persona.",
				},
				{
					question: "¿Cómo se mide si funciona?",
					answer:
						"Con un conjunto de ejemplos, criterios de calidad, coste por ejecución y seguimiento de los casos corregidos o rechazados.",
				},
				{
					question: "¿Se pueden proteger datos sensibles?",
					answer:
						"El diseño debe revisar qué datos se envían, a qué proveedor, durante cuánto tiempo y si pueden minimizarse o anonimizarse.",
				},
			],
			ctaTitle: "Revisemos un flujo antes de añadir IA",
			ctaText:
				"Unos ejemplos reales suelen bastar para decidir si conviene IA, reglas, una integración o una combinación.",
			ctaButton: "Consultar automatización con IA",
			serviceType: "Automatización de operaciones y documentos con IA",
			audience: [
				"Pymes",
				"Equipos de operaciones",
				"Equipos de soporte",
				"Negocios digitales",
			],
		}),
		createFocusedLanding("es", {
			slug: "dashboards-paneles-internos",
			translationKey: "dashboards-internal-admin-panels",
			metaTitle:
				"Dashboards y paneles internos a medida | José Miguel Fernández",
			metaDescription:
				"Dashboards y paneles internos para consultar datos, revisar trabajo, gestionar estados y operar sin depender de hojas dispersas.",
			keywords: [
				"dashboard a medida",
				"panel de administración",
				"panel interno empresa",
			],
			eyebrow: "Una vista clara para operar",
			title: "Dashboards y paneles internos a medida",
			intro:
				"Construyo interfaces privadas para consultar datos, gestionar estados, revisar excepciones y dar al equipo una visión compartida del trabajo.",
			problemTitle: "Convertir datos dispersos en decisiones y tareas visibles",
			problemBody: [
				"Un dashboard no ayuda por tener más gráficas. Ayuda cuando responde una pregunta o permite completar una tarea.",
				"El diseño debe partir de usuarios, permisos, decisiones y fuentes de datos reales.",
			],
			when: [
				"El equipo consulta varias herramientas para conocer un estado.",
				"Las revisiones y aprobaciones se coordinan por mensajes.",
				"Faltan filtros, historial o responsables claros.",
				"Una hoja compartida contiene operación crítica.",
			],
			cases: [
				[
					"Panel operativo",
					"Estados, responsables, fechas y excepciones en una vista de trabajo.",
				],
				[
					"Administración",
					"Altas, cambios, validaciones y acciones con permisos.",
				],
				["Revisión", "Colas, comentarios, aprobación y trazabilidad."],
				[
					"Indicadores",
					"Métricas conectadas con decisiones, no gráficas decorativas.",
				],
			],
			builds: [
				"Autenticación y roles proporcionados al riesgo.",
				"Tablas, filtros, búsqueda y formularios.",
				"Historial de cambios y estados.",
				"Integraciones con API, CRM o base de datos.",
			],
			process: [
				"Identifico usuarios, preguntas y tareas frecuentes.",
				"Defino una primera vista y el dato que la sostiene.",
				"Construyo el recorrido principal antes de añadir excepciones.",
				"Valido uso y priorizo la siguiente mejora.",
			],
			avoid: [
				"Crear métricas sin una decisión asociada.",
				"Copiar un ERP completo para resolver una sola cola.",
				"Añadir permisos complejos antes de entender roles reales.",
				"Construir sobre datos cuya fuente no está clara.",
			],
			relatedServiceKeys: [
				"base:internal-tools",
				"it-consulting:3",
				"it-consulting:4",
			],
			relatedPosts: [
				{
					title: "Cuándo construir una herramienta interna",
					description:
						"Señales de que una hoja ya no sostiene bien el proceso.",
					href: "/es/blog/cuando-construir-herramienta-interna-en-vez-de-usar-excel/",
				},
				{
					title: "Cuánto cuesta una herramienta interna",
					description:
						"Qué cambia el alcance y cómo empezar por una versión útil.",
					href: "/es/blog/cuanto-cuesta-crear-herramienta-interna-a-medida/",
				},
			],
			faq: [
				{
					question: "¿Un dashboard necesita una aplicación completa?",
					answer:
						"No siempre. Puede empezar con una vista y un flujo concreto sobre datos que ya existen.",
				},
				{
					question: "¿Puede conectarse a nuestras herramientas?",
					answer:
						"Sí, si ofrecen API, acceso a datos o un mecanismo fiable de intercambio.",
				},
				{
					question: "¿Cómo se gestionan permisos?",
					answer:
						"Se definen según acciones y datos reales. Conviene evitar roles complejos que nadie pueda explicar.",
				},
			],
			ctaTitle: "Cuéntame qué necesita ver o gestionar el equipo",
			ctaText:
				"Con la tarea, los usuarios y las fuentes de datos podemos definir una primera pantalla útil.",
			ctaButton: "Consultar panel interno",
			serviceType: "Desarrollo de dashboards y paneles internos",
			audience: [
				"Pymes",
				"Equipos de operaciones",
				"Startups",
				"Equipos internos",
			],
		}),
		createFocusedLanding("es", {
			slug: "sustituir-excel-software",
			translationKey: "replace-excel-with-software",
			metaTitle:
				"Sustituir Excel por software a medida | José Miguel Fernández",
			metaDescription:
				"Software para sustituir hojas Excel críticas con datos centralizados, validación, permisos, historial e integraciones por fases.",
			keywords: [
				"sustituir Excel por software",
				"alternativa Excel empresa",
				"aplicación para procesos Excel",
			],
			eyebrow: "Cuando la hoja ya sostiene demasiado",
			title: "Sustituir un proceso crítico de Excel por software",
			intro:
				"Ayudo a convertir hojas compartidas, fórmulas frágiles y pasos manuales en una herramienta pequeña que conserve el flujo útil y reduzca errores.",
			problemTitle: "Salir de Excel sin intentar construir un ERP",
			problemBody: [
				"Excel funciona muy bien hasta que varias personas, estados, permisos e integraciones convierten la hoja en una aplicación accidental.",
				"La transición debe identificar qué parte necesita software y qué parte puede seguir siendo una exportación o análisis puntual.",
			],
			when: [
				"Hay varias versiones y no se sabe cuál es correcta.",
				"Las fórmulas o macros dependen de una sola persona.",
				"Se copian datos desde formularios, email, CRM o ERP.",
				"Hace falta historial, permisos o validación consistente.",
			],
			cases: [
				[
					"Registro central",
					"Una fuente clara para entidades, estados y responsables.",
				],
				[
					"Flujo de trabajo",
					"Tareas, revisiones y cambios de estado con historial.",
				],
				[
					"Validación",
					"Reglas en la entrada en lugar de corregir datos al final.",
				],
				[
					"Importación y exportación",
					"Conservar Excel donde sigue siendo útil sin usarlo como base operativa.",
				],
			],
			builds: [
				"Mapa de hojas, usuarios, reglas y excepciones.",
				"Aplicación web para el flujo principal.",
				"Importación inicial y exportaciones necesarias.",
				"Integraciones y retirada gradual de hojas duplicadas.",
			],
			process: [
				"Reviso la hoja y cómo se usa de verdad.",
				"Separo datos, reglas, informes y tareas.",
				"Construyo una primera versión para el recorrido frecuente.",
				"Migro por fases y mantengo una salida segura mientras se valida.",
			],
			avoid: [
				"Copiar cada columna y macro sin cuestionar su uso.",
				"Intentar sustituir todas las hojas a la vez.",
				"Migrar datos sin limpiar duplicados y reglas contradictorias.",
				"Eliminar exportaciones que el equipo todavía necesita.",
			],
			relatedServiceKeys: [
				"base:internal-tools",
				"it-consulting:3",
				"it-consulting:5",
			],
			relatedPosts: [
				{
					title: "Cuándo dejar de usar Excel",
					description: "Señales prácticas de que la hoja se ha quedado corta.",
					href: "/es/blog/cuando-construir-herramienta-interna-en-vez-de-usar-excel/",
				},
				{
					title: "Cuánto cuesta una herramienta interna",
					description:
						"Cómo estimar una primera versión y qué encarece el proyecto.",
					href: "/es/blog/cuanto-cuesta-crear-herramienta-interna-a-medida/",
				},
			],
			faq: [
				{
					question: "¿Hay que dejar Excel desde el primer día?",
					answer:
						"No. Una transición gradual permite validar el flujo y conservar exportaciones mientras la herramienta gana confianza.",
				},
				{
					question: "¿Se pueden importar los datos actuales?",
					answer:
						"Sí, después de revisar formato, duplicados, valores incompletos y reglas que hoy viven en fórmulas o macros.",
				},
				{
					question: "¿Cómo se calcula el alcance?",
					answer:
						"Por usuarios, recorridos, datos, permisos, integraciones y excepciones; no por el número de hojas o columnas.",
				},
			],
			ctaTitle: "Enséñame la hoja y el proceso que hay alrededor",
			ctaText:
				"No hace falta preparar una especificación. Ver quién la usa, qué copia y dónde falla suele revelar una primera versión sensata.",
			ctaButton: "Revisar proceso en Excel",
			serviceType: "Software a medida para sustituir Excel",
			audience: [
				"Pymes",
				"Equipos de operaciones",
				"Administración",
				"Profesionales",
			],
		}),
	],
	en: [
		createFocusedLanding("en", {
			slug: "spring-boot-maintenance",
			translationKey: "spring-boot-maintenance",
			metaTitle:
				"Spring Boot Maintenance for Companies | José Miguel Fernández",
			metaDescription:
				"Java Spring Boot maintenance and application evolution covering incidents, APIs, performance, security, technical debt and controlled delivery.",
			keywords: [
				"Spring Boot maintenance",
				"Java Spring Boot support",
				"backend application evolution",
			],
			eyebrow: "Technical continuity for Java backends",
			title: "Spring Boot application maintenance and evolution",
			intro:
				"I help maintain and evolve Java/Spring Boot backends that already support products or operations, using focused changes, diagnosis before coding and visible risk management.",
			problemTitle: "Stop every backend change from becoming a gamble",
			problemBody: [
				"A production application accumulates incidents, dependencies, old decisions and work that does not fit a greenfield project.",
				"Useful maintenance combines fixes, observability, tests and small improvements that make the next change safer.",
			],
			when: [
				"Incidents repeat or releases feel unsafe.",
				"The team needs focused API, database or integration support.",
				"Spring Boot, Java or dependencies have fallen behind.",
				"Critical paths lack logs, metrics or tests.",
			],
			cases: [
				[
					"Incidents and stability",
					"Diagnose errors, timeouts, resource use and integration failures.",
				],
				[
					"API evolution",
					"Add endpoints, validation and contract changes with controlled compatibility.",
				],
				[
					"Updates",
					"Plan Java, Spring Boot and dependency upgrades with staged validation.",
				],
				[
					"Technical debt",
					"Improve the areas where code measurably slows change or raises operational risk.",
				],
			],
			builds: [
				"Incident diagnosis and prioritization.",
				"Fixes, tests and observability improvements.",
				"Evolution of existing APIs and integrations.",
				"Technical upgrades with clear scope and rollback.",
			],
			process: [
				"I review context, repository, delivery and observed problems.",
				"I separate urgent work, risk and improvements that can wait.",
				"I deliver small changes with explicit verification.",
				"I document decisions, limits and sensible next steps.",
			],
			avoid: [
				"Mixing an urgent incident with a full rewrite.",
				"Upgrading dependencies without understanding compatibility and delivery.",
				"Fixing symptoms without improving the evidence needed for the next incident.",
			],
			relatedServiceKeys: [
				"base:backend-spring-boot",
				"it-consulting:2",
				"it-consulting:1",
			],
			relatedPosts: [
				{
					title: "Spring Boot in production",
					description:
						"Configuration, observability and delivery checks for operating with context.",
					href: "/en/blog/spring-boot-production-devops-checklist/",
				},
				{
					title: "Spring Boot performance tuning",
					description: "Changes worth measuring before optimizing.",
					href: "/en/blog/spring-boot-performance-tuning/",
				},
			],
			faq: [
				{
					question: "Can this be focused support?",
					answer:
						"Yes. It can start with one incident, a review or a clearly bounded block of evolution work.",
				},
				{
					question: "Do you work on existing codebases?",
					answer:
						"Yes, provided I can review the repository, environment and scope before committing to changes.",
				},
				{
					question: "How is the work handed over?",
					answer:
						"Through reviewable changes, risk-proportionate tests and documentation for decisions and delivery.",
				},
			],
			ctaTitle: "Tell me what is slowing the backend down",
			ctaText:
				"The symptom, Java/Spring Boot version and delivery context are enough to frame a sensible first diagnosis.",
			ctaButton: "Ask about maintenance",
			serviceType: "Java Spring Boot application maintenance",
			audience: ["Companies", "Product teams", "Technical teams", "Startups"],
		}),
		createFocusedLanding("en", {
			slug: "legacy-backend-modernization",
			translationKey: "legacy-backend-modernization",
			metaTitle: "Phased Legacy Backend Modernization | José Miguel Fernández",
			metaDescription:
				"Legacy backend modernization without blind rewrites: diagnosis, boundaries, incremental migration, characterization tests and phased coexistence.",
			keywords: [
				"legacy backend modernization",
				"backend migration",
				"migrate to Spring Boot",
			],
			eyebrow: "Change without stopping the business",
			title: "Phased legacy backend modernization",
			intro:
				"I help decide what to retain, isolate and migrate when an older backend slows delivery, complicates operations or concentrates too much risk.",
			problemTitle: "Reduce risk before choosing a rewrite",
			problemBody: [
				"An old system may contain debt, but it also contains years of real rules that are not documented elsewhere.",
				"Modernization starts by understanding dependencies, critical paths and a small boundary that can evolve without breaking operations.",
			],
			when: [
				"Small changes take too long or break unexpected areas.",
				"Technology limits hiring, security or delivery.",
				"There are not enough tests for a safe migration.",
				"A rewrite is being discussed without reliable cost or risk data.",
			],
			cases: [
				[
					"Risk map",
					"Dependencies, critical modules, integrations and blind spots.",
				],
				[
					"Boundary extraction",
					"Separate one capability before moving the rest.",
				],
				[
					"Compatibility",
					"Contracts, data and releases that allow temporary coexistence.",
				],
				[
					"Migration plan",
					"Phases, exit criteria, rollback and work that should be avoided.",
				],
			],
			builds: [
				"Technical diagnosis and dependency map.",
				"Characterization tests for critical behavior.",
				"Incremental plan with milestones and stop criteria.",
				"A first modernization slice or Spring Boot migration.",
			],
			process: [
				"I gather goals, failures and operational constraints.",
				"I identify critical rules and real dependencies.",
				"I compare keeping, encapsulating, migrating and replacing.",
				"I propose one verifiable and reversible first phase.",
			],
			avoid: [
				"Rewriting without capturing current behavior.",
				"Moving to microservices by default.",
				"Changing technology and data model together without a reason.",
				"Hiding uncertainty behind a fixed estimate.",
			],
			relatedServiceKeys: [
				"base:backend-spring-boot",
				"it-consulting:2",
				"it-consulting:1",
			],
			relatedPosts: [
				{
					title: "When to migrate a legacy backend to Spring Boot",
					description: "Signals, risks and an incremental strategy.",
					href: "/en/blog/when-should-a-company-migrate-a-legacy-backend-to-java-spring-boot/",
				},
				{
					title: "Modular monolith vs microservices",
					description:
						"Choose a useful boundary without adding distribution too early.",
					href: "/en/blog/modular-monolith-vs-microservices/",
				},
			],
			faq: [
				{
					question: "Does everything need to be rewritten?",
					answer:
						"Usually not. Start with the largest measurable cost or risk and one boundary that can be validated.",
				},
				{
					question: "Can migration happen while the system remains live?",
					answer:
						"Yes, if contracts, data, delivery and rollback are designed for temporary coexistence.",
				},
				{
					question: "Does the target have to be Spring Boot?",
					answer:
						"No. Spring Boot fits many Java teams, but the decision depends on the system and expected maintenance.",
				},
			],
			ctaTitle: "Review the backend before choosing a rewrite",
			ctaText:
				"A focused review can turn an open-ended decision into a first step with known risk and a way out.",
			ctaButton: "Discuss modernization",
			serviceType: "Legacy backend modernization",
			audience: ["Companies", "Technical teams", "Product leaders", "CTOs"],
		}),
		createFocusedLanding("en", {
			slug: "backend-api-architecture-audit",
			translationKey: "backend-api-architecture-audit",
			metaTitle: "Backend, API and Architecture Audit | José Miguel Fernández",
			metaDescription:
				"Technical backend, API and architecture audit to prioritize risks, performance, security, maintainability and practical next steps.",
			keywords: ["backend audit", "API audit", "software architecture review"],
			eyebrow: "Review before investing further",
			title: "Technical backend, API and architecture audit",
			intro:
				"I review an existing system to separate demonstrable problems from technical preference and turn the evidence into a useful order of work.",
			problemTitle: "Know what to fix, measure and leave alone",
			problemBody: [
				"A useful audit is not an automated checklist or an excuse to rewrite.",
				"It connects technical evidence with operational impact, change cost and defensible priority.",
			],
			when: [
				"The system fails or slows down without a clear cause.",
				"A rewrite or migration proposal needs an independent view.",
				"APIs are difficult to change or integrate.",
				"A technical plan is needed before budgeting or hiring.",
			],
			cases: [
				[
					"Backend",
					"Errors, boundaries, persistence, concurrency, observability and tests.",
				],
				["APIs", "Contracts, validation, idempotency, security and evolution."],
				[
					"Architecture",
					"Coupling, boundaries, dependencies and operational complexity.",
				],
				[
					"Delivery",
					"Build, configuration, release, rollback and production diagnosis.",
				],
			],
			builds: [
				"Evidence-backed findings map.",
				"Priority by impact, effort and risk.",
				"Immediate actions and decisions that require more data.",
				"Phased plan ready for estimation or execution.",
			],
			process: [
				"We agree the questions and review scope.",
				"I read the relevant code, configuration and documentation.",
				"I verify findings and discard preferences without impact.",
				"I deliver prioritized conclusions and explain their context.",
			],
			avoid: [
				"Auditing without a business or technical question.",
				"Confusing style with material risk.",
				"Proposing new technology without transition cost.",
				"Delivering a long list without execution order.",
			],
			relatedServiceKeys: [
				"it-consulting:2",
				"it-consulting:1",
				"base:backend-spring-boot",
			],
			relatedPosts: [
				{
					title: "Hexagonal architecture in backend projects",
					description:
						"What it helps with and when it adds unnecessary complexity.",
					href: "/en/blog/hexagonal-architecture-what-it-is-how-to-apply-backend-projects/",
				},
				{
					title: "Idempotent APIs",
					description:
						"A concrete technical risk worth reviewing in critical workflows.",
					href: "/en/blog/idempotent-apis-that-survive-retries/",
				},
			],
			faq: [
				{
					question: "Does the audit include code changes?",
					answer:
						"Not by default. Diagnosis and priorities come first; execution can be scoped separately.",
				},
				{
					question: "What access do you need?",
					answer:
						"It depends on scope: repository, documentation, non-secret configuration, diagrams, metrics or incident examples.",
				},
				{
					question: "Can I use the report with another supplier?",
					answer:
						"Yes. The conclusions should remain understandable and useful regardless of who implements them.",
				},
			],
			ctaTitle: "Tell me which decision needs evidence",
			ctaText:
				"The review can focus on one API, a performance issue, a migration or the wider system.",
			ctaButton: "Request an audit",
			serviceType: "Backend and API technical audit",
			audience: ["Technical teams", "Startups", "Companies", "Product leaders"],
		}),
		createFocusedLanding("en", {
			slug: "crm-forms-payments-erp-integration",
			translationKey: "crm-forms-payments-erp-integration",
			metaTitle:
				"CRM, Forms, Payments and ERP Integration | José Miguel Fernández",
			metaDescription:
				"Integrate CRM, website forms, payments, ERP and spreadsheets with validation, retries, alerts and traceable data movement.",
			keywords: [
				"CRM website form integration",
				"payments ERP integration",
				"business system integration",
			],
			eyebrow: "Connected data without copy-paste",
			title: "CRM, forms, payments and ERP integration",
			intro:
				"I connect the tools involved in lead generation, sales and operations so data arrives complete, once and with visible failures.",
			problemTitle: "Remove the team from the role of system bridge",
			problemBody: [
				"Copying data between forms, CRM, payments and ERP consumes time and creates hard-to-trace differences.",
				"A reliable integration defines the source of truth, validation and what happens when a system fails.",
			],
			when: [
				"Leads are copied into the CRM manually.",
				"A payment should create orders, tasks or alerts.",
				"CRM and ERP disagree about the same customer.",
				"Synchronization failures are discovered too late.",
			],
			cases: [
				[
					"Forms and CRM",
					"Clean contacts with source, consent and initial status.",
				],
				[
					"Payments and operations",
					"Orders, tasks and alerts from confirmed events.",
				],
				[
					"CRM and ERP",
					"Synchronization with explicit ownership and conflict rules.",
				],
				[
					"Error review",
					"A queue or panel for retrying and resolving pending cases.",
				],
			],
			builds: [
				"Field mapping and validation rules.",
				"APIs, webhooks or synchronization jobs.",
				"Idempotency, retries and alerts.",
				"Logs and review for failed operations.",
			],
			process: [
				"I map the flow and owner for each data item.",
				"I define formats, permissions, duplicates and failures.",
				"I build and test normal and repeated cases.",
				"I document operation and API changes worth monitoring.",
			],
			avoid: [
				"Synchronizing everything without a need.",
				"Storing sensitive data in more systems than necessary.",
				"Retrying without duplicate protection.",
				"Depending on a flow that fails silently.",
			],
			relatedServiceKeys: [
				"it-consulting:4",
				"it-consulting:5",
				"base:internal-tools",
			],
			relatedPosts: [
				{
					title: "Idempotent APIs",
					description: "Avoid duplicate operations when retries happen.",
					href: "/en/blog/idempotent-apis-that-survive-retries/",
				},
				{
					title: "Kafka, RabbitMQ or a database",
					description:
						"Coordinate asynchronous work without oversizing the system.",
					href: "/en/blog/when-should-you-use-kafka-rabbitmq-or-just-a-database/",
				},
			],
			faq: [
				{
					question: "Does every tool need an API?",
					answer:
						"An API is usually most reliable, but webhooks, connectors and exports may work. Their limits should be assessed first.",
				},
				{
					question: "How are duplicates prevented?",
					answer:
						"With identifiers, idempotency rules and an explicit retry and conflict policy.",
				},
				{
					question: "What if one system stops responding?",
					answer:
						"The flow should record the failure, alert someone and support retry or review without losing the event.",
				},
			],
			ctaTitle: "Tell me which tools need to communicate",
			ctaText:
				"The source, destination and data currently copied by hand are enough to scope a first integration.",
			ctaButton: "Discuss an integration",
			serviceType: "CRM, forms, payments and ERP integration",
			audience: [
				"Small businesses",
				"Operations teams",
				"Digital businesses",
				"Sales teams",
			],
		}),
		createFocusedLanding("en", {
			slug: "ai-automation-operations-documents",
			translationKey: "ai-automation-operations-documents",
			metaTitle:
				"AI Automation for Operations and Documents | José Miguel Fernández",
			metaDescription:
				"AI automation for classifying messages, extracting data, reviewing documents and preparing drafts with human control.",
			keywords: [
				"AI process automation",
				"AI document automation",
				"AI operations automation",
			],
			eyebrow: "Applied AI with control",
			title: "AI automation for operations and documents",
			intro:
				"I design workflows that use AI to interpret text or documents when a rule is not enough, with validation, traceability and human review where errors matter.",
			problemTitle: "Reduce repetitive work without hiding uncertainty",
			problemBody: [
				"AI can classify, extract and prepare, but it does not turn a probable answer into reliable data by itself.",
				"The workflow must decide what can be automated, what is validated and what reaches a person.",
			],
			when: [
				"Many similar emails or documents are reviewed.",
				"Fields must be extracted from partly unstructured text.",
				"The team classifies requests before working on them.",
				"A draft saves time while a person retains the decision.",
			],
			cases: [
				["Classification", "Label messages and route them to the right queue."],
				[
					"Extraction",
					"Prepare structured fields from documents with validation.",
				],
				["Drafts", "Responses, summaries or reports for human review."],
				[
					"Internal search",
					"Query documentation with sources and visible limits.",
				],
			],
			builds: [
				"Input, preparation and validation flow.",
				"Integration with models and current tools.",
				"Thresholds, human review and exception handling.",
				"Quality, cost and operational logging.",
			],
			process: [
				"I define acceptable error and who makes the final decision.",
				"I prepare real examples and a small evaluation.",
				"I build the workflow with controls and structured output.",
				"I measure quality, cost and escalation cases.",
			],
			avoid: [
				"Using AI for simple deterministic rules.",
				"Automating sensitive decisions without review.",
				"Sending data without reviewing permission and retention.",
				"Measuring only whether an answer sounds convincing.",
			],
			relatedServiceKeys: [
				"ai-automation:2",
				"it-consulting:5",
				"base:internal-tools",
			],
			relatedPosts: [
				{
					title: "Using AI in a product without hype",
					description: "Where it adds value and which limits need designing.",
					href: "/en/blog/using-ai-in-your-product-without-hype/",
				},
				{
					title: "When business process automation is worth it",
					description: "Choose a useful and measurable workflow first.",
					href: "/en/blog/when-business-process-automation-is-worth-it/",
				},
			],
			faq: [
				{
					question: "Does human review need to disappear?",
					answer:
						"No. Often the value is in preparing and prioritizing while a person retains sensitive decisions.",
				},
				{
					question: "How is quality measured?",
					answer:
						"With representative examples, quality criteria, execution cost and tracking of corrected or rejected cases.",
				},
				{
					question: "Can sensitive data be protected?",
					answer:
						"The design should review what is sent, to which provider, for how long, and whether it can be minimized or anonymized.",
				},
			],
			ctaTitle: "Review a workflow before adding AI",
			ctaText:
				"A few real examples are usually enough to decide between AI, rules, an integration or a combination.",
			ctaButton: "Discuss AI automation",
			serviceType: "AI automation for operations and documents",
			audience: [
				"Small businesses",
				"Operations teams",
				"Support teams",
				"Digital businesses",
			],
		}),
		createFocusedLanding("en", {
			slug: "dashboards-internal-admin-panels",
			translationKey: "dashboards-internal-admin-panels",
			metaTitle:
				"Custom Dashboards and Internal Admin Panels | José Miguel Fernández",
			metaDescription:
				"Custom dashboards and internal panels for reviewing data, managing work, tracking states and operating without scattered spreadsheets.",
			keywords: [
				"custom dashboard",
				"internal admin panel",
				"business operations dashboard",
			],
			eyebrow: "A clear operational view",
			title: "Custom dashboards and internal admin panels",
			intro:
				"I build private interfaces for reviewing data, managing states, handling exceptions and giving a team a shared view of its work.",
			problemTitle: "Turn scattered data into visible decisions and tasks",
			problemBody: [
				"A dashboard does not help by containing more charts. It helps when it answers a question or supports a task.",
				"Design must start with real users, permissions, decisions and data sources.",
			],
			when: [
				"The team checks several tools to understand one status.",
				"Reviews and approvals happen in chat messages.",
				"Filters, history or ownership are missing.",
				"A shared spreadsheet contains critical operations.",
			],
			cases: [
				[
					"Operations panel",
					"States, owners, dates and exceptions in one work view.",
				],
				[
					"Administration",
					"Create, update and validate data with suitable permissions.",
				],
				["Review workflow", "Queues, comments, approval and traceability."],
				[
					"Indicators",
					"Metrics connected to decisions rather than decorative charts.",
				],
			],
			builds: [
				"Authentication and risk-proportionate roles.",
				"Tables, filters, search and forms.",
				"Change history and workflow states.",
				"API, CRM or database integrations.",
			],
			process: [
				"I identify users, questions and frequent tasks.",
				"I define one useful view and its underlying data.",
				"I build the primary workflow before rare exceptions.",
				"I validate use and prioritize the next improvement.",
			],
			avoid: [
				"Creating metrics with no decision attached.",
				"Copying an ERP to solve one queue.",
				"Adding complex permissions before roles are understood.",
				"Building on data with no clear source of truth.",
			],
			relatedServiceKeys: [
				"base:internal-tools",
				"it-consulting:3",
				"it-consulting:4",
			],
			relatedPosts: [
				{
					title: "When to build an internal tool",
					description:
						"Signals that a spreadsheet no longer supports the workflow well.",
					href: "/en/blog/when-to-build-an-internal-tool-instead-of-using-excel/",
				},
				{
					title: "How much does an internal tool cost?",
					description:
						"What changes scope and how to start with a useful version.",
					href: "/en/blog/how-much-does-a-custom-internal-tool-cost/",
				},
			],
			faq: [
				{
					question: "Does a dashboard require a full application?",
					answer:
						"Not always. It can begin with one view and workflow over data that already exists.",
				},
				{
					question: "Can it connect to our current tools?",
					answer:
						"Yes, when they provide an API, data access or another reliable exchange mechanism.",
				},
				{
					question: "How are permissions handled?",
					answer:
						"They are defined around real actions and data. Roles that nobody can explain should be avoided.",
				},
			],
			ctaTitle: "Tell me what the team needs to see or manage",
			ctaText:
				"The task, users and data sources are enough to define a useful first screen.",
			ctaButton: "Discuss an internal panel",
			serviceType: "Custom dashboard and internal admin panel development",
			audience: [
				"Small businesses",
				"Operations teams",
				"Startups",
				"Internal teams",
			],
		}),
		createFocusedLanding("en", {
			slug: "replace-excel-with-software",
			translationKey: "replace-excel-with-software",
			metaTitle: "Replace Excel with Custom Software | José Miguel Fernández",
			metaDescription:
				"Software for replacing critical Excel workflows with centralized data, validation, permissions, history and phased integrations.",
			keywords: [
				"replace Excel with software",
				"business spreadsheet alternative",
				"custom application for Excel process",
			],
			eyebrow: "When the spreadsheet carries too much",
			title: "Replace a critical Excel workflow with software",
			intro:
				"I help turn shared spreadsheets, fragile formulas and manual steps into a small tool that keeps the useful workflow and reduces avoidable errors.",
			problemTitle: "Move beyond Excel without trying to build an ERP",
			problemBody: [
				"Excel works well until multiple users, states, permissions and integrations turn the sheet into an accidental application.",
				"The transition should identify which part needs software and which part can remain an export or one-off analysis.",
			],
			when: [
				"Several versions exist and nobody knows which is current.",
				"Formulas or macros depend on one person.",
				"Data is copied from forms, email, CRM or ERP.",
				"History, permissions or consistent validation are needed.",
			],
			cases: [
				["Central record", "One clear source for entities, states and owners."],
				["Workflow", "Tasks, reviews and state changes with history."],
				["Validation", "Rules at entry instead of corrections at the end."],
				[
					"Import and export",
					"Keep Excel where it remains useful without using it as the operational database.",
				],
			],
			builds: [
				"Map of sheets, users, rules and exceptions.",
				"Web application for the primary workflow.",
				"Initial import and necessary exports.",
				"Integrations and gradual retirement of duplicate sheets.",
			],
			process: [
				"I review the spreadsheet and how it is actually used.",
				"I separate data, rules, reports and tasks.",
				"I build a first version for the frequent path.",
				"I migrate in phases and retain a safe exit while validating.",
			],
			avoid: [
				"Copying every column and macro without questioning its use.",
				"Replacing every spreadsheet at once.",
				"Migrating without cleaning duplicates and conflicting rules.",
				"Removing exports the team still needs.",
			],
			relatedServiceKeys: [
				"base:internal-tools",
				"it-consulting:3",
				"it-consulting:5",
			],
			relatedPosts: [
				{
					title: "When to move beyond Excel",
					description:
						"Practical signals that a spreadsheet has reached its limit.",
					href: "/en/blog/when-to-build-an-internal-tool-instead-of-using-excel/",
				},
				{
					title: "How much does an internal tool cost?",
					description:
						"Estimate a first version and understand what drives cost.",
					href: "/en/blog/how-much-does-a-custom-internal-tool-cost/",
				},
			],
			faq: [
				{
					question: "Must Excel disappear on day one?",
					answer:
						"No. A gradual transition validates the workflow and keeps exports while the tool earns trust.",
				},
				{
					question: "Can current data be imported?",
					answer:
						"Yes, after reviewing format, duplicates, missing values and rules hidden in formulas or macros.",
				},
				{
					question: "How is scope estimated?",
					answer:
						"By users, workflows, data, permissions, integrations and exceptions rather than the number of sheets or columns.",
				},
			],
			ctaTitle: "Show me the spreadsheet and the process around it",
			ctaText:
				"You do not need a formal specification. Who uses it, what they copy and where it fails usually reveals a sensible first version.",
			ctaButton: "Review an Excel workflow",
			serviceType: "Custom software to replace Excel workflows",
			audience: [
				"Small businesses",
				"Operations teams",
				"Administration",
				"Independent professionals",
			],
		}),
	],
};

const commercialLandingPages = {
	es: [
		{
			slug: "software-a-medida-pymes",
			translationKey: "custom-software-small-businesses",
			metaTitle: "Software a medida para pymes | José Miguel Fernández",
			metaDescription:
				"Software a medida para pymes que necesitan ordenar procesos, sustituir Excel o conectar herramientas sin crear complejidad innecesaria.",
			keywords: [
				"software a medida para pymes",
				"aplicaciones web para empresas",
				"herramientas internas",
				"automatización de procesos",
				"desarrollador full-stack freelance",
			],
			eyebrow: "Software práctico para equipos pequeños",
			title: "Software a medida para pymes",
			intro:
				"Cuando una hoja de cálculo, un correo o una herramienta genérica empieza a sostener demasiada operación, conviene parar y diseñar una base más clara. Construyo aplicaciones web y herramientas internas pequeñas, mantenibles y ajustadas al flujo real de la empresa.",
			primaryCta: "Contarme el proceso",
			secondaryCta: "Ver servicios relacionados",
			problem: {
				eyebrow: "Problema que resuelve",
				title: "Pasar de apaños dispersos a una herramienta útil",
				body: [
					"Muchas pymes no necesitan un sistema enorme. Necesitan que presupuestos, pedidos, tareas, incidencias, clientes o datos internos dejen de depender de copiar y pegar entre pestañas.",
					"Una herramienta a medida tiene sentido cuando el proceso ya existe, pero las herramientas actuales obligan al equipo a rodearlo con trabajo manual, duplicados y revisiones constantes.",
				],
			},
			whenWorthIt: {
				title: "Cuándo merece la pena",
				items: [
					"El equipo usa varias hojas de cálculo para el mismo proceso y nadie sabe cuál es la buena.",
					"Hay errores repetidos por copiar datos entre formularios, emails, CRM o ERP.",
					"El negocio necesita una vista clara de estados, responsables, fechas o importes.",
					"Una herramienta SaaS se queda corta o fuerza una forma de trabajar que no encaja.",
					"Quieres una primera versión pequeña antes de invertir en un producto completo.",
				],
			},
			cases: {
				title: "Casos habituales",
				intro:
					"El punto de partida suele ser una tarea conocida que ya consume tiempo cada semana.",
				items: [
					{
						title: "Paneles internos",
						body: "Vistas privadas para consultar clientes, solicitudes, pedidos, estados o métricas operativas sin depender de una hoja compartida.",
					},
					{
						title: "Flujos de revisión",
						body: "Colas de trabajo, aprobaciones, comentarios y cambios de estado para que cada persona sepa qué toca revisar.",
					},
					{
						title: "Gestión sencilla de datos",
						body: "Formularios internos, validaciones, filtros y exportaciones para mantener la información ordenada.",
					},
					{
						title: "Conexión con herramientas existentes",
						body: "Integraciones con formularios, pagos, CRM, bases de datos o APIs para reducir trabajo manual.",
					},
				],
			},
			builds: {
				title: "Qué se puede construir",
				items: [
					"Una aplicación web privada para gestionar un flujo concreto.",
					"Un panel administrativo con roles básicos y datos filtrables.",
					"Un sustituto gradual de una hoja de cálculo crítica.",
					"Una herramienta que conecte formularios, CRM, pagos o base de datos.",
					"Una primera versión que permita medir uso antes de ampliar alcance.",
				],
			},
			process: {
				title: "Cómo trabajo",
				steps: [
					"Mapeo el flujo actual con sus pasos, datos, excepciones y puntos de fricción.",
					"Propongo una primera versión pequeña, con entregables claros y sin funcionalidades de adorno.",
					"Construyo la herramienta con una base mantenible, validaciones y comportamiento razonable ante errores.",
					"Dejo documentado cómo usarla, qué queda fuera y qué tendría sentido mejorar después.",
				],
			},
			avoid: {
				title: "Qué conviene evitar",
				items: [
					"Convertir una primera versión en un ERP improvisado.",
					"Automatizar un proceso que todavía cambia cada semana.",
					"Construir pantallas para todos los casos posibles antes de validar los casos frecuentes.",
					"Copiar una herramienta grande cuando el negocio solo necesita resolver un flujo concreto.",
				],
			},
			relatedServicesTitle: "Servicios relacionados",
			relatedPostsTitle: "Lecturas relacionadas",
			relatedServiceKeys: [
				"it-consulting:3",
				"base:internal-tools",
				"it-consulting:5",
				"it-consulting:4",
			],
			relatedPosts: [
				{
					title:
						"Cuándo construir una herramienta interna en vez de usar Excel",
					description:
						"Señales prácticas para saber si una hoja de cálculo ya no aguanta el proceso.",
					href: "/es/blog/cuando-construir-herramienta-interna-en-vez-de-usar-excel/",
				},
				{
					title: "Cuánto cuesta crear una herramienta interna a medida",
					description:
						"Qué encarece el proyecto y cómo pensar una primera versión útil.",
					href: "/es/blog/cuanto-cuesta-crear-herramienta-interna-a-medida/",
				},
				{
					title: "Automatizar procesos de empresa: cuándo merece la pena",
					description:
						"Cómo detectar tareas repetidas que pueden convertirse en software fiable.",
					href: "/es/blog/automatizar-procesos-empresa-cuando-merece-la-pena/",
				},
			],
			faq: [
				{
					question: "¿Una pyme necesita siempre software a medida?",
					answer:
						"No. Si una herramienta existente resuelve bien el proceso, suele ser mejor usarla. Tiene sentido construir cuando el proceso ya es importante y las herramientas actuales generan trabajo manual o errores.",
				},
				{
					question: "¿Se puede empezar con una versión pequeña?",
					answer:
						"Sí. De hecho, es lo más sano. Una primera versión debería resolver el flujo principal, no todos los casos posibles desde el primer día.",
				},
				{
					question: "¿Puede conectarse con herramientas que ya usamos?",
					answer:
						"Normalmente sí, si esas herramientas tienen API, webhooks, exportaciones o una forma fiable de intercambiar datos.",
				},
			],
			cta: {
				eyebrow: "Primer paso",
				title: "Cuéntame qué proceso quieres ordenar",
				text: "Con una explicación breve del flujo actual suele bastar para detectar si conviene una herramienta a medida, una automatización o una solución más simple.",
				button: "Hablar del proyecto",
			},
			schema: {
				serviceType: "Software a medida para pymes",
				areaServed: "España y remoto",
				audience: [
					"Pymes",
					"Pequeñas empresas",
					"Equipos de operaciones",
					"Profesionales independientes",
				],
			},
		},
		{
			slug: "automatizacion-tareas-administrativas",
			translationKey: "administrative-task-automation",
			metaTitle:
				"Automatización de tareas administrativas | José Miguel Fernández",
			metaDescription:
				"Automatización de tareas administrativas para reducir copia manual, emails repetidos, reportes y movimientos de datos entre herramientas.",
			keywords: [
				"automatización de tareas administrativas",
				"automatización de procesos",
				"automatizar emails",
				"automatizar reportes",
				"integraciones API",
			],
			eyebrow: "Menos trabajo repetido",
			title: "Automatización de tareas administrativas",
			intro:
				"Las tareas administrativas pequeñas suelen parecer inevitables hasta que ocupan varias horas cada semana. Ayudo a convertir emails, formularios, reportes y movimientos de datos en flujos más fiables, con control humano donde hace falta.",
			primaryCta: "Revisar una tarea",
			secondaryCta: "Ver automatizaciones",
			problem: {
				eyebrow: "Problema que resuelve",
				title: "Reducir tareas manuales que ya tienen reglas claras",
				body: [
					"Una automatización útil no empieza por elegir una herramienta. Empieza por entender qué dato entra, qué decisión se toma, qué salida se necesita y dónde pueden aparecer errores.",
					"El objetivo no es quitar criterio al equipo, sino reservarlo para los casos que realmente lo necesitan.",
				],
			},
			whenWorthIt: {
				title: "Cuándo merece la pena",
				items: [
					"Copias datos de formularios a hojas, CRM, emails o herramientas internas.",
					"Generas informes parecidos cada semana o cada mes.",
					"Hay respuestas, avisos o tareas que siguen siempre el mismo patrón.",
					"Necesitas detectar errores antes de que lleguen al cliente.",
					"El equipo pierde tiempo comprobando si algo ya se ha hecho.",
				],
			},
			cases: {
				title: "Casos habituales",
				intro:
					"Las mejores primeras automatizaciones suelen ser concretas y fáciles de medir.",
				items: [
					{
						title: "Formularios y CRM",
						body: "Enviar datos limpios desde formularios web a CRM, hojas, email o paneles internos.",
					},
					{
						title: "Emails y avisos",
						body: "Crear respuestas, recordatorios o notificaciones cuando cambia un estado o falta información.",
					},
					{
						title: "Reportes operativos",
						body: "Agrupar datos y generar resúmenes periódicos sin montar el informe a mano.",
					},
					{
						title: "Clasificación con IA",
						body: "Clasificar mensajes, extraer datos o preparar borradores con revisión humana cuando el riesgo lo pide.",
					},
				],
			},
			builds: {
				title: "Qué se puede automatizar",
				items: [
					"Entrada de datos desde formularios, emails o documentos estructurados.",
					"Sincronización entre CRM, hojas de cálculo, bases de datos y herramientas SaaS.",
					"Alertas internas cuando falta información o aparece un error.",
					"Generación de reportes, resúmenes o borradores.",
					"Jobs programados que revisan datos y ejecutan tareas repetidas.",
				],
			},
			process: {
				title: "Cómo trabajo",
				steps: [
					"Identifico el punto exacto donde se pierde tiempo o se repite el error.",
					"Defino entradas, salidas, reglas, excepciones y nivel de supervisión necesario.",
					"Construyo el flujo con logs, avisos y una forma clara de detectar fallos.",
					"Lo dejo documentado para que el equipo sepa cuándo confiar en la automatización y cuándo revisar.",
				],
			},
			avoid: {
				title: "Qué conviene evitar",
				items: [
					"Automatizar decisiones que todavía no tienen reglas estables.",
					"Crear un flujo invisible que falla sin avisar.",
					"Conectar herramientas sin pensar qué pasa con duplicados, reintentos o datos incompletos.",
					"Usar IA donde una regla simple es más fiable y fácil de mantener.",
				],
			},
			relatedServicesTitle: "Servicios relacionados",
			relatedPostsTitle: "Lecturas relacionadas",
			relatedServiceKeys: [
				"it-consulting:5",
				"it-consulting:4",
				"ai-automation:2",
				"base:internal-tools",
			],
			relatedPosts: [
				{
					title: "Automatizar procesos de empresa: cuándo merece la pena",
					description:
						"Una guía para decidir qué tareas conviene automatizar primero.",
					href: "/es/blog/automatizar-procesos-empresa-cuando-merece-la-pena/",
				},
				{
					title: "Cómo usar la IA en tu producto sin convertirla en humo",
					description:
						"Casos donde la IA ayuda de verdad y límites que conviene respetar.",
					href: "/es/blog/usar-ia-en-tu-producto-sin-humo/",
				},
				{
					title: "APIs idempotentes que sobreviven a reintentos",
					description:
						"Patrones para que las integraciones no creen duplicados al fallar.",
					href: "/es/blog/apis-idempotentes-que-sobreviven-a-reintentos/",
				},
			],
			faq: [
				{
					question: "¿Qué tareas administrativas suelen automatizarse primero?",
					answer:
						"Las que se repiten con reglas claras: mover datos, crear avisos, generar reportes, enviar respuestas o revisar estados.",
				},
				{
					question: "¿La automatización elimina la revisión humana?",
					answer:
						"No siempre. En muchos procesos conviene que la automatización prepare, clasifique o avise, y que una persona revise los casos delicados.",
				},
				{
					question: "¿Hace falta cambiar todas las herramientas?",
					answer:
						"Normalmente no. Lo más práctico suele ser conectar mejor las herramientas actuales antes de sustituirlas.",
				},
			],
			cta: {
				eyebrow: "Detectar el primer flujo",
				title: "Podemos empezar por una tarea repetida",
				text: "Si me explicas qué copias, dónde lo pegas y qué comprobaciones haces, puedo ayudarte a ver si merece la pena automatizarlo.",
				button: "Consultar automatización",
			},
			schema: {
				serviceType: "Automatización de tareas administrativas",
				areaServed: "España y remoto",
				audience: [
					"Pymes",
					"Equipos administrativos",
					"Responsables de operaciones",
					"Negocios de servicios",
				],
			},
		},
		{
			slug: "consultor-tecnologico-pequenas-empresas",
			translationKey: "technology-consultant-small-businesses",
			metaTitle:
				"Consultor tecnológico para pequeñas empresas | José Miguel Fernández",
			metaDescription:
				"Consultor tecnológico para pequeñas empresas que necesitan decidir qué construir, revisar proveedores o acotar una inversión digital.",
			keywords: [
				"consultor tecnológico pequeñas empresas",
				"asesoría informática",
				"segunda opinión tecnológica",
				"gestión de proyectos IT",
				"consultoría informática freelance",
			],
			eyebrow: "Criterio técnico antes de invertir",
			title: "Consultor tecnológico para pequeñas empresas",
			intro:
				"Una decisión técnica mal acotada puede acabar en meses de coste, dependencia o software que nadie usa. Ayudo a pequeñas empresas a entender opciones, revisar propuestas y convertir una idea digital en un alcance razonable.",
			primaryCta: "Pedir una revisión",
			secondaryCta: "Ver asesoría informática",
			problem: {
				eyebrow: "Problema que resuelve",
				title: "Tomar decisiones digitales sin ir a ciegas",
				body: [
					"No todas las empresas necesitan contratar un equipo técnico. A veces basta con una revisión independiente para saber si un presupuesto encaja, si una tecnología tiene sentido o si el alcance está inflado.",
					"Trabajo como interlocutor técnico directo: traduzco riesgos, prioridades y alternativas a decisiones que el negocio pueda entender.",
				],
			},
			whenWorthIt: {
				title: "Cuándo merece la pena",
				items: [
					"Vas a invertir en una web, aplicación, automatización o integración y quieres validar el alcance.",
					"Tienes varios presupuestos y no sabes compararlos técnicamente.",
					"Un proyecto está bloqueado y necesitas una mirada externa.",
					"Quieres saber si conviene construir, comprar o simplificar.",
					"Necesitas ordenar requisitos antes de pedir presupuesto o empezar desarrollo.",
				],
			},
			cases: {
				title: "Casos habituales",
				intro:
					"La consultoría es útil cuando reduce incertidumbre antes de gastar más.",
				items: [
					{
						title: "Revisión de presupuesto",
						body: "Analizar alcance, dependencias, riesgos, entregables y puntos que deberían estar más claros.",
					},
					{
						title: "Definición de primera versión",
						body: "Separar lo imprescindible de lo aplazable para construir una base útil sin sobredimensionar.",
					},
					{
						title: "Segunda opinión técnica",
						body: "Revisar una arquitectura, proveedor, migración o decisión tecnológica antes de comprometerse.",
					},
					{
						title: "Acompañamiento de proyecto",
						body: "Ayudar a ordenar tareas, validar entregas y mantener conversación técnica con proveedores.",
					},
				],
			},
			builds: {
				title: "Qué puedes llevarte",
				items: [
					"Un diagnóstico claro del problema y las opciones reales.",
					"Una lista priorizada de funcionalidades para una primera versión.",
					"Preguntas concretas para pedir o revisar presupuestos.",
					"Riesgos técnicos y de mantenimiento explicados sin jerga innecesaria.",
					"Una recomendación práctica: construir, comprar, integrar o esperar.",
				],
			},
			process: {
				title: "Cómo trabajo",
				steps: [
					"Recojo contexto, objetivos, restricciones y materiales existentes.",
					"Reviso propuesta, web, flujo, arquitectura o necesidad con criterio técnico y de negocio.",
					"Devuelvo conclusiones accionables, no un documento largo para aparentar complejidad.",
					"Si encaja, puedo ayudar a ejecutar o coordinar la primera fase.",
				],
			},
			avoid: {
				title: "Qué conviene evitar",
				items: [
					"Comprar tecnología antes de entender el proceso.",
					"Pedir presupuesto con una idea demasiado abierta.",
					"Valorar propuestas solo por precio sin comparar alcance y mantenimiento.",
					"Delegar una decisión importante sin una explicación clara de riesgos.",
				],
			},
			relatedServicesTitle: "Servicios relacionados",
			relatedPostsTitle: "Lecturas relacionadas",
			relatedServiceKeys: [
				"it-consulting:1",
				"it-consulting:2",
				"it-consulting:0",
				"it-consulting:3",
			],
			relatedPosts: [
				{
					title: "Qué debe tener una web profesional para captar clientes",
					description:
						"Una checklist práctica para revisar si una web explica bien la oferta.",
					href: "/es/blog/que-debe-tener-web-profesional-para-captar-clientes/",
				},
				{
					title: "Cuánto cuesta crear una herramienta interna a medida",
					description:
						"Cómo estimar una primera versión sin inflar el proyecto.",
					href: "/es/blog/cuanto-cuesta-crear-herramienta-interna-a-medida/",
				},
				{
					title: "Monolito modular vs microservicios: qué elegiría",
					description:
						"Una decisión técnica frecuente explicada con sus trade-offs.",
					href: "/es/blog/monolito-modular-vs-microservicios/",
				},
			],
			faq: [
				{
					question: "¿Puede ser solo una revisión puntual?",
					answer:
						"Sí. Una sesión o revisión concreta puede ser suficiente para detectar riesgos, ordenar preguntas y decidir el siguiente paso.",
				},
				{
					question: "¿También ayudas a ejecutar después?",
					answer:
						"Si el proyecto encaja con mis servicios, puedo ayudar a construirlo. Si no, la revisión sigue siendo útil para hablar mejor con otros proveedores.",
				},
				{
					question: "¿Qué información hace falta para empezar?",
					answer:
						"Objetivo del negocio, problema actual, presupuesto aproximado si existe, herramientas usadas y cualquier propuesta o documento que ya tengas.",
				},
			],
			cta: {
				eyebrow: "Antes de decidir",
				title: "Podemos revisar la idea antes de invertir más",
				text: "Una mirada técnica externa puede ahorrar alcance innecesario, dependencia y semanas de prueba y error.",
				button: "Pedir segunda opinión",
			},
			schema: {
				serviceType: "Consultoría tecnológica para pequeñas empresas",
				areaServed: "España y remoto",
				audience: [
					"Pequeñas empresas",
					"Profesionales independientes",
					"Startups",
					"Responsables de negocio",
				],
			},
		},
		{
			slug: "integracion-herramientas-negocio",
			translationKey: "business-tools-integration",
			metaTitle:
				"Integración de herramientas de negocio | José Miguel Fernández",
			metaDescription:
				"Integración de herramientas de negocio para conectar CRM, formularios, pagos, hojas de cálculo, APIs y sistemas internos.",
			keywords: [
				"integración de herramientas de negocio",
				"integraciones API",
				"conectar CRM con web",
				"webhooks",
				"automatización de datos",
			],
			eyebrow: "Datos que se mueven sin copiar y pegar",
			title: "Integración de herramientas de negocio",
			intro:
				"Cuando la web, el CRM, los formularios, los pagos y las hojas de cálculo no se hablan bien, el equipo acaba haciendo de puente manual. Construyo integraciones para que los datos lleguen donde deben, con control de errores y trazabilidad.",
			primaryCta: "Revisar herramientas",
			secondaryCta: "Ver integraciones API",
			problem: {
				eyebrow: "Problema que resuelve",
				title: "Conectar sistemas sin perder datos por el camino",
				body: [
					"Una integración no es solo enviar datos de A a B. También hay que pensar en duplicados, reintentos, validaciones, cambios de API y avisos cuando algo falla.",
					"El objetivo es que la operación dependa menos de memoria, capturas, exportaciones y comprobaciones manuales.",
				],
			},
			whenWorthIt: {
				title: "Cuándo merece la pena",
				items: [
					"Los leads entran por la web y alguien los copia al CRM.",
					"Los pagos, pedidos o formularios tienen que crear tareas internas.",
					"Varias herramientas guardan datos parecidos y se desincronizan.",
					"Necesitas enviar información a una API externa de forma fiable.",
					"Los errores de integración hoy se descubren demasiado tarde.",
				],
			},
			cases: {
				title: "Casos habituales",
				intro:
					"Cada integración debe tener una responsabilidad clara y una forma de saber si ha funcionado.",
				items: [
					{
						title: "Web y CRM",
						body: "Enviar contactos cualificados con campos limpios, origen y estado inicial.",
					},
					{
						title: "Pagos y operaciones",
						body: "Crear tareas, avisos o registros internos cuando llega un pago, pedido o suscripción.",
					},
					{
						title: "APIs externas",
						body: "Consumir o exponer endpoints con autenticación, validación y manejo de errores.",
					},
					{
						title: "Sincronización de datos",
						body: "Mantener información alineada entre herramientas sin duplicar trabajo manual.",
					},
				],
			},
			builds: {
				title: "Qué se puede conectar",
				items: [
					"Formularios web, CRM, herramientas de email y hojas de cálculo.",
					"Pasarelas de pago, tiendas online y sistemas de pedidos.",
					"APIs propias o de terceros con autenticación y límites de uso.",
					"Webhooks para reaccionar a eventos de negocio.",
					"Paneles internos para revisar estados y errores.",
				],
			},
			process: {
				title: "Cómo trabajo",
				steps: [
					"Identifico qué sistema manda, cuál recibe y qué dato debe considerarse fuente fiable.",
					"Defino formato, validaciones, reintentos, trazabilidad y avisos de error.",
					"Construyo la integración con pruebas sobre casos normales y casos fallidos.",
					"Documento cómo mantenerla y qué señales revisar si una API cambia.",
				],
			},
			avoid: {
				title: "Qué conviene evitar",
				items: [
					"Conectar herramientas sin decidir qué pasa con datos duplicados.",
					"Depender de una automatización que no deja rastro cuando falla.",
					"Enviar datos sensibles sin revisar permisos, necesidad y almacenamiento.",
					"Montar integraciones frágiles sobre exportaciones manuales si existe una API fiable.",
				],
			},
			relatedServicesTitle: "Servicios relacionados",
			relatedPostsTitle: "Lecturas relacionadas",
			relatedServiceKeys: [
				"it-consulting:4",
				"it-consulting:5",
				"base:internal-tools",
				"base:backend-spring-boot",
			],
			relatedPosts: [
				{
					title: "APIs idempotentes que sobreviven a reintentos",
					description:
						"Cómo evitar duplicados en pagos, pedidos o trabajos repetidos.",
					href: "/es/blog/apis-idempotentes-que-sobreviven-a-reintentos/",
				},
				{
					title: "Cuándo usar Kafka, RabbitMQ o una base de datos",
					description:
						"Opciones para procesos asíncronos sin sobredimensionar la arquitectura.",
					href: "/es/blog/cuando-deberias-usar-kafka-rabbitmq-o-simplemente-una-base-de-datos/",
				},
				{
					title: "Spring Boot en producción: checklist DevOps",
					description:
						"Aspectos de configuración, observabilidad y despliegue para backends fiables.",
					href: "/es/blog/spring-boot-produccion-checklist-devops/",
				},
			],
			faq: [
				{
					question: "¿Qué pasa si una API externa falla?",
					answer:
						"Una integración seria debe contemplar errores, reintentos, avisos y una forma de revisar qué quedó pendiente.",
				},
				{
					question: "¿Se pueden conectar herramientas sin API?",
					answer:
						"A veces se puede mediante exportaciones, email o conectores existentes, pero conviene valorar la fiabilidad antes de depender de ello.",
				},
				{
					question: "¿También puedes crear una API propia?",
					answer:
						"Sí. Si el negocio necesita exponer datos o recibir eventos de forma ordenada, puedo construir una API o backend específico.",
				},
			],
			cta: {
				eyebrow: "Mapa de herramientas",
				title: "Cuéntame qué sistemas necesitas conectar",
				text: "Con una lista de herramientas y el flujo de datos actual se puede detectar rápido qué integración merece la pena abordar primero.",
				button: "Consultar integración",
			},
			schema: {
				serviceType: "Integración de herramientas de negocio",
				areaServed: "España y remoto",
				audience: [
					"Pymes",
					"Negocios digitales",
					"Equipos de operaciones",
					"Responsables técnicos",
				],
			},
		},
		{
			slug: "diseno-web-granada",
			translationKey: "local-web-design",
			metaTitle: "Diseño web Granada para captar clientes | José Miguel Fernández",
			metaDescription:
				"Diseño y desarrollo páginas web para negocios de Granada. Webs rápidas, claras y preparadas para convertir visitas en contactos.",
			keywords: [
				"diseño web Granada",
				"diseño web en Granada",
				"desarrollo web Granada",
				"diseño páginas web Granada",
				"diseñador web Granada",
			],
			eyebrow: "Diseño y desarrollo web en Granada",
			title: "Diseño web en Granada para captar clientes",
			intro:
				"Diseño webs para negocios de Granada que necesitan explicar bien su servicio y recibir contactos. Puedo trabajar con WordPress si quieres editar el contenido o con Astro si priorizas una web ligera y rápida.",
			primaryCta: "Valorar mi proyecto web",
			secondaryCta: "Ver trabajos",
			problem: {
				eyebrow: "Problema que resuelve",
				title: "Una web que explica tu negocio y facilita el contacto",
				body: [
					"Una web puede verse correcta y seguir sin ayudar a vender. Suele ocurrir cuando tarda en cargar, habla de forma genérica o esconde el contacto detrás de demasiadas páginas.",
					"Trabajo directamente contigo para ordenar la oferta, decidir qué debe aparecer primero y construir una página que puedas mantener después de publicarla.",
				],
			},
			whenWorthIt: {
				title: "Cuándo conviene rehacer o crear la web",
				items: [
					"Tu negocio depende de recomendaciones, pero Google apenas muestra tu web.",
					"Las visitas llegan y no entienden con rapidez qué haces o cómo pedir presupuesto.",
					"La web actual es lenta, difícil de editar o se rompe al actualizarla.",
					"Necesitas una página nueva para un servicio, campaña o zona concreta.",
					"Quieres centralizar formularios, analítica y contactos en una base propia.",
				],
			},
			cases: {
				title: "Proyectos web habituales",
				intro:
					"El alcance cambia según el punto de partida. Estas son las intervenciones que más suelo plantear.",
				items: [
					{
						title: "Web de servicios",
						body: "Una web clara para presentar el negocio, explicar cada servicio y llevar a la persona adecuada hasta el contacto.",
					},
					{
						title: "Landing de captación",
						body: "Una página centrada en una oferta concreta, con un recorrido corto y una acción principal fácil de encontrar.",
					},
					{
						title: "Rediseño y mejora",
						body: "Revisión de estructura, copy, velocidad y experiencia móvil sin perder el contenido que ya aporta valor.",
					},
					{
						title: "WordPress mantenible",
						body: "Una instalación editable con los plugins necesarios, una base limpia y un plan claro para actualizaciones y copias.",
					},
				],
			},
			builds: {
				title: "Qué puede incluir el proyecto",
				items: [
					"Arquitectura de contenidos y copy base para servicios.",
					"Diseño responsive adaptado a móvil y escritorio.",
					"Desarrollo en WordPress o Astro según la gestión que necesites.",
					"Formularios, analítica consentida y conexión con herramientas existentes.",
					"SEO técnico, rendimiento, publicación y una guía de uso.",
				],
			},
			process: {
				title: "Cómo planteo una web",
				steps: [
					"Reviso tu oferta, la web actual y el tipo de contacto que buscas.",
					"Defino páginas, contenido, plataforma y entregables antes de desarrollar.",
					"Construyo y revisamos primero los recorridos principales.",
					"Publico la web, compruebo formularios y te entrego accesos y documentación.",
				],
			},
			avoid: {
				title: "Lo que debe quedar claro antes de empezar",
				items: [
					"Qué servicios y páginas entran en el primer alcance.",
					"Quién prepara textos, imágenes, dominio y accesos.",
					"Qué podrás editar y qué mantenimiento necesitará la plataforma.",
					"Qué depende de la web y qué depende de campañas, reputación u otras fuentes de tráfico.",
				],
			},
			relatedServicesTitle: "Servicios relacionados",
			relatedPostsTitle: "Guías para preparar el proyecto",
			relatedServiceKeys: [
				"web-wordpress:0",
				"web-wordpress:5",
				"web-wordpress:1",
				"web-wordpress:2",
			],
			relatedPosts: [
				{
					title: "Qué debe tener una web profesional para captar clientes",
					description:
						"Una guía práctica para que una web explique mejor una oferta.",
					href: "/es/blog/que-debe-tener-web-profesional-para-captar-clientes/",
				},
				{
					title: "Cómo contratar a un desarrollador web freelance",
					description:
						"Qué revisar en alcance, propiedad, mantenimiento y forma de trabajo.",
					href: "/es/blog/contratar-desarrollador-freelance-web/",
				},
				{
					title: "Astro 7 y el rendimiento de una web moderna",
					description:
						"Qué cambia al construir una web ligera con una base estática moderna.",
					href: "/es/blog/astro-7-que-cambia-rendimiento-web-moderna/",
				},
			],
			faq: [
				{
					question: "¿Trabajas con negocios de Granada de forma presencial?",
					answer:
						"Puedo trabajar con negocios de Granada y organizar las reuniones necesarias. El seguimiento diario suele ser remoto para que decisiones, archivos y avances queden registrados.",
				},
				{
					question: "¿Cuánto cuesta una página web?",
					answer:
						"Depende del número de páginas, el contenido, la plataforma y las integraciones. Antes de presupuestar, acoto contigo una primera versión y separo lo necesario de las mejoras opcionales.",
				},
				{
					question: "¿Podré editar la web después?",
					answer:
						"Sí, si esa es una necesidad del proyecto. WordPress permite editar páginas y entradas; con Astro acordamos qué contenido debe ser editable y cuál conviene mantener en código.",
				},
			],
			cta: {
				eyebrow: "Valoración inicial",
				title: "Cuéntame qué debe conseguir tu web",
				text: "Envíame la web actual, los servicios que quieres presentar y el tipo de contacto que buscas. Te diré qué alcance veo razonable.",
				button: "Valorar mi proyecto web",
			},
			schema: {
				serviceType: "Diseño y desarrollo web",
				areaServed: "Granada, España y remoto",
				audience: [
					"Pymes",
					"Negocios de servicios",
					"Comercios",
					"Profesionales independientes",
				],
			},
		},
		...focusedCommercialLandingPages.es,
	],
	en: [
		{
			slug: "custom-software-small-businesses",
			translationKey: "custom-software-small-businesses",
			metaTitle: "Custom Software for Small Businesses | José Miguel Fernández",
			metaDescription:
				"Custom software for small businesses that need to organize workflows, replace spreadsheets or connect tools without unnecessary complexity.",
			keywords: [
				"custom software for small businesses",
				"custom web applications",
				"internal tools",
				"process automation",
				"freelance full-stack developer",
			],
			eyebrow: "Practical software for small teams",
			title: "Custom software for small businesses",
			intro:
				"When a spreadsheet, email thread or generic tool starts carrying too much operational weight, it is worth designing a clearer base. I build small, maintainable web applications and internal tools shaped around the real workflow.",
			primaryCta: "Tell me about the workflow",
			secondaryCta: "View related services",
			problem: {
				eyebrow: "Problem it solves",
				title: "Turning scattered workarounds into a useful tool",
				body: [
					"Most small businesses do not need a huge system. They need quotes, orders, tasks, issues, customers or internal data to stop depending on copy-paste between tabs.",
					"Custom software makes sense when the process already exists, but current tools force the team to work around it with manual checks, duplicates and repeated fixes.",
				],
			},
			whenWorthIt: {
				title: "When it is worth it",
				items: [
					"The team uses several spreadsheets for the same process and nobody knows which one is the source of truth.",
					"Errors happen because data is copied between forms, email, CRM or ERP.",
					"The business needs a clear view of statuses, owners, dates or amounts.",
					"A SaaS tool is too rigid or does not match the way the team actually works.",
					"You want a small first version before investing in a larger product.",
				],
			},
			cases: {
				title: "Common use cases",
				intro:
					"The starting point is usually a familiar task that already takes time every week.",
				items: [
					{
						title: "Internal dashboards",
						body: "Private views for customers, requests, orders, states or operational metrics without relying on a shared spreadsheet.",
					},
					{
						title: "Review workflows",
						body: "Work queues, approvals, comments and state changes so each person knows what needs attention.",
					},
					{
						title: "Simple data management",
						body: "Internal forms, validation, filters and exports that keep information easier to trust.",
					},
					{
						title: "Existing tool connections",
						body: "Integrations with forms, payments, CRMs, databases or APIs to reduce manual work.",
					},
				],
			},
			builds: {
				title: "What can be built",
				items: [
					"A private web application for one concrete workflow.",
					"An admin panel with basic roles and filterable data.",
					"A gradual replacement for a critical spreadsheet.",
					"A tool that connects forms, CRM, payments or a database.",
					"A first version that lets you measure real use before expanding scope.",
				],
			},
			process: {
				title: "How I work",
				steps: [
					"I map the current workflow, data, exceptions and friction points.",
					"I propose a small first version with clear deliverables and no decorative features.",
					"I build the tool with a maintainable base, validation and reasonable failure behavior.",
					"I document how to use it, what is out of scope and what would make sense to improve next.",
				],
			},
			avoid: {
				title: "What to avoid",
				items: [
					"Turning a first version into an improvised ERP.",
					"Automating a process that still changes every week.",
					"Building screens for every possible case before validating frequent cases.",
					"Copying a large tool when the business only needs to solve one workflow.",
				],
			},
			relatedServicesTitle: "Related services",
			relatedPostsTitle: "Related reading",
			relatedServiceKeys: [
				"it-consulting:3",
				"base:internal-tools",
				"it-consulting:5",
				"it-consulting:4",
			],
			relatedPosts: [
				{
					title: "When to build an internal tool instead of using Excel",
					description:
						"Practical signs that a spreadsheet is no longer enough.",
					href: "/en/blog/when-to-build-an-internal-tool-instead-of-using-excel/",
				},
				{
					title: "How much does a custom internal tool cost?",
					description:
						"What drives cost and how to think about a useful first version.",
					href: "/en/blog/how-much-does-a-custom-internal-tool-cost/",
				},
				{
					title: "When business process automation is worth it",
					description:
						"How to spot repeated tasks that can become reliable software.",
					href: "/en/blog/when-business-process-automation-is-worth-it/",
				},
			],
			faq: [
				{
					question: "Does every small business need custom software?",
					answer:
						"No. If an existing tool solves the workflow well, it is usually better to use it. Custom software makes sense when the process is important and current tools create manual work or errors.",
				},
				{
					question: "Can we start with a small version?",
					answer:
						"Yes. That is usually the healthiest path. A first version should solve the main workflow, not every possible case on day one.",
				},
				{
					question: "Can it connect with tools we already use?",
					answer:
						"Usually yes, if those tools provide an API, webhooks, exports or another reliable way to exchange data.",
				},
			],
			cta: {
				eyebrow: "First step",
				title: "Tell me which workflow you want to organize",
				text: "A short explanation of the current process is usually enough to see whether custom software, automation or a simpler solution makes sense.",
				button: "Discuss the project",
			},
			schema: {
				serviceType: "Custom software for small businesses",
				areaServed: "Spain and remote",
				audience: [
					"Small businesses",
					"Operations teams",
					"Independent professionals",
					"Startups",
				],
			},
		},
		{
			slug: "administrative-task-automation",
			translationKey: "administrative-task-automation",
			metaTitle: "Administrative Task Automation | José Miguel Fernández",
			metaDescription:
				"Administrative task automation for reducing manual copying, repeated emails, reports and data movement between business tools.",
			keywords: [
				"administrative task automation",
				"process automation",
				"email automation",
				"report automation",
				"API integrations",
			],
			eyebrow: "Less repeated work",
			title: "Administrative task automation",
			intro:
				"Small administrative tasks can feel unavoidable until they consume several hours every week. I help turn emails, forms, reports and data movement into more reliable workflows, with human review where it matters.",
			primaryCta: "Review a task",
			secondaryCta: "View automation services",
			problem: {
				eyebrow: "Problem it solves",
				title: "Reducing manual tasks that already have clear rules",
				body: [
					"A useful automation does not start with a tool. It starts by understanding what data comes in, what decision is made, what output is needed and where errors can appear.",
					"The goal is not to remove judgment from the team. It is to reserve that judgment for the cases that actually need it.",
				],
			},
			whenWorthIt: {
				title: "When it is worth it",
				items: [
					"You copy data from forms into sheets, CRMs, emails or internal tools.",
					"You generate similar reports every week or month.",
					"Responses, reminders or tasks follow the same pattern repeatedly.",
					"You need to catch errors before they reach a client.",
					"The team loses time checking whether something has already been done.",
				],
			},
			cases: {
				title: "Common use cases",
				intro:
					"The best first automations are usually concrete and easy to measure.",
				items: [
					{
						title: "Forms and CRM",
						body: "Send clean form data to a CRM, spreadsheet, email inbox or internal panel.",
					},
					{
						title: "Emails and alerts",
						body: "Create replies, reminders or notifications when a status changes or information is missing.",
					},
					{
						title: "Operational reports",
						body: "Collect data and generate periodic summaries without assembling the report by hand.",
					},
					{
						title: "AI-assisted classification",
						body: "Classify messages, extract data or prepare drafts with human review when the risk calls for it.",
					},
				],
			},
			builds: {
				title: "What can be automated",
				items: [
					"Data entry from forms, emails or structured documents.",
					"Synchronization between CRMs, spreadsheets, databases and SaaS tools.",
					"Internal alerts when information is missing or an error appears.",
					"Report, summary or draft generation.",
					"Scheduled jobs that review data and run repeated tasks.",
				],
			},
			process: {
				title: "How I work",
				steps: [
					"I identify the exact point where time is lost or the error repeats.",
					"I define inputs, outputs, rules, exceptions and the right level of supervision.",
					"I build the workflow with logs, alerts and a clear way to detect failures.",
					"I document when the team can trust the automation and when it should review.",
				],
			},
			avoid: {
				title: "What to avoid",
				items: [
					"Automating decisions that do not have stable rules yet.",
					"Creating an invisible workflow that fails silently.",
					"Connecting tools without thinking about duplicates, retries or incomplete data.",
					"Using AI where a simple rule would be more reliable and easier to maintain.",
				],
			},
			relatedServicesTitle: "Related services",
			relatedPostsTitle: "Related reading",
			relatedServiceKeys: [
				"it-consulting:5",
				"it-consulting:4",
				"ai-automation:2",
				"base:internal-tools",
			],
			relatedPosts: [
				{
					title: "When business process automation is worth it",
					description:
						"A guide to deciding which repeated tasks should be automated first.",
					href: "/en/blog/when-business-process-automation-is-worth-it/",
				},
				{
					title: "How to use AI in your product without hype",
					description:
						"Where AI helps, and which limits are worth keeping in place.",
					href: "/en/blog/using-ai-in-your-product-without-hype/",
				},
				{
					title: "Idempotent APIs that survive retries",
					description:
						"Patterns that keep integrations from creating duplicates after failures.",
					href: "/en/blog/idempotent-apis-that-survive-retries/",
				},
			],
			faq: [
				{
					question: "Which administrative tasks are usually automated first?",
					answer:
						"Tasks with clear rules: moving data, creating alerts, generating reports, sending replies or checking statuses.",
				},
				{
					question: "Does automation remove human review?",
					answer:
						"Not always. In many workflows the automation should prepare, classify or alert, while a person reviews the delicate cases.",
				},
				{
					question: "Do we need to replace all our tools?",
					answer:
						"Usually no. The practical first step is often to connect the current tools better before replacing them.",
				},
			],
			cta: {
				eyebrow: "Find the first workflow",
				title: "We can start with one repeated task",
				text: "If you explain what you copy, where you paste it and what checks you make, I can help you see whether it is worth automating.",
				button: "Ask about automation",
			},
			schema: {
				serviceType: "Administrative task automation",
				areaServed: "Spain and remote",
				audience: [
					"Small businesses",
					"Administrative teams",
					"Operations managers",
					"Service businesses",
				],
			},
		},
		{
			slug: "technology-consultant-small-businesses",
			translationKey: "technology-consultant-small-businesses",
			metaTitle:
				"Technology Consultant for Small Businesses | José Miguel Fernández",
			metaDescription:
				"Technology consultant for small businesses that need to decide what to build, review providers or scope a digital investment.",
			keywords: [
				"technology consultant small businesses",
				"IT advisory",
				"technology second opinion",
				"IT project management",
				"freelance IT consulting",
			],
			eyebrow: "Technical judgment before investing",
			title: "Technology consultant for small businesses",
			intro:
				"A poorly scoped technical decision can turn into months of cost, dependency or software nobody uses. I help small businesses understand options, review proposals and turn digital ideas into reasonable scope.",
			primaryCta: "Request a review",
			secondaryCta: "View IT advisory",
			problem: {
				eyebrow: "Problem it solves",
				title: "Making digital decisions without guessing",
				body: [
					"Not every business needs to hire a technical team. Sometimes an independent review is enough to know whether a quote is reasonable, a technology fits or the scope is inflated.",
					"I work as a direct technical counterpart, translating risks, priorities and alternatives into decisions the business can understand.",
				],
			},
			whenWorthIt: {
				title: "When it is worth it",
				items: [
					"You are about to invest in a website, application, automation or integration and want to validate the scope.",
					"You have several quotes and do not know how to compare them technically.",
					"A project is blocked and you need an external view.",
					"You want to know whether to build, buy or simplify.",
					"You need to organize requirements before requesting a quote or starting development.",
				],
			},
			cases: {
				title: "Common use cases",
				intro:
					"Consulting is useful when it reduces uncertainty before you spend more.",
				items: [
					{
						title: "Quote review",
						body: "Analyze scope, dependencies, risks, deliverables and points that should be clearer.",
					},
					{
						title: "First version definition",
						body: "Separate the essential from the deferrable to build a useful base without oversizing.",
					},
					{
						title: "Technical second opinion",
						body: "Review an architecture, provider, migration or technical decision before committing.",
					},
					{
						title: "Project support",
						body: "Help organize tasks, validate deliverables and keep the technical conversation grounded.",
					},
				],
			},
			builds: {
				title: "What you can get",
				items: [
					"A clear diagnosis of the problem and realistic options.",
					"A prioritized feature list for a first version.",
					"Concrete questions for requesting or reviewing quotes.",
					"Technical and maintenance risks explained without unnecessary jargon.",
					"A practical recommendation: build, buy, integrate or wait.",
				],
			},
			process: {
				title: "How I work",
				steps: [
					"I gather context, goals, constraints and existing material.",
					"I review the proposal, website, workflow, architecture or need with technical and business judgment.",
					"I return actionable conclusions, not a long document designed to look complex.",
					"If it fits, I can help execute or coordinate the first phase.",
				],
			},
			avoid: {
				title: "What to avoid",
				items: [
					"Buying technology before understanding the process.",
					"Asking for quotes with an idea that is too open.",
					"Comparing proposals only by price without comparing scope and maintenance.",
					"Delegating an important decision without a clear explanation of risks.",
				],
			},
			relatedServicesTitle: "Related services",
			relatedPostsTitle: "Related reading",
			relatedServiceKeys: [
				"it-consulting:1",
				"it-consulting:2",
				"it-consulting:0",
				"it-consulting:3",
			],
			relatedPosts: [
				{
					title: "What a professional website needs to get clients",
					description:
						"A practical checklist for reviewing whether a website explains the offer.",
					href: "/en/blog/what-a-professional-website-needs-to-get-clients/",
				},
				{
					title: "How much does a custom internal tool cost?",
					description:
						"How to estimate a first version without inflating the project.",
					href: "/en/blog/how-much-does-a-custom-internal-tool-cost/",
				},
				{
					title: "Modular monolith vs microservices",
					description:
						"A common technical decision explained through trade-offs.",
					href: "/en/blog/modular-monolith-vs-microservices/",
				},
			],
			faq: [
				{
					question: "Can this be a one-off review?",
					answer:
						"Yes. A focused session or review can be enough to spot risks, organize questions and decide the next step.",
				},
				{
					question: "Can you also help execute afterwards?",
					answer:
						"If the project fits my services, I can help build it. If not, the review should still help you speak more clearly with other providers.",
				},
				{
					question: "What information do you need to start?",
					answer:
						"Business goal, current problem, approximate budget if there is one, tools being used and any proposal or document you already have.",
				},
			],
			cta: {
				eyebrow: "Before deciding",
				title: "We can review the idea before you invest more",
				text: "An external technical view can save unnecessary scope, dependency and weeks of trial and error.",
				button: "Request a second opinion",
			},
			schema: {
				serviceType: "Technology consulting for small businesses",
				areaServed: "Spain and remote",
				audience: [
					"Small businesses",
					"Independent professionals",
					"Startups",
					"Business owners",
				],
			},
		},
		{
			slug: "business-tools-integration",
			translationKey: "business-tools-integration",
			metaTitle: "Business Tools Integration | José Miguel Fernández",
			metaDescription:
				"Business tools integration for connecting CRMs, forms, payments, spreadsheets, APIs and internal systems with reliable data flow.",
			keywords: [
				"business tools integration",
				"API integrations",
				"connect CRM with website",
				"webhooks",
				"data automation",
			],
			eyebrow: "Data that moves without copy-paste",
			title: "Business tools integration",
			intro:
				"When the website, CRM, forms, payments and spreadsheets do not talk to each other, the team becomes the manual bridge. I build integrations so data reaches the right place, with error handling and traceability.",
			primaryCta: "Review your tools",
			secondaryCta: "View API integrations",
			problem: {
				eyebrow: "Problem it solves",
				title: "Connecting systems without losing data on the way",
				body: [
					"An integration is not just sending data from A to B. Duplicates, retries, validation, API changes and failure alerts matter too.",
					"The goal is for operations to depend less on memory, screenshots, exports and manual checks.",
				],
			},
			whenWorthIt: {
				title: "When it is worth it",
				items: [
					"Leads arrive through the website and someone copies them into the CRM.",
					"Payments, orders or forms need to create internal tasks.",
					"Several tools store similar data and drift out of sync.",
					"You need to send information to an external API reliably.",
					"Integration errors are currently discovered too late.",
				],
			},
			cases: {
				title: "Common use cases",
				intro:
					"Each integration should have a clear responsibility and a way to know whether it worked.",
				items: [
					{
						title: "Website and CRM",
						body: "Send qualified contacts with clean fields, source and initial status.",
					},
					{
						title: "Payments and operations",
						body: "Create tasks, alerts or internal records when a payment, order or subscription arrives.",
					},
					{
						title: "External APIs",
						body: "Consume or expose endpoints with authentication, validation and error handling.",
					},
					{
						title: "Data synchronization",
						body: "Keep information aligned between tools without duplicating manual work.",
					},
				],
			},
			builds: {
				title: "What can be connected",
				items: [
					"Website forms, CRMs, email tools and spreadsheets.",
					"Payment providers, online stores and order systems.",
					"First-party or third-party APIs with authentication and usage limits.",
					"Webhooks that react to business events.",
					"Internal panels for reviewing statuses and errors.",
				],
			},
			process: {
				title: "How I work",
				steps: [
					"I identify which system sends, which receives and which data source should be trusted.",
					"I define format, validation, retries, traceability and failure alerts.",
					"I build the integration with tests for normal and failed cases.",
					"I document how to maintain it and what to watch if an API changes.",
				],
			},
			avoid: {
				title: "What to avoid",
				items: [
					"Connecting tools without deciding what happens to duplicate data.",
					"Depending on an automation that leaves no trace when it fails.",
					"Sending sensitive data without reviewing permissions, need and storage.",
					"Building fragile integrations on manual exports when a reliable API exists.",
				],
			},
			relatedServicesTitle: "Related services",
			relatedPostsTitle: "Related reading",
			relatedServiceKeys: [
				"it-consulting:4",
				"it-consulting:5",
				"base:internal-tools",
				"base:backend-spring-boot",
			],
			relatedPosts: [
				{
					title: "Idempotent APIs that survive retries",
					description:
						"How to avoid duplicates in payments, orders or repeated jobs.",
					href: "/en/blog/idempotent-apis-that-survive-retries/",
				},
				{
					title: "When should you use Kafka, RabbitMQ or a database?",
					description:
						"Options for async workflows without oversizing the architecture.",
					href: "/en/blog/when-should-you-use-kafka-rabbitmq-or-just-a-database/",
				},
				{
					title: "Spring Boot in production: a DevOps checklist",
					description:
						"Configuration, observability and deployment checks for reliable backends.",
					href: "/en/blog/spring-boot-production-devops-checklist/",
				},
			],
			faq: [
				{
					question: "What happens if an external API fails?",
					answer:
						"A serious integration should include errors, retries, alerts and a way to review what remains pending.",
				},
				{
					question: "Can tools be connected without an API?",
					answer:
						"Sometimes, through exports, email or existing connectors, but reliability should be checked before depending on it.",
				},
				{
					question: "Can you also create our own API?",
					answer:
						"Yes. If the business needs to expose data or receive events cleanly, I can build a dedicated API or backend.",
				},
			],
			cta: {
				eyebrow: "Tool map",
				title: "Tell me which systems need to connect",
				text: "With a list of tools and the current data flow, it is usually quick to see which integration should come first.",
				button: "Ask about integration",
			},
			schema: {
				serviceType: "Business tools integration",
				areaServed: "Spain and remote",
				audience: [
					"Small businesses",
					"Digital businesses",
					"Operations teams",
					"Technical leads",
				],
			},
		},
		{
			slug: "web-design-granada",
			translationKey: "local-web-design",
			metaTitle: "Web design in Granada for businesses | José Miguel Fernández",
			metaDescription:
				"Web design and development for businesses in Granada. Fast, clear websites built to turn visits into useful enquiries.",
			keywords: [
				"web design Granada",
				"web designer Granada",
				"website design Granada",
				"web development Granada",
			],
			eyebrow: "Web design and development in Granada",
			title: "Web design in Granada for businesses",
			intro:
				"I design websites for businesses in Granada that need to explain their service clearly and receive better enquiries. I can use WordPress when you need to edit content or Astro when a lean, fast website is the better fit.",
			primaryCta: "Assess my website project",
			secondaryCta: "View projects",
			problem: {
				eyebrow: "Problem it solves",
				title: "A website that explains the business and makes contact easy",
				body: [
					"A website can look respectable and still do little for sales. Common causes are slow pages, vague copy and contact details hidden behind too many clicks.",
					"I work directly with you to order the offer, decide what visitors need first and build a site you can maintain after launch.",
				],
			},
			whenWorthIt: {
				title: "When a new website or redesign makes sense",
				items: [
					"Your business relies on referrals and Google rarely shows your website.",
					"Visitors arrive but cannot tell quickly what you do or how to ask for a quote.",
					"The current site is slow, hard to edit or fragile when updated.",
					"You need a focused page for a service, campaign or local market.",
					"You want forms, consented analytics and enquiries under your control.",
				],
			},
			cases: {
				title: "Common website projects",
				intro:
					"The scope depends on what already exists. These are the types of project I most often propose.",
				items: [
					{
						title: "Service website",
						body: "A clear site that presents the business, explains each service and guides the right visitor towards contact.",
					},
					{
						title: "Lead-generation landing page",
						body: "One focused offer, a short journey and a primary action that visitors can find without searching.",
					},
					{
						title: "Website redesign",
						body: "A review of structure, copy, speed and mobile use that keeps existing content with genuine value.",
					},
					{
						title: "Maintainable WordPress",
						body: "An editable installation with only the plugins it needs, a clean base and a clear update and backup plan.",
					},
				],
			},
			builds: {
				title: "What the project can include",
				items: [
					"Content structure and working copy for service pages.",
					"Responsive design for mobile and desktop.",
					"WordPress or Astro development based on how you need to manage content.",
					"Forms, consented analytics and connections to existing tools.",
					"Technical SEO, performance checks, launch and a practical handover.",
				],
			},
			process: {
				title: "How I approach a website",
				steps: [
					"I review your offer, current site and the type of enquiry you want.",
					"I define pages, content, platform and deliverables before development.",
					"I build the site and we review the main visitor journeys first.",
					"I launch it, test the forms and hand over access and documentation.",
				],
			},
			avoid: {
				title: "What should be clear before work starts",
				items: [
					"Which services and pages belong in the first scope.",
					"Who supplies copy, images, domain access and existing accounts.",
					"What you will edit and what maintenance the platform will need.",
					"What the website can influence and what depends on campaigns, reputation or other traffic sources.",
				],
			},
			relatedServicesTitle: "Related services",
			relatedPostsTitle: "Guides for planning the project",
			relatedServiceKeys: [
				"web-wordpress:0",
				"web-wordpress:5",
				"web-wordpress:1",
				"web-wordpress:2",
			],
			relatedPosts: [
				{
					title: "What a professional website needs to get clients",
					description:
						"A practical guide to helping a website explain an offer better.",
					href: "/en/blog/what-a-professional-website-needs-to-get-clients/",
				},
				{
					title: "How to hire a freelance web developer",
					description:
						"What to review in scope, ownership, maintenance and ways of working.",
					href: "/en/blog/hire-freelance-web-developer-business/",
				},
				{
					title: "Astro 7 and modern website performance",
					description:
						"What changes when a website uses a lean modern static foundation.",
					href: "/en/blog/astro-7-what-changed-performance-modern-web/",
				},
			],
			faq: [
				{
					question: "Do you work with Granada businesses in person?",
					answer:
						"I can work with businesses in Granada and arrange the meetings a project needs. Day-to-day follow-up is usually remote so decisions, files and progress stay recorded.",
				},
				{
					question: "How much does a website cost?",
					answer:
						"It depends on the number of pages, the content, the platform and any integrations. Before quoting, I define a useful first scope and separate essential work from optional improvements.",
				},
				{
					question: "Will I be able to edit the website?",
					answer:
						"Yes, when that is part of the project. WordPress lets you edit pages and posts; with Astro we agree which content should be editable and what is better maintained in code.",
				},
			],
			cta: {
				eyebrow: "Initial assessment",
				title: "Tell me what the website needs to achieve",
				text: "Send me the current site, the services you want to present and the type of enquiry you need. I will tell you what scope looks reasonable.",
				button: "Assess my website project",
			},
			schema: {
				serviceType: "Web design and development",
				areaServed: "Granada, Spain and remote",
				audience: [
					"Small businesses",
					"Service businesses",
					"Local shops",
					"Independent professionals",
				],
			},
		},
		...focusedCommercialLandingPages.en,
	],
} satisfies Record<Locale, CommercialLandingPage[]>;

export const getCommercialLandingPages = (locale: Locale) =>
	commercialLandingPages[locale];

export const getCommercialLanding = (locale: Locale, slug: string) =>
	getCommercialLandingPages(locale).find((page) => page.slug === slug);

export const getCommercialLandingAlternatePaths = (
	locale: Locale,
	page: CommercialLandingPage,
): Partial<Record<Locale, string>> => {
	const paths: Partial<Record<Locale, string>> = {
		[locale]: `/${locale}/${page.slug}/`,
	};

	for (const alternateLocale of ["en", "es"] as const) {
		if (alternateLocale === locale) continue;
		const alternate = getCommercialLandingPages(alternateLocale).find(
			(item) => item.translationKey === page.translationKey,
		);
		if (alternate) {
			paths[alternateLocale] = `/${alternateLocale}/${alternate.slug}/`;
		}
	}

	return paths;
};
