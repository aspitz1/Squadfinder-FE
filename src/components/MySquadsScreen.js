import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Modal,
  SafeAreaView
} from "react-native";
import ProfileScreen from "./ProfileScreen";

import { getUserSquad, getSingleUser, deleteSquad } from "../apiCalls";
import { sortSquads } from "../utility-functions";

let counter = 0;
let color;

const assignColor = () => {
  if (counter === 1) {
    color = "#054890";
  } else if (counter === 2) {
    color = "#8F0000";
  } else if (counter === 3) {
    color = "#068246";
  } else if (counter === 4) {
    color = "#A5AB00";
  }
};

const MySquadsScreen = ({ userID }) => {
  const [userSquads, setUserSquads] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      getUserSquad(userID)
        .then(({ data }) => {
          const filteredSquads = data.filter((squad) => {
            return squad.attributes.squad.members.some(
              (member) => member.id.toString() === userID.toString()
            );
          });
          const squads = filteredSquads.map((attribute) => {
            return {
              id: attribute.id,
              competitive: attribute.attributes.squad.competitive
                ? "Competitive"
                : "Casual",
              eventTime: attribute.attributes.squad["event_time"],
              game: attribute.attributes.squad.game,
              members: attribute.attributes.squad.members.map((member) => {
                return {
                  gamertag: member.gamertag,
                  id: member.id,
                  platform: member.platform,
                  userGames: member.user_games,
                };
              }),
              numberPlayers: attribute.attributes.squad["number_players"],
            };
          });
          sortSquads(squads);
          setUserSquads(squads);
        })
        .catch(() => {
          setError("Something went wrong, please try again.");
        });
      return setError("");
    }, [userID])
  );

  const memberIconClickHandler = (id) => {
    setSelectedUser({});
    getSingleUser(id)
      .then(({ data }) => {
        const user = {
          gamertag: data.attributes.gamertag,
          platform: data.attributes.platform,
          id: data.id,
          userGames: data.attributes.user_games.map(game => {
            return {
              gameID: game.game_id,
              gameTitle: game.game_title,
              id: game.id,
              imageURL: game.image_url
            }
          })
        }
        setSelectedUser(user);
      })
      .then(() => setModalVisible(true));
  };

  const deleteSquadHandler = (userID, squadID) => {
    deleteSquad(userID, squadID)
      .then((response) => {
        if (response.ok) {
          const updateUserSquads = userSquads.filter(
            (squad) => squad.id !== squadID
          );
          setUserSquads(updateUserSquads);
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        setError("Something went wrong. You did not leave this squad.");
        setTimeout(() => {
          setError("");
        }, 4000);
      });
  };

  return error && !userSquads.length ? (
    <SafeAreaView style={styles.container}>
      <Text style={styles.error}>{error}</Text>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <ProfileScreen
          user={selectedUser}
          setModalVisible={setModalVisible}
        />
      </Modal>
      {error && <Text style={styles.errorNotGoing}>{error}</Text>}
      <FlatList
        data={userSquads}
        contentContainerStyle={{ paddingBottom: 200 }}
        keyExtractor={(squadData) => squadData.id}
        renderItem={(squadData) => {
          counter = 0;
          return (
            <View style={styles.squadCard}>
              <FlatList
                data={squadData.item.members}
                contentContainerStyle={styles.memberIcons}
                horizontal={true}
                keyExtractor={(memberData) =>
                  memberData.gamertag + Math.random() * 100
                }
                renderItem={(memberData) => {
                  counter++;
                  assignColor();
                  return (
                    <TouchableOpacity
                      onPress={() => memberIconClickHandler(memberData.item.id)}
                      style={{ backgroundColor: color, borderRadius: 20 }}
                    >
                      <Text style={styles.icon}>
                        {memberData.item.gamertag[0]}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <View style={styles.lowerContainer}>
                <View style={styles.detailsContainer}>
                  <Text style={styles.squadDetails}>{squadData.item.game}</Text>
                  <Text style={styles.squadDetails}>
                    {new Date(squadData.item.eventTime).toLocaleTimeString([], {
                      timeStyle: "short",
                    })}{" "}
                    - {new Date(squadData.item.eventTime).toLocaleDateString()}
                  </Text>
                  <Text style={styles.squadDetails}>
                    {squadData.item.competitive}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteSquadHandler(userID, squadData.item.id)}
                  style={styles.notGoing}
                >
                  <Text style={styles.notGoingText}>Not Going</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201626",
    alignItems: "center",
  },
  error: {
    marginTop: 50,
    marginRight: 20,
    marginLeft: 20,
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
    fontSize: 20,
  },
  errorNotGoing: {
    backgroundColor: "#000",
    position: "absolute",
    top: 0,
    width: "100%",
    color: "red",
    zIndex: 1,
    fontSize: 20,
    textAlign: "center",
  },
  squadCard: {
    width: "95%",
    marginTop: 15,
    alignItems: "center",
    marginLeft: 7,
    backgroundColor: "#352540",
    borderRadius: 20,
  },
  memberIcons: {
    justifyContent: "space-evenly",
    width: "80%",
    marginTop: 10,
  },
  icon: {
    padding: 3,
    aspectRatio: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 30,
  },
  lowerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
  },
  detailsContainer: {
    width: "65%",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#393051",
    borderRadius: 30,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 60,
    shadowColor: "#000",
  },
  squadDetails: {
    padding: 5,
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
  },
  notGoing: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#393051",
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 20,
  },
  notGoingText: {
    color: "#fff",
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
});

export default MySquadsScreen;
