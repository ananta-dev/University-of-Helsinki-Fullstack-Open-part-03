const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.log('Error connecting to MongoDB: ', error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required'],
        minlength: [
            3,
            'The name "{VALUE}" is too short. The minimum length is 3 characters.',
        ],
    },
    number: {
        type: String,
        required: [true, 'Phone number is required'],
        minlength: [
            8,
            'The number "{VALUE}" is too short. The minimum length is 8 characters.',
        ],
        validate: {
            validator: function (v) {
                return /^(\d*|\d{2,3}-\d+|\d{3}-\d{3}-\d{4})$/.test(v);
            },
            message: props =>
                `The phone number "${props.value}" is not in a valid format!. Please use one of the following formats: 12345678..., 12-345678..., 123-45678... or 123-456-7890.`,
        },
    },
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = document._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model('Person', personSchema);
