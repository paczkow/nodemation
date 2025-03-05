import { Readable } from "node:stream";
import OpenAI, { toFile } from "openai";


const openai = new OpenAI({
	organization: process.env.OPENAI_ORG,
	apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribe(buffer, extension) {
	const audio = await toFile(buffer, `audio.${extension}`);

	return await openai.audio.transcriptions.create({
		file: audio,
		model: "whisper-1",
	});
}