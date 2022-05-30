require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Middleware
app.use(cors());
app.use(express.json());
morgan.token("body", req => JSON.stringify(req.body));
// prettier-ignore
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

// Frontend build
app.use(express.static("build"));

// Mongoose person collection model
const Person = require("./models/person");

// ********************
// ***    ROUTES    ***
// ********************

app.get("/", (request, response, next) => {
    try {
        response.send("<h2>Phonebook API running</h2>");
    } catch (err) {
        err.errorOrigin = "api-root";
        next(err);
    }
});

app.get("/info", (request, response, next) => {
    try {
        response.send(
            `<p>Phonebook is an API for the management of a list of people and their phone numbers</p>
        <p>${new Date()}</p>`
        );
    } catch (err) {
        err.errorOrigin = "get-info";
        next(err);
    }
});

app.get("/api/persons", (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons);
        })
        .catch(err => {
            err.errorOrigin = "get-all-persons";
            next(err);
        });
});

app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(err => {
            err.errorOrigin = "get-person-by-id";
            next(err);
        });
});

app.post("/api/persons", (request, response, next) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "name missing",
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: "number missing",
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person
        .save()
        .then(savedPerson => {
            response.json(savedPerson);
        })
        .catch(err => {
            err.errorOrigin = "post-person";
            next(err);
        });
});

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndRemove(id)
        .then(response.status(204).end())
        .catch(err => {
            err.errorOrigin = "delete-person";
            next(err);
        });
});

// *********************
// *** END OF ROUTES ***
// *********************

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "Phonebook API - Unknown endpoint" });
};
app.use(unknownEndpoint);

// **********************
// *** ERROR HANDLING ***
// **********************

const errorHandler = (error, request, response, next) => {
    console.log("Starting errorHandler. Error origin: ", error.errorOrigin);
    switch (error.errorOrigin) {
        case "get-person-by-id":
        case "delete-person":
            if (error?.kind === "ObjectId") {
                console.log("Invalid Id format");
                response.status(400).send({ error: "Invalid Id format" });
            } else if (error?.name === "ValidationError") {
                console.log("Validation error:", error);
                response.status(400).send({ error: error.message });
            } else {
                console.log("Server error:", error);
                response.status(500).send({ error: error.message });
            }
            break;
        case "post-person":
            console.log("Database error. Code", error?.message);
            if (error?.code === 11000) {
                console.log(
                    "Entry found in the database with the same name: ",
                    body.name
                );
                response.status(403).json(error.message);
            } else {
                console.log(
                    "Database error while attempting to save entry to the database"
                );
                response.status(500).json(error.message);
            }
            break;
        case "api-root":
        case "get-info":
        case "get-all-persons":
        default:
            console.log("Error: ", error);
            console.log("Error origin: ", error.errorOrigin);
            return response.status(500).json(error.message);
    }

    next(error);
};
app.use(errorHandler);

// Run server listening on port
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
