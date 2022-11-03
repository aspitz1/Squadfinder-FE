import React, { useState, useRef } from "react";
import { FlatList, TextInput } from "react-native-gesture-handler";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Text,
} from "react-native";

import { searchFetch, getSingleGame } from "../apiCalls";
import genres from "../genres";

import SelectDropdown from "react-native-select-dropdown";
import LoadingModal from "./LoadingModal";
import GameDetailsScreen from "./GameDetailsScreen";

const SearchGamesScreen = ({ userGames, addGame, removeGame, userID }) => {
  const [displayedGames, setDisplayedGames] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [error, setError] = useState(false);
  const [searching, setSearching] = useState(false);

  const dropdownRef = useRef({});

  const inputHandler = (enteredText) => {
    setSearchInput(enteredText);
    setError(false);
  };

  const genreHandler = (genre) => {
    setSelectedGenre(genre);
  };

  const searchHandler = () => {
    setShowGames(false);
    if (searchInput !== "") {
      setSearching(true);
      searchFetch(searchInput).then((data) => {
        let filteredData = data.filter((game) => game.image !== null);
        if (selectedGenre !== "") {
          const filteredByGenre = filteredData.filter((game) =>
            game.genres.includes(selectedGenre)
          );
          setSearching(false);
          setDisplayedGames(filteredByGenre);
          setShowGames(true);
        } else {
          setSearching(false);
          setDisplayedGames(filteredData);
          setShowGames(true);
        }
      });
      setError(false);
    } else {
      setError(true);
    }
  };

  const clearResults = () => {
    setShowGames(false);
    setSearchInput("");
    setSelectedGenre("");
    dropdownRef.current.reset();
  };

  const iconClickHandler = (game) => {
    getSingleGame(game).then((data) => {
      setSelectedGame(data);
    });
    setModalVisible(true);
    setSelectedGame("");
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {selectedGame ? (
          <GameDetailsScreen
            game={selectedGame}
            userGames={userGames}
            addGame={addGame}
            removeGame={removeGame}
            setModalVisible={setModalVisible}
            userID={userID}
          />
        ) : (
          <LoadingModal />
        )}
      </Modal>
      <TextInput
        testID="searchInput"
        placeholder="Search by title..."
        placeholderTextColor="grey"
        value={searchInput}
        onChangeText={inputHandler}
        style={styles.textInput}
      />
      {error && (
        <Text style={{ margin: -5, color: "red" }}>
          * You must enter a title
        </Text>
      )}
      <SelectDropdown
        data={genres}
        search={true}
        searchPlaceHolder="Genre..."
        buttonStyle={styles.selectListBox}
        buttonTextStyle={{ color: "#3AE456" }}
        rowStyle={{ backgroundColor: "#352540" }}
        rowTextStyle={{ color: "#3AE456" }}
        searchInputStyle={styles.selectListBox}
        searchInputTxtColor="#3AE456"
        dropdownStyle={styles.selectListDropdown}
        defaultButtonText="Select a genre..."
        ref={dropdownRef}
        onSelect={(genre) => genreHandler(genre)}
      />
      <TouchableOpacity
        testID="searchBtn"
        style={styles.searchButton}
        onPress={() => searchHandler()}
      >
        <Text style={{ fontSize: 20, color: "#3AE456" }}>Search</Text>
      </TouchableOpacity>
      {searching && <LoadingModal />}
      {showGames && displayedGames ? (
        displayedGames.length ? (
          <View style={styles.gamesContainer}>
            <FlatList
              data={displayedGames}
              numColumns={2}
              contentContainerStyle={{ alignItems: "center" }}
              renderItem={(itemData) => {
                return (
                  <TouchableOpacity
                    title="User's Game"
                    style={styles.gameIcon}
                    onPress={() => iconClickHandler(itemData.item)}
                  >
                    <Image
                      source={{ uri: `${itemData.item.image}` }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderWidth: 2,
                        borderRadius: 20,
                        bottom: 0,
                      }}
                    ></Image>
                    <Text style={styles.gameTitle}>{itemData.item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            ></FlatList>
          </View>
        ) : (
          <View style={{ flex: 5 / 6 }}>
            <Text style={styles.noResults}>
              Sorry, we couldn't find a result.
            </Text>
          </View>
        )
      ) : (
        <View style={{ flex: 5 / 6 }}></View>
      )}
      <TouchableOpacity
        testID="clearResultsBtn"
        style={styles.clearButton}
        onPress={() => clearResults()}
      >
        <Text style={{ color: "#fff" }}>Clear Results</Text>
      </TouchableOpacity>
      <Text style={styles.rawg}>Powered by RAWG</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201626",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  textInput: {
    borderWidth: 1,
    width: 250,
    height: 35,
    color: "white",
    borderRadius: 5,
    borderColor: "#3AE456",
    padding: 5,
    marginTop: 10,
    marginBottom: 0,
  },
  gamesContainer: {
    flex: 5 / 6,
    borderTopWidth: 1,
    width: "100%",
    borderColor: "#5462A4",
  },
  gameIcon: {
    height: 200,
    width: 170,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 20,
    margin: 10,
  },
  gameTitle: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    backgroundColor: "rgba(0,0,0,.6)",
    overflow: "hidden",
  },
  selectListBox: {
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 5,
    backgroundColor: "#393051",
    height: 35,
    width: 250,
    marginTop: 5,
  },
  selectListDropdown: {
    backgroundColor: "#393051",
  },
  searchButton: {
    width: 150,
    height: 30,
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 20,
    backgroundColor: "#393051",
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    width: 150,
    padding: 8,
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 20,
    backgroundColor: "#393051",
    justifyContent: "center",
    alignItems: "center",
  },
  rawg: {
    fontSize: 15,
    color: "#555"
  },
  noResults: {
    marginTop: 150,
    fontSize: 20,
    color: "#3AE456",
  },
  searchingMessage: {
    marginTop: 150,
    color: "#3AE456",
    fontSize: 20,
  },
});

export default SearchGamesScreen;
