const { Router } = require("express");
const jwt = require("jsonwebtoken");
const fakeData = require("../fakeData");

const userRouter = Router();

// PROTECTED
userRouter.get("/home", (req, res, next) => {
	// No token
	if (!req.session.token) {
		res.redirect("/auth/");
		return;
	}

	// Token got already generated
	const decodedUserData = jwt.verify(
		req.session.token,
		process.env.JWT_SECRET_KEY
	);

	if (!decodedUserData) {
		res.redirect("/auth/");
		return;
	}

	// User decoded successfuly
	const doesUserExists = fakeData.findIndex(
		(user) => user.id == decodedUserData.id
	);

	if (doesUserExists === -1) {
		res.redirect("/auth/");
		return;
	}

	// Best Case
	res.render("home", { user: decodedUserData });
	return;
});

module.exports = {
	userRouter,
};
