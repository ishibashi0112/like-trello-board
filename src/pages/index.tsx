import { Container, Header, Title } from "@mantine/core";
import React from "react";

import { Board } from "../pages-component/Index/Board";

const Home = () => {
  return (
    <div>
      <Header height={50} p="sm">
        <Title order={4}>text</Title>
      </Header>

      <Container className="p-6" size="lg">
        <Board />
      </Container>
    </div>
  );
};

export default Home;
