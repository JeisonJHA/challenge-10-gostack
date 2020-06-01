import styled from 'styled-components';

export const FoodsContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 40px;
  margin-top: -140px;

  display: grid;

  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 1140px) {
    grid-template-columns: repeat(3, 1fr);
  }
  grid-gap: 32px;
`;
