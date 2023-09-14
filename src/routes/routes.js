
const fs = require('fs');
const app = require("../app")
const router = (app) => {

    app.get("/", (request, response) => {

		response.send({

			message: "Node.js and Express REST API",

		});

	});

};
 
let oceans = fs.readFileSync("src/ocean.json")
oceans = JSON.parse(oceans)

  app.get("/oceans", (request, response) => {

    response.send(oceans);

});

module.exports = router