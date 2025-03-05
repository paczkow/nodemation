import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY, // Make sure to set this environment variable
});

export async function createTask(text) {
	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"You are a task title generator. Given a text description, generate a concise title (maximum 6 words) that captures the main point. The title must begin with an action (verb). The title must be in the same language as the input text.",
				},
				{
					role: "user",
					content: text,
				},
			],
			max_tokens: 50,
			temperature: 1,
		});

		const title = completion.choices[0].message.content.trim();

		return {
			title,
			description: text,
		};
	} catch (error) {
		console.error("Error generating task title:", error);
		throw new Error("Failed to generate task title");
	}
}
