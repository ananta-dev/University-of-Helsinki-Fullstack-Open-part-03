require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(express.static("build"));
app.use(express.json());
app.use(cors());

morgan.token("body", req => JSON.stringify(req.body));
// prettier-ignore
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

const Person = require("./models/person");

app.get("/", (request, response) => {
    response.send("<h2>Phonebook API running</h2>");
});

app.get("/info", (request, response) => {
    response.send(
        `<p>Phonebook is an API for the management of a list of people and their phone numbers</p>
        <p>${new Date()}</p>`
    );
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
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
        .catch(err => next(err));
    // .catch(err => {
    //     if (err?.kind === "ObjectId") {
    //         console.log("Invalid Id format");
    //         response.status(400).send({ error: "Invalid Id format" });
    //     } else {
    //         console.log("Error: ", err);
    //         response.status(500).send({ error: err });
    //     }
    // });
});

app.post("/api/persons", (request, response) => {
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

    person.save().then(savedPerson => {
        response.json(savedPerson);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndRemove(id)
        .then(response.status(204).end())
        .catch(err => next(err));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "Phonebook API - Unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (err?.kind === "ObjectId") {
        console.log("Invalid Id format");
        response.status(400).send({ error: "Invalid Id format" });
    } else if (error?.name === "ValidationError") {
        console.log("Validation error");
        response.status(400).send({ error: error.message });
    }

    //     } else {
    //         console.log("Error: ", err);
    //         response.status(500).send({ error: err });
    //     }

    if (error.name === "CastError") {
        return response.status(400).send({ error: "Malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
