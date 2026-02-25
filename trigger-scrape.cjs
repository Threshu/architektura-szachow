// Trigger scrape via Cloud Function callable
const https = require("https");

const projectId = "chess-balance-anylzer";
const region = "europe-west1";
const functionName = "scrapePlayers";

const url = `https://${region}-${projectId}.cloudfunctions.net/${functionName}`;

const postData = JSON.stringify({ data: {} });

const options = {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"Content-Length": Buffer.byteLength(postData),
	},
};

console.log("Calling:", url);

const req = https.request(url, options, (res) => {
	let body = "";
	res.on("data", (chunk) => (body += chunk));
	res.on("end", () => {
		console.log("Status:", res.statusCode);
		console.log("Response:", body);
	});
});

req.on("error", (err) => {
	console.error("Error:", err.message);
});

req.write(postData);
req.end();
