import { useState } from "react";
import phonebookService from "../services/phonebookService";

const AddPersonForm = ({
    persons,
    setPersons,
    personsToShow,
    setPersonsToShow,
    setFilterString,
    setMessage,
    setIsError,
}) => {
    const NAME_PLACEHOLDER_TEXT = "Enter name here...";
    const NUMBER_PLACEHOLDER_TEXT = "Enter phone number here...";

    const [newName, setNewName] = useState(NAME_PLACEHOLDER_TEXT);
    const [newNumber, setNewNumber] = useState(NUMBER_PLACEHOLDER_TEXT);

    const addPerson = e => {
        e.preventDefault();

        if (persons.some(person => person.name === newName)) {
            if (
                window.confirm(
                    `${newName} is already in the phonebook. Do you want to replace the old number with a new one?`
                )
            ) {
                const entryToUpdate = persons.find(p => p.name === newName);
                const updatedEntry = { ...entryToUpdate, number: newNumber };
                phonebookService
                    .updateEntry(updatedEntry)
                    .then(response => {
                        setPersons(
                            persons.map(p => {
                                if (p.id === updatedEntry.id) {
                                    return { ...p, number: newNumber };
                                }
                                return p;
                            })
                        );

                        setPersonsToShow(
                            personsToShow.map(p => {
                                if (p.id === updatedEntry.id) {
                                    return { ...p, number: newNumber };
                                }
                                return p;
                            })
                        );
                        setIsError(false);
                        setMessage(`Updated ${newName}'s number`);
                    })
                    .catch(err => {
                        // do something with error
                        setIsError(true);
                        setMessage(
                            `Error while attempting to update ${newName}. ${err?.response.data.error}`
                        );
                    });
            }
        } else if (persons.some(person => person.number === newNumber)) {
            alert(`The number ${newNumber} is already in the phonebook`);
        } else {
            const newPerson = {
                name: newName,
                number: newNumber,
            };

            phonebookService
                .addEntry(newPerson)
                .then(response => {
                    const newPersonsArray = [...persons, response.data];
                    setPersons(newPersonsArray);
                    setPersonsToShow(newPersonsArray);
                    setFilterString("");
                    setNewName("");
                    setNewNumber("");
                    setIsError(false);
                    setMessage(`Added ${newName}`);
                })
                .catch(err => {
                    console.log({ err });
                    setIsError(true);
                    setMessage(
                        `Error while attempting to save ${newName}. ${err?.response.data.error} `
                    );
                });
        }
    };

    const handleNameInputChange = e => {
        setNewName(e.target.value);
    };

    const clearNamePlaceholderText = e => {
        if (e.target.value === NAME_PLACEHOLDER_TEXT) {
            setNewName("");
        }
    };

    const handleNumberInputChange = e => {
        setNewNumber(e.target.value);
    };

    const clearNumberPlaceholderText = e => {
        if (e.target.value === NUMBER_PLACEHOLDER_TEXT) {
            setNewNumber("");
        }
    };

    return (
        <>
            <h2>Add a new person</h2>
            <form onSubmit={addPerson}>
                <div>
                    name:{" "}
                    <input
                        onChange={handleNameInputChange}
                        onFocus={clearNamePlaceholderText}
                        value={newName}
                    />
                </div>
                <div>
                    number:{" "}
                    <input
                        onChange={handleNumberInputChange}
                        onFocus={clearNumberPlaceholderText}
                        value={newNumber}
                    />
                </div>
                <div>
                    <button type='submit'>add</button>
                </div>
            </form>
        </>
    );
};

export default AddPersonForm;
