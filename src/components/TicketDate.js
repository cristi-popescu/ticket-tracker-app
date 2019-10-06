const TicketDate = props => {
    const formatDate = date => {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            hour12: false,
            minute: "numeric",
            second: "numeric"
        };
        const formattedDate = new Date(date);

        if (!isNaN(formattedDate.getTime())) {
            return formattedDate.toLocaleDateString("en-EN", options);
        } else {
            return "N/A";
        }
    };

    return formatDate(props.value);
};

export default TicketDate;
