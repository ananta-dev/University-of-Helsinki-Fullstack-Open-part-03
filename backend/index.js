require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.static("build"));
app.use(cors());
morgan.token("body", req => JSON.stringify(req.body));
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);
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

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
