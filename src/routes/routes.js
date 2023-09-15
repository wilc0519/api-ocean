
const fs = require('fs');
const bodyParser = require('body-parser')
const app = require("../app")
const router = (app) => {

  app.get("/", (request, response) => {
    console.log(request.body)
    response.send({

      message: "Node.js and Express REST API",

    });

  });

};

let getOceans = fs.readFileSync("src/ocean.json")
getOceans = JSON.parse(getOceans)

app.get("/oceans", (request, response) => {

  response.status(200).send(getOceans);

});


app.get("/oceans/:ocean_id", async (request, response) => {
  const id = request.params.ocean_id;
  console.log(request.body)

  const ocean = getOceans.find(ocean => ocean.id == id)
  if (ocean) {
    response.status(200).send(ocean)
  } else {
    response.status(404).send({ message: "ocean not found" })
  }


});

app.put("/oceans/:ocean_id", bodyParser.json(), async (request, response) => {
  const updates = Object.keys(request.body)
  const allowedUpdates = ["name", "depth", "temperature", "continent"]
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  if (!isValidOperation) {
    response.status(400).send({ error: 'Invalid update' })
  }
  try {
    const id = request.params.ocean_id;
    const oceano = getOceans.find(ocean => ocean.id == id)
    updates.forEach((update) => { oceano[update] = request.body[update] })
    const updatedOcean = []
    getOceans.forEach(ocean => {
      if (ocean.id != id) {
        updatedOcean.push(ocean)
      } else {
        updatedOcean.push(oceano)
      }
    })
    fs.writeFileSync("src/ocean.json", JSON.stringify(updatedOcean))
    console.log(updatedOcean)
    response.send(oceano)

  } catch (e) {
    response.status(500).send(e)
  }
})

app.post("/oceans", bodyParser.json(), async (request, response) => {

  const id = request.body.id
  const name = request.body.name;
  const depth = request.body.depth;
  const temperature = request.body.temperature;
  const continent = request.body.continent;

  const new_ocean = { id, name, depth, temperature, continent }
  const ocean = getOceans.find(ocean => ocean.id == id || ocean.name == name)
  if (!ocean) {
    getOceans.push(new_ocean)
    fs.writeFileSync("src/ocean.json", JSON.stringify(getOceans))
    response.send(new_ocean)
  }
  else {
    response.status(404).send({ message: "name or id of the ocean already exists in the database" })
  }

})

app.delete("/oceans/:ocean_id", bodyParser.json(), async (request, response) => {
  const dataWithOceanDeleted = []
  const id = request.params.ocean_id;
  const ocean = getOceans.find(ocean => ocean.id == id)
  if (!ocean) {
    response.send({ message: "ocean not found" })
  } else {
    getOceans.forEach(ocean => {
      if (ocean.id != id) {
        dataWithOceanDeleted.push(ocean)
      }
    })
    fs.writeFileSync("src/ocean.json", JSON.stringify(dataWithOceanDeleted))
    response.send({message: "ocean deleted"})
  }


})


module.exports = router