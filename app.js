const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const request = require("request");

// Configure dotenv package

require("dotenv").config();


// ------ Initializing Middle-Ware ------ //
const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

// Setup your express app and body-parser configurations
// Setup your javascript template view engine
// we will serve your static pages from the public directory, it will act as your root directory
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Setup your default display on launch
app.get("/", function(req, res) {
    // It will not fetch and display any data in the index page
    res.render("index", { weather: null, error: null });
});



// app.use(express.static(TEMPLATES_PATH))
// app.use(cookieParser());
// // Setting Templating Engine
// app.engine('html', es6Renderer);
// // Defining Directory that contains all templates
// app.set('views', 'templates');
// app.set('view engine', 'html');



// // -------------------------------------- //


// // ----------- Importing Controllers -----------//
var weatherRoutes = require("./controllers/aControllers");
var emailRoutes = require("./controllers/emailControllers");

// // -------------------------------------------- //



// // Initializing different Routes with base Apis //

app.use("/weather", weatherRoutes);
app.use("/email", emailRoutes);

// Starting server
app.listen(PORT, function() {
    console.log(`Weather app listening on port ${PORT}`);
});