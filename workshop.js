const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("port", 8080);
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

const Pool = require("pg").Pool;
const config = {
	host: "localhost",
	user: "new",
	password: "newpass",
	database: "workshop"
};

const pool = new Pool(config);

app.get("/hello", (req, res) => {
	res.json("Hello World");
});


//GET attendees of a certain workshop
app.get("/api", async (req, res) => {
	try {
		console.log("before if");
		if (!req.query.workshop){
			const template = "SELECT DISTINCT workshop FROM workshops";
			console.log("after template");
			const response = await pool.query(template);	
			console.log("after query");
			const workshopList = response.rows.map(function(item){
				return item.workshop;
			console.log("after query");
			});
			res.json({workshops: workshopList})
		}
		else{	
			const template = "SELECT attendee FROM workshops WHERE workshop = $1";
			const response = await pool.query(template, [req.query.workshop]);
			if (response.rowCount == 0) {
				res.json({ "error": "workshop not found"});
			} else {
				const attendeesList = response.rows.map(function(item) {
					return item.attendee;
				});
				res.json({attendees: attendeesList });
			}
	}
	} catch (err) {
		res.json({ status: "error" });
	}
});

//posting
app.post("/api", async (req, res) => {
	
	const attendee = req.body.attendee;
	const workshop = req.body.workshop;
	try {
		if(!req.body.attendee || !req.body.workshop){
			res.json({ error: 'parameters not given'});
		}
		const template = "SELECT workshop, attendee from workshops WHERE workshop = $1 AND attendee = $2";
		const response = await pool.query(template, [workshop, attendee]);
		console.log(response);
		if(response.rowCount != 0){
			res.json({error: 'attendee already enrolled'})
		}
		else{
			const template =
				"INSERT INTO workshops (workshop, attendee) VALUES ($1, $2)";
			const response = await pool.query(template, [
				workshop,
				attendee
			]);
			res.json({ attendee: attendee, workshop: workshop});
		}
	} catch (err) {
		res.json({error: 'attendee already enrolled'});
	}
});

app.listen(app.get("port"), () => {
	console.log(`Find the server at http://localhost:${app.get("port")}`);
});


