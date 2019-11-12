export default {
    tickets: {
        items: {
            byIds: {},
            allIds: []
        },
        statuses: {
            byIds: {
                1: "Open",
                2: "Resolved"
            },
            allIds: [1, 2]
        },
        severities: {
            byIds: {
                1: "Trivial",
                2: "Minor",
                3: "Major",
                4: "Critical",
                5: "Blocker"
            },
            allIds: [1, 2, 3, 4, 5]
        },
        sortingRule: {
            sortingKey: "key",
            direction: "asc"
        },
        lastAddedTicketKey: "",
        showTicketModal: {
            status: false,
            editTicketKey: ""
        },
        requestStatus: {
            pending: false,
            error: ""
        }
    }
};
