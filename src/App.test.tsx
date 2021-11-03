import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import response from "./recruitment-challenge-payload.json";
import App from "./App";

test("renders the company logo", () => {
  const { getByRole } = render(<App />);

  expect(getByRole("img")).toBeInTheDocument();
});

describe("payroll", () => {
  const server = setupServer(
    rest.get(
      "https://splitc-public-files-bucket.s3.us-east-1.amazonaws.com/recruitment-challenge-payload.json",
      (req, res, ctx) => {
        return res(ctx.json(response));
      }
    )
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("shows the payroll title", async () => {
    render(<App />);

    const title = await waitFor(() => screen.getByText(/Confira o pagamento/));

    expect(title).toBeInTheDocument();
  });

  it("shows the creditor name", async () => {
    render(<App />);

    const creditorName = await waitFor(() => screen.getAllByText(/Ciclano/));

    creditorName.forEach((creditorNameOccurence) => {
      expect(creditorNameOccurence).toBeInTheDocument();
    });
  });
});
