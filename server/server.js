const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bot-orders.firebaseio.com'
});

var jsonParser = bodyParser.json();
app.post('/api/login', jsonParser, (req, res) => {
    // const email = req.query.username + '@season.com';
    admin.auth().getUser('WedlCK5lhBYWdOsCrX5GIskK78e2')
        .then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully fetched user data:", userRecord.toJSON());
            res.json(userRecord)
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
            res.json(error)
        });
})

app.use(express.static(publicPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
});
app.listen(port, () => {
    console.log('Server is up!')
});