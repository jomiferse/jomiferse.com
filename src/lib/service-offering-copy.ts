import type { Locale } from "@/i18n";
import type { ServiceItem } from "@/lib/services";

type ServiceOfferingCopy = Pick<
	ServiceItem,
	| "metaTitle"
	| "metaDescription"
	| "overview"
	| "problem"
	| "benefits"
	| "whenNeeded"
	| "whoFor"
	| "builds"
	| "process"
	| "whyMe"
	| "faq"
>;

const copy: Record<Locale, Record<string, ServiceOfferingCopy>> = {
	es: {
		"it-consulting:1": {
			metaTitle: "Asesoría informática para decidir tu próximo paso",
			metaDescription:
				"Asesoría informática independiente para comparar opciones, revisar riesgos y definir un alcance técnico antes de invertir.",
			overview: [
				"La asesoría informática ayuda a tomar una decisión técnica cuando el problema o las opciones todavía no están claros.",
				"Revisamos objetivos, restricciones y alternativas. La entrega es una recomendación razonada, un alcance inicial y criterios para decidir qué hacer después. La implementación se presupuesta aparte.",
			],
			problem:
				"Necesitas decidir qué construir, contratar o cambiar, pero aún no tienes suficiente claridad para comprometer el presupuesto.",
			benefits: [
				{
					title: "Opciones comparables",
					body: "Comparamos enfoques por ajuste, coste, dependencias, riesgo y mantenimiento, no solo por tecnología.",
				},
				{
					title: "Un primer alcance concreto",
					body: "Separamos lo necesario ahora de las mejoras que pueden esperar y dejamos claros los supuestos.",
				},
				{
					title: "Una decisión que puedes explicar",
					body: "Recibes conclusiones, preguntas pendientes y criterios para valorar una propuesta o el siguiente paso.",
				},
			],
			whenNeeded: [
				"Tienes varias propuestas y necesitas comparar alcance, riesgos y costes.",
				"No sabes si ampliar una herramienta existente o construir una solución propia.",
				"Un proyecto se ha atascado y necesitas ordenar dependencias y prioridades.",
				"Quieres validar la arquitectura o el plan antes de aprobar la implementación.",
			],
			whoFor: [
				"Pequeñas empresas que preparan una inversión tecnológica.",
				"Fundadores que necesitan acotar una primera versión de producto.",
				"Equipos que quieren una revisión independiente de un proveedor o plan técnico.",
			],
			builds: [
				"Revisión del contexto, objetivos, restricciones y material disponible.",
				"Comparación de alternativas y sus implicaciones técnicas y operativas.",
				"Documento breve con recomendación, riesgos y supuestos.",
				"Alcance inicial y criterios de aceptación para el siguiente paso.",
			],
			process: [
				"Compartir el problema, la decisión pendiente y la información disponible.",
				"Acordar qué preguntas debe responder la revisión y qué queda fuera.",
				"Contrastar opciones, costes, dependencias y riesgos relevantes.",
				"Entregar conclusiones y revisar contigo el siguiente paso recomendado.",
			],
			whyMe: [
				"Combino asesoría con experiencia práctica desarrollando y manteniendo software.",
				"Las recomendaciones consideran implementación, operación e integración, no solo la elección de herramientas.",
				"La asesoría termina con decisiones y un alcance; el desarrollo se acuerda y presupuesta por separado.",
			],
			faq: [
				{
					question: "¿La asesoría incluye desarrollar el software?",
					answer:
						"No. Incluye revisar el contexto, comparar opciones y definir un siguiente paso. Si después quieres implementar la solución, se acuerda como un proyecto aparte.",
				},
				{
					question: "¿Qué recibo al terminar?",
					answer:
						"Un resumen de la decisión, las opciones consideradas, sus riesgos y un alcance inicial con criterios para valorar la siguiente fase.",
				},
				{
					question: "¿Puedo pedir una revisión de un presupuesto o proveedor?",
					answer:
						"Sí. Puedo revisar el alcance, los supuestos, las dependencias y las preguntas que conviene resolver antes de aceptar la propuesta.",
				},
			],
		},
		"web-wordpress:2": {
			metaTitle: "Optimización WordPress: velocidad y estabilidad",
			metaDescription:
				"Diagnóstico y mejoras de rendimiento para WordPress: páginas, plugins, imágenes, caché y límites de hosting, con revisión antes y después.",
			overview: [
				"La optimización WordPress localiza qué está ralentizando una web existente y aplica mejoras que se pueden comprobar.",
				"Reviso páginas representativas, imágenes, plugins, caché y dependencias externas. El alcance depende del hosting, el tema y los servicios de terceros; recibirás las medidas y límites observados.",
			],
			problem:
				"Tu web WordPress carga despacio o responde de forma irregular y necesitas saber qué mejora es viable antes de cambiar de hosting o rehacer el sitio.",
			benefits: [
				{
					title: "Un diagnóstico priorizado",
					body: "La revisión separa los problemas de configuración, imágenes, plugins, tema y hosting para abordar primero el cuello de botella comprobado.",
				},
				{
					title: "Cambios con una comparación clara",
					body: "Registro las páginas y condiciones revisadas antes y después para que puedas valorar qué cambió y qué sigue limitando el resultado.",
				},
				{
					title: "Una intervención proporcionada",
					body: "Conservo lo que funciona y explico cuándo una dependencia externa o la estructura actual limita las mejoras posibles.",
				},
			],
			whenNeeded: [
				"Las páginas principales tardan en mostrar contenido o reaccionar.",
				"El problema apareció después de instalar un plugin, tema o servicio externo.",
				"Quieres medir una página antes de decidir si cambiar de hosting.",
				"Necesitas revisar las páginas clave tras una actualización de WordPress.",
			],
			whoFor: [
				"Negocios que ya usan WordPress y necesitan mejorar su respuesta.",
				"Equipos que quieren localizar si el límite está en WordPress o en el hosting.",
				"Propietarios que prefieren medir el problema antes de rehacer su web.",
			],
			builds: [
				"Medición inicial de las páginas acordadas y registro de las condiciones de prueba.",
				"Revisión de plugins, imágenes, caché, fuentes, tema y solicitudes externas.",
				"Corrección de los problemas incluidos en el alcance acordado.",
				"Medición posterior y resumen de cambios, resultados y límites pendientes.",
			],
			process: [
				"Elegir las páginas y el problema que conviene medir primero.",
				"Registrar el punto de partida y revisar la configuración implicada.",
				"Aplicar las mejoras acordadas con una copia recuperable.",
				"Repetir las mediciones y documentar resultados y dependencias pendientes.",
			],
			whyMe: [
				"Empiezo por medir el problema y explicar qué depende de WordPress y qué depende del hosting o de terceros.",
				"Priorizo cambios acotados que se puedan comparar antes y después.",
				"No prometo una puntuación fija ni velocidad concreta cuando existen límites externos o del propio sitio.",
			],
			faq: [
				{
					question: "¿Garantizas una puntuación concreta de PageSpeed?",
					answer:
						"No. La puntuación depende también del hosting, el tema, los plugins y servicios externos. Acordamos qué medir y te explico los límites encontrados.",
				},
				{
					question: "¿Tengo que cambiar de hosting?",
					answer:
						"No necesariamente. Primero reviso si hay evidencia de que el servidor limita las páginas acordadas; después comparo esa opción con mejoras de configuración o contenido.",
				},
				{
					question: "¿Es un servicio de rediseño?",
					answer:
						"No. Se centra en medir y mejorar el rendimiento de un WordPress existente. Si el problema está en estructura o diseño, podemos valorar un rediseño por separado.",
				},
			],
		},
	},
	en: {
		"it-consulting:1": {
			metaTitle: "IT advisory to choose your next step",
			metaDescription:
				"Independent IT advisory to compare options, review risks and define technical scope before you invest.",
			overview: [
				"IT advisory helps you make a technical decision when the problem or available options are not yet clear.",
				"We review goals, constraints and alternatives. You receive a reasoned recommendation, an initial scope and criteria for deciding what to do next. Implementation is scoped separately.",
			],
			problem:
				"You need to decide what to build, buy or change, but do not yet have enough clarity to commit the budget.",
			benefits: [
				{
					title: "Options you can compare",
					body: "We compare approaches by fit, cost, dependencies, risk and maintenance, not just by technology.",
				},
				{
					title: "A concrete initial scope",
					body: "Separate what is needed now from improvements that can wait, and make assumptions clear.",
				},
				{
					title: "A decision you can explain",
					body: "You receive conclusions, open questions and criteria for assessing a proposal or the next step.",
				},
			],
			whenNeeded: [
				"You have several proposals and need to compare scope, risks and costs.",
				"You are unsure whether to extend an existing tool or build a custom solution.",
				"A project is stuck and you need to organize dependencies and priorities.",
				"You want an independent review of an architecture or plan before approving implementation.",
			],
			whoFor: [
				"Small businesses preparing a technology investment.",
				"Founders who need to scope an initial product release.",
				"Teams seeking an independent review of a supplier or technical plan.",
			],
			builds: [
				"Review of the context, goals, constraints and material available.",
				"Comparison of alternatives and their technical and operational implications.",
				"A short document with recommendations, risks and assumptions.",
				"Initial scope and acceptance criteria for the next step.",
			],
			process: [
				"Share the problem, pending decision and information available.",
				"Agree which questions the review should answer and what is out of scope.",
				"Compare options, costs, dependencies and relevant risks.",
				"Receive the findings and review the recommended next step together.",
			],
			whyMe: [
				"I combine advisory work with practical experience building and maintaining software.",
				"Recommendations consider implementation, operation and integrations, not only tool choice.",
				"The engagement ends with decisions and scope; development is agreed and priced separately.",
			],
			faq: [
				{
					question: "Does IT advisory include building the software?",
					answer:
						"No. It includes reviewing the context, comparing options and defining a next step. If you later want implementation, we scope it as a separate project.",
				},
				{
					question: "What do I receive at the end?",
					answer:
						"A summary of the decision, options considered, risks and an initial scope with criteria for evaluating the next phase.",
				},
				{
					question: "Can you review a proposal or supplier?",
					answer:
						"Yes. I can review the scope, assumptions and dependencies, then list the questions worth resolving before you accept it.",
				},
			],
		},
		"web-wordpress:2": {
			metaTitle: "WordPress optimization for speed and stability",
			metaDescription:
				"WordPress performance diagnosis and improvements: pages, plugins, images, caching and hosting limits, with before-and-after checks.",
			overview: [
				"WordPress optimization identifies what is slowing down an existing site and applies improvements you can verify.",
				"I review representative pages, images, plugins, caching and external dependencies. Scope depends on hosting, theme and third-party services; you receive the measures and limits observed.",
			],
			problem:
				"Your WordPress site loads slowly or behaves inconsistently, and you need to know what can improve before changing hosts or rebuilding it.",
			benefits: [
				{
					title: "A prioritized diagnosis",
					body: "The review separates configuration, image, plugin, theme and hosting issues so the verified bottleneck comes first.",
				},
				{
					title: "Changes with a clear comparison",
					body: "I record the pages and test conditions before and after so you can assess what changed and what still limits the result.",
				},
				{
					title: "A proportionate intervention",
					body: "I preserve what works and explain when an external dependency or current setup limits improvement.",
				},
			],
			whenNeeded: [
				"Key pages take too long to display or respond.",
				"The problem appeared after installing a plugin, theme or external service.",
				"You want to measure a page before deciding whether to change hosts.",
				"You need to check key pages after a WordPress update.",
			],
			whoFor: [
				"Businesses already using WordPress that need better response times.",
				"Teams trying to find out whether WordPress or hosting is the main limit.",
				"Owners who want to measure the problem before rebuilding their site.",
			],
			builds: [
				"Initial measurements of agreed pages and a record of test conditions.",
				"Review of plugins, images, caching, fonts, theme and external requests.",
				"Fixes for the problems included in the agreed scope.",
				"Follow-up measurements and a summary of changes, results and remaining limits.",
			],
			process: [
				"Choose the pages and problem to measure first.",
				"Record a baseline and review the relevant configuration.",
				"Apply the agreed improvements with a recoverable backup.",
				"Repeat the measurements and document results and remaining dependencies.",
			],
			whyMe: [
				"I measure the problem first and explain what depends on WordPress, hosting or a third party.",
				"I prioritize bounded changes that can be compared before and after.",
				"I do not promise a fixed score or speed when external or site constraints apply.",
			],
			faq: [
				{
					question: "Do you guarantee a specific PageSpeed score?",
					answer:
						"No. Hosting, themes, plugins and external services can affect the score. We agree what to measure and I explain the limits I find.",
				},
				{
					question: "Do I need to change hosting?",
					answer:
						"Not necessarily. I first look for evidence that the server limits the agreed pages, then compare that with configuration or content improvements.",
				},
				{
					question: "Is this a website redesign service?",
					answer:
						"No. It focuses on measuring and improving an existing WordPress site's performance. If structure or design is the issue, we can scope a redesign separately.",
				},
			],
		},
	},
};

export const getServiceOfferingCopy = (
	locale: Locale,
	translationKey: string,
) => copy[locale][translationKey];
