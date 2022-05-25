require("dotenv").config();
const mongoose = require("mongoose");

// if (process.argv.length < 2) {
//     console.log(
//         "Please provide the password as an argument: node mongo.js <password>"
//     );
//     process.exit(1);
// }
// const password = process.argv[2];

mongoose.connect(process.env.MONGODB_URL);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 2) {
    console.log("phonebook:");
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length === 4) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3],
    });
    person.save().then(result => {
        console.log("Person saved!");
        mongoose.connection.close();
    });
} else {
    console.log("Incorrect number of arguments!");
}
