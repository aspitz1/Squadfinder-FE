import { useState, useCallback, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Pressable,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import { postSquad } from "../apiCalls";

const FormSquadScreen = ({ allUsers, userGames, userID }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showing, setShowing] = useState(false);
  const [selected, setSelected] = useState("");
  const [users, setUsers] = useState(allUsers);
  const [filterByNameValue, setFilterByNameValue] = useState("");
  const [squadMembers, setSquadMembers] = useState([]);
  const [competitive, setCompetitive] = useState(false);
  const [squadFull, setSquadFull] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();
  const dropdownRef = useRef({});

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDate(new Date());
        setFilterByNameValue("");
        setSquadMembers([]);
        setCompetitive(false);
        setSquadFull(false);
        setError("");
        setSelected("");
        dropdownRef.current.reset();
      };
    }, [])
  );

  const formSquadHandler = () => {
    const squad = {
      id: userID,
      game: selected,
      eventTime: date.toISOString(),
      numberPlayers: squadMembers.length,
      competitive: competitive,
      squadMembers: squadMembers,
    };

    postSquad(squad)
      .then(() => {
        navigation.navigate("My Squads");
      })
      .catch(() => {
        setError("Something went wrong. Your squad has not been made.");
        setTimeout(() => {
          setError("");
        }, 3000);
      });
  };

  const calenderHandler = (event, selectedDate) => {
    if (event.type !== "dismissed") {
      const currentDate = selectedDate;
      if (Platform.OS === "android") {
        setShowing(false);
      }
      setDate(currentDate);
    }
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShowing(!showing);
  };

  const showDatePicker = () => {
    showMode("date");
  };

  const showTimePicker = () => {
    showMode("time");
  };

  const handleSelectGame = (selectedGame) => {
    setSelected(selectedGame);
    filterUsersByGame(selectedGame);
  };

  const filterUsersByGame = (selectedGame) => {
    const filteredUsers = allUsers.reduce((arr, user) => {
      const usersWithGame = user.userGames.filter(
        (game) => game.gameTitle === selectedGame
      );
      if (usersWithGame.length) {
        arr.push(user);
      }
      return arr;
    }, []);
    setUsers(filteredUsers);
  };

  const filterUserByName = (input) => {
    if (input) {
      setFilterByNameValue(input);
      const filteredUsers = users.filter((user) =>
        user.gamertag.toLocaleLowerCase().includes(input.toLocaleLowerCase())
      );
      setUsers(filteredUsers);
    } else {
      setFilterByNameValue("");
      setUsers(allUsers);
    }
  };

  const inviteSquadMemberHandler = (id) => {
    if (squadMembers.includes(id)) {
      setSquadFull(false);
      const updatedSquadMember = squadMembers.filter((member) => member !== id);
      setSquadMembers(updatedSquadMember);
    } else if (squadMembers.length < 3) {
      setSquadMembers((currentSquadMembers) => [...currentSquadMembers, id]);
    }

    if (squadMembers.length === 3) {
      setSquadFull(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SelectDropdown
        data={userGames.map((game) => game.gameTitle)}
        ref={dropdownRef}
        defaultButtonText={"Select Game"}
        onSelect={(selectedGame) => handleSelectGame(selectedGame)}
        buttonStyle={styles.selectGameBtnStyle}
        buttonTextStyle={styles.selectGameBtnTextStyle}
        dropdownStyle={styles.selectGameDropdownStyle}
        rowStyle={{ backgroundColor: "#352540" }}
        rowTextStyle={styles.selectGameRowTextStyle}
      />
      <Pressable
        onPress={() => setCompetitive(!competitive)}
        style={styles.competitiveBtn}
      >
        <Text style={styles.competitiveTxt}>
          {competitive ? "Competitive" : "Casual"}
        </Text>
        <View
          style={
            competitive
              ? styles.competitiveBoxCompetitive
              : styles.competitiveBoxCasual
          }
        ></View>
      </Pressable>
      <TouchableOpacity onPress={showDatePicker} style={styles.chooseDateBtn}>
        <Text style={styles.chooseDateTimeTxt}>Choose Date</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showTimePicker} style={styles.chooseTimeBtn}>
        <Text style={styles.chooseDateTimeTxt}>Choose Time</Text>
      </TouchableOpacity>
      <Text style={styles.selectedTimeTxt}>
        {date.getMonth() +
          1 +
          "/" +
          date.getDate() +
          "/" +
          date.getFullYear() +
          " AT " +
          date.getHours() +
          ":" +
          (date.getMinutes() < 10 ? "0" : "") +
          date.getMinutes()}
      </Text>
      <View>
        {showing && (
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={calenderHandler}
            minimumDate={new Date()}
            style={styles.datePicker}
          />
        )}
      </View>
      <TextInput
        value={filterByNameValue}
        onChangeText={(input) => filterUserByName(input)}
        placeholder="Filter Users by Name"
        placeholderTextColor="grey"
        style={styles.filterByNameInput}
      />
      <View style={styles.userList}>
        {users.length ? (
          <FlatList
            data={users}
            renderItem={({ item }) => {
              return (
                <View style={styles.userContainer}>
                  <Text style={styles.userGamerTag}>{item.gamertag}</Text>
                  <Pressable
                    style={
                      squadMembers.includes(item.id)
                        ? styles.invitedBtn
                        : styles.inviteBtn
                    }
                  >
                    <Text
                      onPress={() => inviteSquadMemberHandler(item.id)}
                      style={
                        squadMembers.includes(item.id)
                          ? styles.invited
                          : styles.inviteText
                      }
                    >
                      Invite
                    </Text>
                  </Pressable>
                </View>
              );
            }}
          />
        ) : (
          <Text style={styles.noGamers}>Sorry, there are no users with this Gamer Tag.</Text>
        )}
        {squadMembers.length === 3 && (
          <View style={styles.squadsFullContainer}>
            <Text style={styles.squadsFullTxt}>Squads Full</Text>
          </View>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.formSquadBtn}
        disabled={!selected && !squadMembers.length}
        onPress={formSquadHandler}
      >
        <Text style={styles.formSquadText}>"FORM SQUAD!"</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#201626",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  selectGameBtnStyle: {
    width: "90%",
    backgroundColor: "#393051",
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 5,
  },
  selectGameBtnTextStyle: {
    color: "#fff",
  },
  selectGameDropdownStyle: {
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 60,
    shadowColor: "#3AE456",
    borderWidth: 2,
    backgroundColor: "#393051",
    borderRadius: 5,
  },
  selectGameRowTextStyle: {
    color: "#3AE456",
  },
  competitiveBtn: {
    flexDirection: "row",
  },
  competitiveBoxCasual: {
    backgroundColor: "#fff",
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 5,
    shadowColor: "black",
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 60,
  },
  competitiveBoxCompetitive: {
    backgroundColor: "#3AE456",
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 5,
    shadowColor: "black",
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 60,
  },
  competitiveTxt: {
    marginRight: 10,
    fontSize: 21,
    color: "#fff",
    minWidth: 120,
    textAlign: "center",
  },
  chooseDateBtn: {
    backgroundColor: "#393051",
    width: "90%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 20,
  },
  chooseDateTimeTxt: {
    color: "#fff",
    padding: 10,
    fontSize: 17,
  },
  chooseTimeBtn: {
    backgroundColor: "#393051",
    width: "90%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 20,
  },
  selectedTimeTxt: {
    paddingTop: 10,
    fontSize: 20,
    color: "#3AE456",
  },
  datePicker: {
    width: 130,
  },
  filterByNameInput: {
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 5,
    width: "90%",
    padding: 10,
    textAlign: "center",
  },
  userList: {
    backgroundColor: "#393051",
    width: "90%",
    flex: 2/3,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  formSquadBtn: {
    backgroundColor: "#393051",
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
  },
  formSquadText: {
    color: "#fff",
    fontWeight: "bold",
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 30,
    paddingLeft: 30,
  },
  noGamers: {
    marginTop: 60,
    fontSize: 20,
    textAlign: "center",
    color: "#fff"
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#5462A4",
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
  },
  userGamerTag: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 30,
    paddingLeft: 30,
    color: "#fff",
    fontSize: 16,
  },
  inviteBtn: {
    backgroundColor: "#352540",
    marginRight: 30,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3AE456",
    shadowColor: "black",
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 60,
  },
  invitedBtn: {
    backgroundColor: "#3AE456",
    marginRight: 30,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3AE456",
    shadowColor: "black",
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 60,
  },
  invited: {
    backgroundColor: "#3AE456",
    color: "#000",
  },
  inviteText: {
    color: "#fff",
  },
  squadsFullContainer: {
    backgroundColor: "#3AE456",
    width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  squadsFullTxt: {
    fontWeight: "bold",
    paddingTop: 2,
    paddingBottom: 2,
    textAlign: "center",
  },
  errorContainer: {
    position: "absolute",
    marginTop: 510,
    width: "60%",
    backgroundColor: "red",
    borderRadius: 5,
    zIndex: 1,
  },
  error: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 5,
    paddingLeft: 5,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default FormSquadScreen;
