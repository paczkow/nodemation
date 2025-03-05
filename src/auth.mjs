import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; 

/**
 * Generate a JWT token
 * @returns {string} JWT token
 */
export function generateToken() {
	return jwt.sign({}, JWT_SECRET, { expiresIn: "24h" });
}

export function authenticateToken(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1]; // Bearer TOKEN format

	if (!token) {
		return res.status(401).json({ error: "Authentication token required" });
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: "Invalid or expired token" });
		}
		req.user = user;
		next();
	});
}
