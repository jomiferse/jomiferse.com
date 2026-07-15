# Proteger el endpoint público de contacto

**Estado:** TODO  
**Prioridad:** P0 — bloquea publicación  
**Planificado sobre:** `24590a6` (2026-07-15)

## Por qué

`POST /api/contact` convierte cualquier petición válida en un envío de Resend. No hay límite de cuerpo o longitud, rate limit, honeypot ni challenge; esto permite spam y consumo de cuota. Además, el remitente está fijado a `onboarding@resend.dev` y la configuración se valida solo al intentar enviar.

## Estado actual y evidencia

- `src/pages/api/contact.ts:35-44` llama a `request.formData()` y acepta `name`, `email` y `message` sin límites.
- `src/pages/api/contact.ts:68-84` solo comprueba presencia/email y crea un envío por petición.
- `src/pages/api/contact.ts:78-81` instancia Resend directamente y fija el remitente en código.
- `tests/contact-submission.test.ts` cubre el parser del resultado, no el handler ni el transporte.

## Alcance

`src/pages/api/contact.ts`, formulario de contacto, nueva utilidad de validación/transporte, pruebas de endpoint, `.env.example` o documentación de entorno y configuración de despliegue si se usa una protección de plataforma.

Fuera de alcance: cambiar de proveedor de correo o añadir una cuenta de usuario.

## Pasos de implementación

1. Extraer un esquema puro de entrada con límites explícitos: nombre 2–100, email hasta 254, mensaje 20–5.000, valores permitidos para locale/servicio/scope y rutas de origen acotadas. Rechazar `Content-Length` excesivo antes de parsear y capturar errores de `formData()`.
   - Verificar con pruebas para cuerpo vacío, formato incorrecto, campos demasiado largos y valores no permitidos.
2. Añadir una barrera contra bots: un honeypot invisible y una protección de frecuencia en Vercel o un challenge gestionado. La respuesta pública debe ser neutra para no revelar qué control falló.
   - Verificar que un usuario sin JavaScript puede enviar, que el honeypot bloquea y que la protección no depende de una IP manipulable enviada por el cliente.
3. Separar `sendContactEmail(input, transport)` del handler e inyectar el transporte en pruebas. Leer `RESEND_API_KEY`, `CONTACT_FROM` y `CONTACT_TO` al inicio de la operación y fallar de forma controlada si faltan.
   - Configurar `CONTACT_FROM` con un dominio verificado antes del deploy; no incluir secretos en el repositorio.
4. Normalizar el asunto y el texto para impedir encabezados o logs abusivos. No registrar el mensaje ni datos personales completos.
5. Añadir pruebas del handler para 303 de éxito/error, rate limit/challenge, proveedor fallido y preservación de locale/selección.

## Verificación

```bash
pnpm test
pnpm run check
pnpm run lint
pnpm run build
```

En preview, enviar un formulario válido en `/es/contact/` y `/en/contact/`, provocar una validación errónea y confirmar que no se emite correo cuando actúa el honeypot o el limitador.

## Criterios de finalización

- Ninguna petición anónima ilimitada puede consumir envíos sin control.
- Todos los campos tienen límites en servidor y el cliente refleja los mismos límites.
- Remitente/destinatario son configuración externa validada; el dominio de envío está verificado.
- El handler se prueba sin contactar a Resend.
- No se almacenan ni registran datos personales innecesarios.

## STOP

Detener el trabajo si la protección elegida exige un servicio de pago o almacenar identificadores personales no autorizado; documentar coste, retención y alternativa de Vercel antes de decidir.

## Mantenimiento

Revisar límites, cuota y eventos bloqueados el primer mes. Mantener las pruebas de seguridad en `pnpm test` y no recrearlas como verificaciones textuales.
