import { useState, useEffect } from "react";
import styled from "styled-components";
import { Address, toNano } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";
import { TonConnectButton } from "@tonconnect/ui-react";
import React from 'react';
import logo from "../assets/logoalphadhad.png"; // Updated filename

// Modify the imported Card component
const CenteredContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ConnectButtonContainer = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 1;
`;

const CardContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledCard = styled.div`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const FIXED_RECIPIENT = "0QA-SIdhrnCMWreFcJ7zrrVV8kIlrqPJ5Em4yenvRJGiUned";
const MIN_AMOUNT = 20;

const ErrorText = styled.p`
  color: red;
  font-size: 16px; // Increased from 14px
  margin-top: 8px; // Increased from 5px
`;

const Headline = styled.h2`
  text-align: center;
  color: #FFC500;
  margin-bottom: 15px; // Increased from 10px
  font-size: 22px; // Increased from default
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
`;

const InputLabel = styled.label`
  font-size: 16px;
  margin-right: 10px;
  white-space: nowrap;
  min-width: 70px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const StyledInput = styled(Input)`
  flex: 0.8;
  font-size: 14px;
  padding: 8px;
  margin-right: 24px;
`;

const UnitLabel = styled.span`
  font-size: 16px;
  white-space: nowrap;
`;

const AddressContainer = styled.div`
  font-size: 14px;
  word-break: break-all;
  margin-bottom: 15px;
`;

const AddressLabel = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const AddressValue = styled.span`
  font-family: monospace;
`;
const StyledButton = styled(Button)`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  margin-top: 10px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: -30px;
`;

const Logo = styled.img`
  max-width: 150px; // Adjust size as needed
  height: auto;
`;

const ContentContainer = styled.div`
  text-align: center;
  margin-bottom: 30px;
  direction: rtl; // Added RTL direction
`;

const SubHeadline = styled.h2`
  font-family: 'Martian Mono', monospace;
  font-size: 14px;
  color: white;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const BulletList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-family: 'Martian Mono', monospace;
  color: white;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const BulletPoint = styled.li`
  margin-bottom: 10px;
  &:before {
    content: "• ";
    color: #FFC500;
    margin-left: 5px;
    float: right;
  }

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0; // Remove padding
  color: white;
  font-family: 'Arial', sans-serif;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px; // Add padding here
`;

const DisclaimerLink = styled.a`
  margin-top: 20px;
  color: #222222;
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
`;

const TextContainer = styled.div`
  color: ${props => props.theme.mode === 'dark' ? '#ffffff' : '#000000'};
  background-color: ${props => props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const formatAddress = (address: string) => {
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}....${address.slice(-4)}`;
};

export function TransferTon() {
  const { sender, connected } = useTonConnect();
  const [tonAmount, setTonAmount] = useState(MIN_AMOUNT.toString());
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    validateAmount(tonAmount);
  }, [tonAmount]);

  const validateAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < MIN_AMOUNT) {
      setError(`The minimum approved value is ${MIN_AMOUNT} TON`);
    } else {
      setError("");
    }
  };

  const handleTransfer = async () => {
    setIsLoading(true);
    try {
      await sender.send({
        to: Address.parse(FIXED_RECIPIENT),
        value: toNano(tonAmount),
      });
      // Handle successful transfer
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Transfer failed: ${err.message}`);
      } else {
        setError('An unknown error occurred during transfer');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <LogoContainer>
          <Logo src={logo} alt="Alphadhad Logo" />
        </LogoContainer>
        <ContentContainer>
          <SubHeadline>طريقة المشاركة في الاكتتاب</SubHeadline>
          <BulletList>
            <BulletPoint>اضغط Connect Wallet في الاسفل وقم بربط محفظتك</BulletPoint>
            <BulletPoint>ادخل الكمية التي تريد المشاركة بها من عملة TON علما ان الحد الادنى هو 20 TON</BulletPoint>
            <BulletPoint>اضغط على Transfer وقم بتأكيد المعاملة من محفظتك</BulletPoint>
          </BulletList>
        </ContentContainer>
        
        <ConnectButtonContainer>
          <TonConnectButton />
        </ConnectButtonContainer>
        
        <CardContainer>
          <Headline>Alphadhad $AX Pre-sale</Headline>
          <SubHeadline>Transfer TON</SubHeadline>
          <FlexContainer>
            <InputLabel>Amount</InputLabel>
            <InputWrapper>
              <StyledInput
                type="number"
                value={tonAmount}
                onChange={(e) => setTonAmount(e.target.value)}
                min={MIN_AMOUNT}
              />
              <UnitLabel>$TON</UnitLabel>
            </InputWrapper>
          </FlexContainer>
          {error && <ErrorText>{error}</ErrorText>}
          <AddressContainer>
            <AddressLabel>To:</AddressLabel>
            <AddressValue title={FIXED_RECIPIENT}>{formatAddress(FIXED_RECIPIENT)}</AddressValue>
          </AddressContainer>
          <StyledButton
            disabled={!connected || !!error || isLoading}
            onClick={handleTransfer}
          >
            {isLoading ? "Processing..." : "Transfer"}
          </StyledButton>
        </CardContainer>
      </ContentWrapper>
      <DisclaimerLink href="https://www.alphadhad.com/disclaimer" target="_blank" rel="noopener noreferrer">
        Disclaimer
      </DisclaimerLink>
    </PageContainer>
  );
}
