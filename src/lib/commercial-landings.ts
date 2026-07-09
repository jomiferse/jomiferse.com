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
			slug: "desarrollador-freelance-espana",
			translationKey: "freelance-developer-spain",
			metaTitle: "Desarrollador freelance en España | José Miguel Fernández",
			metaDescription:
				"Desarrollador freelance en España para webs, software a medida, automatizaciones, integraciones API y backend Java/Spring Boot.",
			keywords: [
				"desarrollador freelance España",
				"desarrollador full-stack freelance",
				"desarrollador web freelance",
				"backend Spring Boot",
				"software a medida",
			],
			eyebrow: "Full-stack freelance con base backend",
			title: "Desarrollador freelance en España",
			intro:
				"Trabajo con empresas, startups y profesionales que necesitan convertir una necesidad digital en una solución concreta. Puedo ayudar con webs profesionales, software a medida, herramientas internas, automatizaciones, integraciones API y backends con Java/Spring Boot.",
			primaryCta: "Hablar de tu proyecto",
			secondaryCta: "Ver servicios",
			problem: {
				eyebrow: "Problema que resuelve",
				title: "Un perfil técnico directo para avanzar sin estructura grande",
				body: [
					"Hay proyectos que no necesitan una agencia completa ni un equipo permanente. Necesitan una persona técnica que entienda el problema, acote el alcance y construya una solución mantenible.",
					"Mi enfoque combina criterio de producto, base backend y capacidad full-stack para trabajar tanto en la interfaz como en los datos, APIs e integraciones.",
				],
			},
			whenWorthIt: {
				title: "Cuándo merece la pena",
				items: [
					"Necesitas una web clara y rápida para vender mejor un servicio.",
					"Quieres construir una herramienta interna o una primera versión de producto.",
					"Hay tareas repetitivas que podrían automatizarse con criterio técnico.",
					"Necesitas conectar herramientas, APIs, formularios, CRM o pagos.",
					"Buscas apoyo backend o full-stack sin contratar un equipo entero.",
				],
			},
			cases: {
				title: "Casos habituales",
				intro:
					"El encaje suele estar en proyectos concretos, con alcance razonable y necesidad real de entrega.",
				items: [
					{
						title: "Webs profesionales",
						body: "Sitios de servicios, landings y rediseños que explican mejor la oferta y facilitan el contacto.",
					},
					{
						title: "Aplicaciones web",
						body: "Herramientas privadas, paneles, flujos de revisión y primeras versiones de producto.",
					},
					{
						title: "Automatización e integraciones",
						body: "Conexión de herramientas, reducción de tareas manuales y flujos con APIs o IA aplicada.",
					},
					{
						title: "Backend mantenible",
						body: "APIs, servicios e integraciones con Java, Spring Boot, TypeScript y bases de datos.",
					},
				],
			},
			builds: {
				title: "Qué puedo construir o mejorar",
				items: [
					"Webs de negocio, landings y páginas de servicio orientadas a captación.",
					"Software a medida y herramientas internas para procesos concretos.",
					"Automatizaciones con APIs, webhooks, jobs, scripts o IA aplicada.",
					"Integraciones entre web, CRM, pagos, bases de datos y herramientas SaaS.",
					"Backends Java/Spring Boot, APIs REST y mejoras de sistemas existentes.",
				],
			},
			process: {
				title: "Cómo trabajo",
				steps: [
					"Entiendo el problema antes de proponer tecnología.",
					"Acoto una primera versión útil con entregables claros.",
					"Construyo con una base técnica que se pueda mantener después.",
					"Comunico avances, riesgos y decisiones sin esconder complejidad.",
				],
			},
			avoid: {
				title: "Qué conviene evitar",
				items: [
					"Empezar con una solución grande cuando una primera versión pequeña puede validar el camino.",
					"Construir funcionalidades sin saber qué decisión o proceso van a mejorar.",
					"Elegir tecnología por moda en vez de por mantenimiento, equipo y contexto.",
					"Prometer resultados comerciales que dependen de factores fuera del desarrollo.",
				],
			},
			relatedServicesTitle: "Servicios relacionados",
			relatedPostsTitle: "Lecturas relacionadas",
			relatedServiceKeys: [
				"web-wordpress:0",
				"it-consulting:3",
				"it-consulting:5",
				"base:backend-spring-boot",
			],
			relatedPosts: [
				{
					title: "Qué debe tener una web profesional para captar clientes",
					description:
						"Una guía práctica para que una web explique mejor una oferta.",
					href: "/es/blog/que-debe-tener-web-profesional-para-captar-clientes/",
				},
				{
					title: "Arquitectura Hexagonal en proyectos backend",
					description:
						"Cómo pensar sistemas backend mantenibles con puertos y adaptadores.",
					href: "/es/blog/arquitectura-hexagonal-que-es-como-aplicarla-proyectos-backend/",
				},
				{
					title: "Spring Boot en producción: checklist DevOps",
					description:
						"Una checklist para publicar backends con configuración y observabilidad.",
					href: "/es/blog/spring-boot-produccion-checklist-devops/",
				},
			],
			faq: [
				{
					question: "¿Trabajas solo en España?",
					answer:
						"Estoy en España y puedo trabajar en remoto con clientes de otras ubicaciones. La web prioriza España por idioma, contexto y posicionamiento.",
				},
				{
					question: "¿Qué tipo de proyectos encajan mejor?",
					answer:
						"Proyectos con un problema concreto: una web que debe vender mejor, una herramienta interna, una automatización, una integración o un backend que necesita evolucionar.",
				},
				{
					question: "¿Puedes trabajar con equipos técnicos existentes?",
					answer:
						"Sí. Puedo entrar como apoyo full-stack o backend, siempre que el alcance y responsabilidades estén claros.",
				},
			],
			cta: {
				eyebrow: "Contacto",
				title: "Hablemos si tienes un problema concreto",
				text: "No hace falta tener todo definido. Basta con explicar qué quieres mejorar, qué existe ahora y qué resultado sería útil.",
				button: "Contactar",
			},
			schema: {
				serviceType: "Desarrollo full-stack freelance",
				areaServed: "España y remoto",
				audience: [
					"Pymes",
					"Startups",
					"Equipos técnicos",
					"Profesionales independientes",
				],
			},
		},
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
			slug: "freelance-developer-spain",
			translationKey: "freelance-developer-spain",
			metaTitle: "Freelance Developer in Spain | José Miguel Fernández",
			metaDescription:
				"Freelance developer in Spain for websites, custom software, automation, API integrations and Java/Spring Boot backend systems.",
			keywords: [
				"freelance developer Spain",
				"freelance full-stack developer",
				"freelance web developer",
				"Spring Boot backend",
				"custom software",
			],
			eyebrow: "Freelance full-stack with backend depth",
			title: "Freelance developer in Spain",
			intro:
				"I work with businesses, startups and professionals that need to turn a digital need into a concrete solution. I can help with professional websites, custom software, internal tools, automation, API integrations and Java/Spring Boot backends.",
			primaryCta: "Discuss your project",
			secondaryCta: "View services",
			problem: {
				eyebrow: "Problem it solves",
				title:
					"A direct technical profile to move forward without a large structure",
				body: [
					"Some projects do not need a full agency or a permanent team. They need a technical person who can understand the problem, scope the work and build a maintainable solution.",
					"My approach combines product judgment, backend depth and full-stack delivery across interface, data, APIs and integrations.",
				],
			},
			whenWorthIt: {
				title: "When it is worth it",
				items: [
					"You need a clear, fast website that sells a service better.",
					"You want to build an internal tool or first product version.",
					"Repeated tasks could be automated with technical judgment.",
					"You need to connect tools, APIs, forms, CRMs or payments.",
					"You need backend or full-stack support without hiring a whole team.",
				],
			},
			cases: {
				title: "Common use cases",
				intro:
					"The best fit is usually a concrete project with reasonable scope and a real need to ship.",
				items: [
					{
						title: "Professional websites",
						body: "Service websites, landing pages and redesigns that explain the offer and make contact easier.",
					},
					{
						title: "Web applications",
						body: "Private tools, panels, review workflows and first product versions.",
					},
					{
						title: "Automation and integrations",
						body: "Connecting tools, reducing manual work and building workflows with APIs or applied AI.",
					},
					{
						title: "Maintainable backend",
						body: "APIs, services and integrations with Java, Spring Boot, TypeScript and databases.",
					},
				],
			},
			builds: {
				title: "What I can build or improve",
				items: [
					"Business websites, landing pages and service pages focused on qualified contact.",
					"Custom software and internal tools for concrete workflows.",
					"Automations with APIs, webhooks, jobs, scripts or applied AI.",
					"Integrations between websites, CRMs, payments, databases and SaaS tools.",
					"Java/Spring Boot backends, REST APIs and improvements to existing systems.",
				],
			},
			process: {
				title: "How I work",
				steps: [
					"I understand the problem before proposing technology.",
					"I scope a useful first version with clear deliverables.",
					"I build on a technical base that can be maintained afterwards.",
					"I communicate progress, risks and decisions without hiding complexity.",
				],
			},
			avoid: {
				title: "What to avoid",
				items: [
					"Starting with a large solution when a small first version can validate the path.",
					"Building features without knowing which decision or workflow they improve.",
					"Choosing technology because it is fashionable instead of maintainable.",
					"Promising commercial results that depend on factors outside development.",
				],
			},
			relatedServicesTitle: "Related services",
			relatedPostsTitle: "Related reading",
			relatedServiceKeys: [
				"web-wordpress:0",
				"it-consulting:3",
				"it-consulting:5",
				"base:backend-spring-boot",
			],
			relatedPosts: [
				{
					title: "What a professional website needs to get clients",
					description:
						"A practical guide to helping a website explain an offer better.",
					href: "/en/blog/what-a-professional-website-needs-to-get-clients/",
				},
				{
					title: "Hexagonal Architecture in backend projects",
					description:
						"How to think about maintainable backend systems with ports and adapters.",
					href: "/en/blog/hexagonal-architecture-what-it-is-how-to-apply-backend-projects/",
				},
				{
					title: "Spring Boot in production: a DevOps checklist",
					description:
						"A checklist for shipping backends with configuration and observability.",
					href: "/en/blog/spring-boot-production-devops-checklist/",
				},
			],
			faq: [
				{
					question: "Do you only work in Spain?",
					answer:
						"I am based in Spain and can work remotely with clients elsewhere. The site prioritizes Spain because of language, context and positioning.",
				},
				{
					question: "Which projects fit best?",
					answer:
						"Projects with a concrete problem: a website that should sell better, an internal tool, an automation, an integration or a backend that needs to evolve.",
				},
				{
					question: "Can you work with existing technical teams?",
					answer:
						"Yes. I can join as full-stack or backend support, as long as scope and responsibilities are clear.",
				},
			],
			cta: {
				eyebrow: "Contact",
				title: "Let's talk if you have a concrete problem",
				text: "You do not need everything defined. It is enough to explain what you want to improve, what exists now and what outcome would be useful.",
				button: "Contact me",
			},
			schema: {
				serviceType: "Freelance full-stack development",
				areaServed: "Spain and remote",
				audience: [
					"Small businesses",
					"Startups",
					"Technical teams",
					"Independent professionals",
				],
			},
		},
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
