import React from "react";
import logo from "./logo.svg";
import styled from "styled-components";

import { toBrl } from "./utils/currencry";

const Logo = styled.img`
  width: 200px;
`;

type PayrollResponse = {
  id: string;
  creditor_name: string;
  company_name: string;
  value: number;
};

const sum = (payload: PayrollResponse[]): number => {
  const perCreditor = payload.reduce((accumulator, item) => {
    return {
      ...accumulator,
      [item.id]: item,
    };
  }, {} as { [key: string]: PayrollResponse });

  return Object.keys(perCreditor).reduce(
    (acc, item) => acc + perCreditor[item].value,
    0
  );
};

function App() {
  const [isLoading, setLoading] = React.useState(true);
  const [state, setState] = React.useState<PayrollResponse[]>([]);

  React.useEffect(() => {
    async function get() {
      const d = await fetch(
        "https://splitc-public-files-bucket.s3.us-east-1.amazonaws.com/recruitment-challenge-payload.json"
      );
      const json = await d?.json();
      setLoading(false);
      setState(json);
    }
    get();
  }, []);

  return (
    <div>
      <header>
        <Logo src={logo} alt="logo" />
      </header>
      {isLoading && <div>carregando...</div>}
      {!isLoading && (
        <div>
          <h1>Confira o pagamento de cada funcionário:</h1>
          {state.map((salary) => (
            <ul key={salary.id + salary.company_name}>
              <li>
                {salary.creditor_name}
                <ul>
                  <li>{salary.company_name}</li>
                  <li>{toBrl(salary.value)}</li>
                </ul>
              </li>
            </ul>
          ))}
          <div>total: {toBrl(sum(state))}</div>
        </div>
      )}
    </div>
  );
}

export default App;
