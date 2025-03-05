import express from "express";
import multer from "multer";
import { transcribe } from "./src/sst.mjs";
import { createTask } from "./src/tasks.mjs";
import { authenticateToken, generateToken } from "./src/auth.mjs";
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// endpoint to generate authentication token
app.post("/auth/token", (req, res) => {
	const { password } = req.body;
	const correctPassword = process.env.AUTH_PASSWORD;

	if (password !== correctPassword) {
		return res.status(401).json({ error: "Invalid password" });
	}

	const token = generateToken();
	res.json({ token });
});

// endpoint to create a tasks from recording / audio file
app.post(
	"/tasks",
	authenticateToken,
	upload.single("audio"),
	async (req, res) => {
		if (!req.file) {
			return res.status(400).json({ error: "No audio file provided" });
		}

		try {
			const { text } = await transcribe(req.file.buffer);
			const { title, description } = await createTask(text);

			res.json({
				title,
				description,
			});
		} catch (error) {
			console.error("Error processing audio:", error);
			res.status(500).json({ error: "Error processing audio file" });
		}
	},
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
