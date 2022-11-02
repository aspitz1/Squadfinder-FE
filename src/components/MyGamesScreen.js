import React, { useState, useEffect } from "react";
import { FlatList, TextInput } from "react-native-gesture-handler";
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  Modal,
  Text,
  SafeAreaView,
} from "react-native";

import { sortGames } from "../utility-functions";

import LoadingModal from "./LoadingModal";
import GameDetailsScreen from "./GameDetailsScreen";

const MyGamesScreen = ({ userGames, addGame, removeGame, userID }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [displayedGames, setDisplayedGames] = useState(userGames);

  useEffect(() => {
    setDisplayedGames(sortGames(userGames));
  }, [userGames]);

  const inputHandler = (enteredText) => {
    setSearchInput(enteredText);
    setDisplayedGames(
      userGames.filter((game) =>
        game.gameTitle.toLowerCase().includes(enteredText.toLowerCase())
      )
    );
  };

  const iconClickHandler = (game) => {
    fetch(`https://squadfinder2205be.herokuapp.com/api/v1/games/${game.gameID}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedGame(data);
      });
    setModalVisible(true);
    setSelectedGame(null);
  };

  return (
    <SafeAreaView style={styles.container}>
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
        testID="search-bar"
        placeholder="Search by title..."
        placeholderTextColor="grey"
        value={searchInput}
        onChangeText={inputHandler}
        style={styles.textInput}
      />
      <View style={styles.gamesContainer}>
        <FlatList
          data={displayedGames}
          numColumns={2}
          contentContainerStyle={{ alignItems: "center", marginTop: 10 }}
          renderItem={(itemData) => {
            return (
              <Pressable
                title="User's Game"
                style={styles.gameIcon}
                onPress={() => iconClickHandler(itemData.item)}
              >
                <Image
                  testID={`users-game-icon-${itemData.item.id}`}
                  source={{ uri: `${itemData.item.imageURL}` }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                    borderWidth: 2,
                    bottom: 0,
                  }}
                ></Image>
                <Text style={styles.gameTitle}>{itemData.item.gameTitle}</Text>
              </Pressable>
            );
          }}
        ></FlatList>
      </View>
      <Text style={styles.rawg}>Powered by RAWG</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201626",
    alignItems: "center",
    justifyContent: "space-around"
  },
  textInput: {
    borderWidth: 1,
    width: "70%",
    height: 35,
    color: "white",
    borderRadius: 5,
    borderColor: "#3AE456",
    padding: 5,
    margin: 15,
  },
  gamesContainer: {
    borderColor: "#5462A4",
    borderTopWidth: 1,
    width: "100%",
    height: "85%",
  },
  gameIcon: {
    height: 200,
    width: 170,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3AE456",
    margin: 10,
  },
  rawg: {
    height: "5%",
    color: "#555",
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
});

export default MyGamesScreen;
