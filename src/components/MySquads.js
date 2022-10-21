import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Text, FlatList } from "react-native";

import { getUserSquad } from "../apiCalls";

let counter = 0;
let color;

const assignColor = () => {
  if (counter === 1) {
    color = "#0000FF";
  } else if (counter === 2) {
    color = "#FF0000";
  } else if (counter === 3) {
    color = "#00FF00";
  } else if (counter === 4) {
    color = "#FFFF00";
  }
};

const MySquads = ({ userID }) => {
  const [userSquads, setUserSquads] = useState([]);

  useEffect(() => {
    getUserSquad(userID)
      .then(({ data }) => {
        const squads = data.map((attribute) => {
          return {
            competitive: attribute.attributes.squad.competitive
              ? "Competitive"
              : "Casual",
            eventTime: attribute.attributes.squad["event_time"],
            game: attribute.attributes.squad.game,
            members: attribute.attributes.squad.members,
            numberPlayers: attribute.attributes.squad["number_players"],
          };
        });

        setUserSquads(squads); 
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={userSquads}
        renderItem={(squadData) => {
          counter = 0;
          return (
            <View key={new Date() + squadData.item.eventTime} style={styles.squadCard}>
              <FlatList
                data={squadData.item.members}
                contentContainerStyle={styles.memberIcons}
                horizontal={true}
                renderItem={(memberData) => {
                  counter++;
                  assignColor();
                  return (
                    <Pressable key={new Date() + counter}>
                      <Text style={[styles.icon, { borderColor: color }]}>
                        {memberData.item.gamertag[0]}
                      </Text>
                    </Pressable>
                  );
                }}
              />
              <View style={styles.lowerContainer}>
                <View style={styles.detailsContainer}>
                  <Text style={styles.squadDetails}>{squadData.item.game}</Text>
                  <Text style={styles.squadDetails}>
                    {new Date(squadData.item.eventTime).toLocaleTimeString()} -{" "}
                    {new Date(squadData.item.eventTime).toLocaleDateString()}
                  </Text>
                  <Text style={styles.squadDetails}>
                    {squadData.item.competitive}
                  </Text>
                </View>
                <Pressable style={styles.notGoing}>
                  <Text style={styles.notGoingText}>Not Going</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#201626",
    alignItems: "center",
  },
  squadCard: {
    width: "95%",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#352540",
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 20,
  },
  memberIcons: {
    justifyContent: "space-evenly",
    width: "80%",
    marginTop: 10,
  },
  icon: {
    padding: 3,
    aspectRatio: "1/1",
    textAlign: "center",
    color: "#fff",
    fontSize: 30,
    borderWidth: 2,
    borderRadius: 25,
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

export default MySquads;