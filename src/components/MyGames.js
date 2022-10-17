import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  Pressable,
  Image,
  Modal,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { userGames } from "../../mock-data/MockGamesList";
import GameDetailsScreen from "./GameDetailsScreen";

const MyGames = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [displayedGames, setDisplayedGames] = useState(userGames);
  // displayedGames will be set to the user's gameList, which I assume
  // will be passed from props.
  const inputHandler = (enteredText) => {
    setSearchInput(enteredText);
    const filteredGames = userGames.filter((game) =>
      game.title.toLowerCase().includes(enteredText.toLowerCase())
    );
    if (enteredText === "") {
      setDisplayedGames(userGames);
    } else {
      setDisplayedGames(filteredGames);
    }
  };

  const iconClickHandler = (game) => {
    setSelectedGame(game);
    setModalVisible(true);
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
        <GameDetailsScreen
          game={selectedGame}
          setModalVisible={setModalVisible}
        />
      </Modal>
      <TextInput
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
          contentContainerStyle={{ alignItems: "center" }}
          renderItem={(itemData) => {
            return (
              <Pressable
                title="User's Game"
                style={styles.gameIcon}
                onPress={() => iconClickHandler(itemData.item)}
              >
                <Image
                  source={{ uri: `${itemData.item.image}` }}
                  resizeMode="stretch"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderWidth: 1,
                    borderRadius: 20,
                    bottom: 0,
                  }}
                ></Image>
              </Pressable>
            );
          }}
        ></FlatList>
      </View>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#352540",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  textInput: {
    borderWidth: 2,
    width: 250,
    height: 30,
    color: "white",
    borderRadius: 5,
    borderColor: "#3AE456",
    padding: 5,
  },
  gamesContainer: {
    borderColor: "#5462A4",
    borderWidth: 1,
    borderRadius: 20,
    width: "100%",
    height: "80%",
  },
  gameIcon: {
    height: 200,
    width: 170,
    justifyContent: "center",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 20,
    margin: 5,
  },
});

export default MyGames;
