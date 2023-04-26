
    require("dotenv").config();

    const express = require('express');
    const https = require('https');
    const bodyParser = require('body-parser');


    const app = express();


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));



    app.get("/", (req, res, next) => {
        res.sendFile(__dirname + "/sign-up.html");
    });

    app.post("/", (req, res, next) => {

        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        console.log(email, firstName, lastName);

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

        console.log(data);

        const jsonData = JSON.stringify(data);
        const url = "https://us21.api.mailchimp.com/3.0/lists/34f9f29e9c";
        const options = {
            method: "POST",
            auth: `username:${process.env.API_TOKEN}`
        }


        console.log(options);

        const request = https.request(url, options, (response) => {

            if (response.statusCode !== 200) {
                res.sendFile(__dirname + "/signUp-failed.html");
            } else {
                res.sendFile(__dirname + "/signUp-success.html");
            }


            response.on('data', (data) => {

                console.log(JSON.parse(data));

            });

        });

        request.write(jsonData);
        request.end();

    });

    app.post("/success", (req, res) => {
        res.redirect("/");
    });
    app.post("/failed", (req, res) => {
        res.redirect("/");
    });

    app.listen(3000, () => {
        console.log("Express server listening on port");
    });


