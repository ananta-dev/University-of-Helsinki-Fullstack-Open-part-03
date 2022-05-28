const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGODB_URL)
    .then(result => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.log("Error connecting to MongoDB: ", error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = document._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
