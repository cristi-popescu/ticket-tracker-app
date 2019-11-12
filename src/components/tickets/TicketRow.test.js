import React from "react";
import TicketRow from "./TicketRow";
import renderer from "react-test-renderer";

describe("TicketRow", () => {
  test("renders correctly", () => {
    const ticketRowProps = {
      ticket: {
        status: "1",
        severity: "3",
        name: "Ticket 1",
        description: "Lorem ipsum 1",
        lastModified: "2019-11-09T15:56:11.623Z",
        key: "TCK-1",
        creationDate: "2019-10-07T20:40:53.003Z",
        id: "kXsAeFG"
      },
      tableColumns: {
        key: "Key",
        name: "Name",
        status: "Status",
        creationDate: "Creation Date",
        lastModified: "Last Modified"
      },
      sortingRule: {
        sortingKey: "key",
        direction: "asc"
      }
    };
    const component = renderer.create(<TicketRow {...ticketRowProps} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
