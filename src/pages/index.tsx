import { Container, Header, Tabs, Title } from "@mantine/core";
import React from "react";

import { Board } from "../pages-component/Index/Board";

const Home = () => {
  return (
    <div>
      <Header height={50} p="sm">
        <Title order={4}>text</Title>
      </Header>

      <Container className="p-3" size="lg" p={3}>
        <Tabs defaultValue="board">
          <Tabs.List>
            <Tabs.Tab value="board">Board</Tabs.Tab>
            <Tabs.Tab value="grid">Grid</Tabs.Tab>
            {/* <Tabs.Tab value="form">Form</Tabs.Tab> */}
          </Tabs.List>

          <Tabs.Panel value="board" pt="xs">
            <Board />
          </Tabs.Panel>

          <Tabs.Panel value="grid" pt="xs">
            Messages tab content
          </Tabs.Panel>

          {/* <Tabs.Panel value="form" pt="xs">
            Messages tab content
          </Tabs.Panel> */}
        </Tabs>
      </Container>
    </div>
  );
};

export default Home;
