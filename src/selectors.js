export const selectTickets = state => {
    const sortingRule = state.sortingRule;

    // Create an array of ticket objects
    const tickets = state.tickets.allIDs.map(ticketID => {
        return state.tickets.byIDs[ticketID];
    });

    /*
     * @description Sorting function for array of objects
     * @param {String} sortingKey - Key of object to sort by
     * @param {String} direction - Sorting direction, either ascending or descending
     *
     * @return {Array} The sorted array
     */
    const sortingFunction = ({ sortingKey, direction }) => {
        // Create object with two functions for sorting by string ascending and descending
        const sortByString = {
            asc: sortingKey => {
                return (a, b) => {
                    const nameA = a[sortingKey].toUpperCase();
                    const nameB = b[sortingKey].toUpperCase();

                    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
                };
            },
            desc: sortingKey => {
                return (a, b) => {
                    const nameA = a[sortingKey].toUpperCase();
                    const nameB = b[sortingKey].toUpperCase();

                    return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
                };
            }
        };

        // Create object with two functions for sorting by date ascending and descending
        const sortByDate = {
            asc: sortingKey => {
                return (a, b) => {
                    return new Date(a[sortingKey]) - new Date(b[sortingKey]);
                };
            },
            desc: sortingKey => {
                return (a, b) => {
                    return new Date(b[sortingKey]) - new Date(a[sortingKey]);
                };
            }
        };

        switch (sortingKey) {
            case "creationDate":
            case "lastModified":
                return sortByDate[direction](sortingKey);
            case "id":
            case "name":
            case "status":
            default:
                return sortByString[direction](sortingKey);
        }
    };

    tickets.sort(sortingFunction(sortingRule));

    return tickets;
};

export const selectTicketStatuses = state => state.ticketStatuses;
