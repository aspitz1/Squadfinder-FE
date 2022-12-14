import { render, screen } from "@testing-library/react-native";
import SearchGamesScreen from "../src/components/SearchGamesScreen";

describe("<SearchGamesScreen />", () => {
  it("renders a text box input to allow the user to search for a game", () => {
    render(
      <SearchGamesScreen />
    )
    expect(screen.getByTestId("searchInput")).toBeVisible()
  })

  it("renders a dropdown menu to select a genre to filter games by", () => {
    render(
      <SearchGamesScreen />
    )
    expect(screen.getByText("Select a genre...")).toBeVisible()
  })

  it("renders a 'Search' button", () => {
    render(
      <SearchGamesScreen />
    )
    expect(screen.getByTestId("searchBtn")).toBeVisible()
  })

  it("renders a 'Clear Results' button", () => {
    render(
      <SearchGamesScreen />
    )
    expect(screen.getByTestId("clearResultsBtn")).toBeVisible()
  })

  it("renders a message crediting RAWG for our source of game data", () => {
    render(
      <SearchGamesScreen />
    );
    expect(screen.getByText("Powered by RAWG")).toBeVisible();
  });
})