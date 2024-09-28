import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { TransferTon } from "./components/TransferTon";
import styled from "styled-components";
import { FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import "@twa-dev/sdk";
import { useEffect } from 'react';
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

function App() {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand(); // Expand to the maximum available height
      tg.ready(); // Notify Telegram that the Web App is ready
    }
  }, []);

  useTonConnect();

  return (
    <TonConnectUIProvider manifestUrl="https://your-manifest-url.json">
      <Container>
        <AppContainer>
          <TransferTon />
        </AppContainer>
      </Container>
    </TonConnectUIProvider>
  );
}

export default App;
