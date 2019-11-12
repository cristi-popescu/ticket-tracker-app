import React from "react";
import { Header } from "./Header";
import renderer from "react-test-renderer";

test("Header renders correctly", () => {
    const component = renderer.create(<Header />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
