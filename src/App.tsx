import { Anchor, Box, Container, Text } from "@mantine/core";
import { Redirect, Route, Switch } from "wouter";
import { Header } from "./components/Header.tsx";
import { BoostView } from "./views/BoostView.tsx";
import { PredictView } from "./views/PredictView.tsx";

export default function App() {
  return (
    <Box
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />

      <Container size="md" pb="4rem" style={{ flex: 1, width: "100%" }}>
        <Switch>
          <Route path="/" component={() => <Redirect to="/predict" />} />
          <Route path="/predict" component={PredictView} />
          <Route path="/boost" component={BoostView} />
          <Route component={() => <Redirect to="/predict" />} />
        </Switch>
      </Container>

      {/* Subtle Swiss Editorial Footer */}
      <Box
        component="footer"
        py="lg"
        style={{
          borderTop: "1px solid var(--mantine-color-default-border)",
          textAlign: "center",
        }}
      >
        <Container size="md">
          <Text size="xs" c="dimmed">
            Brewcolator — Minimalist Homebrew Fermentation Engine. Made with 😂
            by{" "}
            <Anchor
              href="https://rewdy.lol"
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              c="inherit"
              underline="always"
            >
              rewdy
            </Anchor>
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
