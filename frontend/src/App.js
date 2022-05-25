import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import AddPersonForm from "./components/AddPersonForm";
import ListPeople from "./components/ListPeople";
import Notification from "./components/Notification";
import phonebookService from "./services/phonebookService";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [personsToShow, setPersonsToShow] = useState([]);
    const [filterString, setFilterString] = useState("");
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        phonebookService.getAll().then(response => {
            // console.log("response from getAll: ", response);
            setPersons(response.data);
            setPersonsToShow(response.data);
        });
    }, []);

    return (
        <div>
            <h2>Phonebook</h2>
            {/* {message !== "" && <Notification message={message} />} */}
            <Notification message={message} isError={isError} />
            <Filter
                filterString={filterString}
                setFilterString={setFilterString}
                persons={persons}
                setPersonsToShow={setPersonsToShow}
            />
            <AddPersonForm
                persons={persons}
                setPersons={setPersons}
                personsToShow={personsToShow}
                setPersonsToShow={setPersonsToShow}
                setFilterString={setFilterString}
                setMessage={setMessage}
                setIsError={setIsError}
            />
            <ListPeople
                persons={persons}
                setPersons={setPersons}
                personsToShow={personsToShow}
                setPersonsToShow={setPersonsToShow}
                setMessage={setMessage}
                setIsError={setIsError}
            />
        </div>
    );
};

export default App;
