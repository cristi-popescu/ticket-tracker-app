// Return an array of ticket objects
export const selectTickets = state => {
    const { items } = state.tickets;

    return items.allIds.map(ticketId => {
        return items.byIds[ticketId];
    });
};

// Return a function that retrieves the ticket with they key provided as argument
export const selectTicketByKey = state => {
    const tickets = selectTickets(state);

    return key =>
        tickets.filter(ticket => {
            return ticket.key === key;
        })[0];
};

export const selectSortingRule = state => state.tickets.sortingRule;

// Return an array of ticket objects sorted by a provided key
export const selectSortedTickets = (
    state,
    sortingRule = selectSortingRule(state)
) => {
    const tickets = selectTickets(state);

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

        // Create object with two functions for sorting by ticket key ascending and descending
        // Ticket key has format TCK-1, so it actually needs to be sorted by the number in the key
        const sortByTicketKey = {
            asc: sortingKey => {
                return (a, b) => {
                    const numberA = a[sortingKey].split("-").slice(-1);
                    const numberB = b[sortingKey].split("-").slice(-1);
                    return numberA - numberB;
                };
            },
            desc: sortingKey => {
                return (a, b) => {
                    const numberA = a[sortingKey].split("-").slice(-1);
                    const numberB = b[sortingKey].split("-").slice(-1);
                    return numberB - numberA;
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
            case "key":
                return sortByTicketKey[direction](sortingKey);
            case "name":
            case "status":
            default:
                return sortByString[direction](sortingKey);
        }
    };

    tickets.sort(sortingFunction(sortingRule));

    return tickets;
};

export const selectTicketStatuses = state => state.tickets.statuses;

export const selectShowTicketModal = state => state.tickets.showTicketModal;

export const selectLastTicketKey = state => {
    let { lastAddedTicketKey } = state.tickets;

    if (!lastAddedTicketKey) {
        const tickets = selectTickets(state);

        lastAddedTicketKey = tickets[tickets.length - 1].key;
    }

    return lastAddedTicketKey;
};

export const selectNextTicketKey = state => {
    const key = selectLastTicketKey(state);
    const separator = "-";
    const ticketKeyParts = key.split(separator);
    let ticketNumber = ticketKeyParts[ticketKeyParts.length - 1];

    ticketKeyParts.splice(-1, 1, ++ticketNumber);

    return ticketKeyParts.join(separator);
};

export const selectTicketSeverities = state => state.tickets.severities;

// Return an object with functions for retrieving tickets depending on gadget configuration
export const selectGadgetTickets = state => {
    // Return recently added tickets, limit by provided argument
    const lastTicketsAdded = limit => {
        const tickets = selectSortedTickets(state, {
            sortingKey: "creationDate",
            direction: "desc"
        });

        return tickets.filter((ticket, index) => {
            return index < limit;
        });
    };

    // Return recently resolved tickets, limit by provided argument
    const lastTicketsResolved = limit => {
        const tickets = selectSortedTickets(state, {
            sortingKey: "lastModified",
            direction: "desc"
        });

        const sortedTickets = tickets.filter((ticket, index) => {
            return ticket.status === "2";
        });

        return sortedTickets.slice(0, limit);
    };

    return {
        lastTicketsAdded,
        lastTicketsResolved
    };
};
