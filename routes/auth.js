const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { sign, verify } = require("jsonwebtoken");
const fakeData = require("../fakeData");
const verifyCSRF = require("../middlewares/verifyCSRF");

const authRouter = Router();

authRouter.get("/", (req, res, next) => {
	const generetedToken = req.csrfToken(); // 2-1 Generate the Token

	res.cookie("XSRF-TOKEN", generetedToken); // 2-2 Store the token in a cookie

	res.render("auth", { csrf: generetedToken }); // 2- Hand the CSRF Token to the end user
});

authRouter.post(
	"/signin",
	verifyCSRF, // 3- Ensure the validation of the token passed in the body of the request
	[
		body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
		body("password").isStrongPassword().withMessage("Weak password"),
	],
	(req, res, next) => {
		const errors = validationResult(req); // Returns an object

		if (!errors.isEmpty()) {
			// Check the existence of errors
			res.send(errors.array());
			return;
		}

		const { email, password } = req.body;

		const findingUser = fakeData.find(
			(user) => user.email === email.toLowerCase() && user.pwd === password
		);

		// User not found
		if (!findingUser) {
			return res.redirect("/auth/");
		}

		// User is found
		// Generate a JWT Token
		const token = sign(findingUser, process.env.JWT_SECRET_KEY);

		// Store the token in the session
		req.session.token = token;

		res.redirect("/user/home");
	}
);

module.exports = {
	authRouter,
};
