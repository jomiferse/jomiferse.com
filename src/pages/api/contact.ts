import type { APIRoute } from "astro";
import { Resend } from "resend";
import cv from "@cv";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const MAX_PDF_BYTES = 4 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
	const form = await request.formData();

	const name = String(form.get("name") ?? "").trim();
	const email = String(form.get("email") ?? "").trim();
	const message = String(form.get("message") ?? "").trim();

	if (!name || !email || !message) {
		return new Response("Missing fields", { status: 400 });
	}

	const subject = `Portfolio contact from ${email}`;

	let attachments: { filename: string; content: Buffer }[] = [];

	const file = form.get("attachment");

	if (file && typeof file === "object" && "arrayBuffer" in file) {
		const f = file as {
			size: number;
			type?: string;
			name?: string;
			arrayBuffer: () => Promise<ArrayBuffer>;
		};

		if (f.size > 0) {
			const filename = (f.name ?? "attachment.pdf").toString();
			const type = (f.type ?? "").toString();

			if (
				type &&
				type !== "application/pdf" &&
				!filename.toLowerCase().endsWith(".pdf")
			) {
				return new Response("Only PDF files allowed", { status: 400 });
			}

			if (f.size > MAX_PDF_BYTES) {
				return new Response("PDF too large (max 4MB)", { status: 400 });
			}

			const buffer = Buffer.from(await f.arrayBuffer());

			attachments.push({
				filename,
				content: buffer,
			});
		}
	}

	await resend.emails.send({
		from: "Portfolio <onboarding@resend.dev>",
		to: cv.email,
		replyTo: email,
		subject,
		text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
		attachments,
	});

	return new Response(null, {
		status: 303,
		headers: { Location: "/contact?sent=1" },
	});
};
