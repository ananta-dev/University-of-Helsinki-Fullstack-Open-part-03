const Filter = ({
    filterString,
    setFilterString,
    setPersonsToShow,
    persons,
}) => {
    const handleFilterChange = e => {
        const newFilter = e.target.value;
        if (newFilter === "") {
            setPersonsToShow(persons);
        } else {
            setPersonsToShow(
                persons.filter(person =>
                    person.name.toUpperCase().includes(newFilter.toUpperCase())
                )
            );
        }
        setFilterString(newFilter);
    };

    return (
        <div>
            filter shown with{" "}
            <input onChange={handleFilterChange} value={filterString} />
        </div>
    );
};

export default Filter;
