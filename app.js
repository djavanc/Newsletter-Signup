const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const postmanRequest = require('postman-request')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public")) // especifica uma pagina estatica para os arquivos

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){

    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data)

    const url = "https://us14.api.mailchimp.com/3.0/lists/f42eb41fbd"

    const options = {
        method: "POST",
        auth: "djavan:07d4d62a44b7cc8088eefdbe528ada25-us14"
    }

    const request = https.request(url, options, function(response){
        var codigoHttp = response.statusCode
                if(codigoHttp === 200){
                    res.sendFile(__dirname + "/success.html")
                }
                else{
                    res.sendFile(__dirname + "/failure.html")
                }

        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()

    //07d4d62a44b7cc8088eefdbe528ada25-us14 API KEY 

    // LIST ID f42eb41fbd
 
})

app.post("/failure", function(req,res){
    res.redirect("/")
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000")
})