import { Resend } from "resend";
import {
	mapResendTransportError,
	type ContactEmailMessage,
	type ContactEmailTransport,
} from "./contact-handler.ts";

export type ResendSend = (
	message: ContactEmailMessage,
	apiKey: string,
) => Promise<string | null>;

const sendWithResend: ResendSend = async (message, apiKey) => {
	const resend = new Resend(apiKey);
	const result = await resend.emails.send(
		{
			from: message.from,
			to: message.to,
			replyTo: message.replyTo,
			subject: message.subject,
			text: message.text,
		},
		{ idempotencyKey: message.idempotencyKey },
	);
	return result.error?.name ?? null;
};

export const createResendContactTransport = (
	send: ResendSend = sendWithResend,
): ContactEmailTransport => ({
	async send(message, apiKey) {
		const errorName = await send(message, apiKey);
		return errorName ? mapResendTransportError(errorName) : "sent";
	},
});
