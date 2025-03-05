import OpenAI from "openai";

const openai = new OpenAI({
	organization: process.env.OPENAI_ORG,
	apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribe(buffer) {
	const file = await OpenAI.toFile(buffer, "audio.mp3");

	return await openai.audio.transcriptions.create({
		file,
		model: "whisper-1",
	});
}
