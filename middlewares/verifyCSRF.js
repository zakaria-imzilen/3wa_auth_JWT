module.exports = (req, res, next) => {
	const generatedCSRFToken = req.cookies["XSRF-TOKEN"]; // Retrieve CSRF Token stored in a cookie
	const receivedCSRFToken = req.body._csrf; // Retrieve CSRF Token received from the Request

	// Compare the 2
	if (generatedCSRFToken !== receivedCSRFToken) {
		// Invalid token value
		res.redirect("/auth/");
		return;
	}

	next();
};
