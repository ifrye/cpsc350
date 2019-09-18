const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("port", 3000);
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

const Pool = require("pg").Pool;
const config = {
	host: "localhost",
	user: "workshop",
	password: "F6cSGqJb#8^5",
	database: "workshop"
};

const pool = new Pool(config);

app.get("/hello", (req, res) => {
	res.json("Hello World");
});


//GET attendees of a certain workshop
app.get("/api", async (req, res) => {
	try {
		const template = "SELECT attendee FROM workshops WHERE workshop = $1";
		const response = await pool.query(template, [req.query.workshop]);
		if (response.rowCount == 0) {
			res.json({ "error": "workshop not found"});
		} else {
			const workshopList = response.rows.map(function(item) {
				return item.attendee;
			});
			res.json({
				status: "ok",
				results: { workshop: req.query.workshop, attendees: workshopList }
			});
		}
	} catch (err) {
		res.json({ status: "error" });
	}
});



app.listen(app.get("port"), () => {
	console.log(`Find the server at http://localhost:${app.get("port")}`);
});


