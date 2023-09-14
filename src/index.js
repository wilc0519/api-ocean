const app = require("./app")
const routes = require("./routes/routes.js")
const port = process.env.PORT || 3000


routes(app)

app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})