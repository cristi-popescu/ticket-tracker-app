import moment from "moment";

const formatDate = date => {
    moment.locale("en");

    return moment(date).format("lll");
};

export default formatDate;
