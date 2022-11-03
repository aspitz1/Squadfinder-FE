import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Swiper from "react-native-swiper";

const ProfileScreen = ({
  user,
  userGames = user.userGames,
  error = "",
  setModalVisible = null,
}) => {
  const navigation = useNavigation();

  let games = userGames.map((game) => {
    return (
      <View style={styles.swiperSlide} key={game.id + new Date()}>
        <Image
          testID="ProfileScreenImg"
          source={{ uri: game.imageURL }}
          style={{ height: "100%", width: "100%", borderRadius: 20 }}
        ></Image>
        <Text style={styles.gameTitle}>{game.gameTitle}</Text>
      </View>
    );
  });

  return !user.gamertag && error ? (
    <SafeAreaView style={styles.errorContainer}>
      <Text style={styles.error}>{error}</Text>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>SquadFinder</Text>
      <View style={styles.info}>
        <Text style={styles.userInfo}>{user.gamertag}</Text>
        <Text style={styles.userInfo}>{user.platform}</Text>
      </View>
      <Text style={styles.userInfo}>My Games:</Text>
      <View style={styles.swiper}>
        <Swiper
          testID="gameSwiper"
          showsButtons={true}
          showsPagination={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {games}
        </Swiper>
      </View>
        <TouchableOpacity
          testID="editGamesBtn"
          style={styles.editButton}
          title="Edit My Games"
          onPress={() => navigation.navigate("My Games")}
        >
          <Text style={{ color: "#fff" }}>Edit My Games List</Text>
        </TouchableOpacity>
      <Text style={styles.rawg}>Powered by RAWG</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201626",
    alignItems: "center",
    justifyContent: "space-between"
  },
  header: {
    width: "100%",
    fontSize: 27,
    backgroundColor: "#483F6D",
    color: "#3AE456",
    textAlign: "center",
    padding: 10,
  },
  info: {
    height: "12%",
    backgroundColor: "#483F6D",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 50,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 60,
    shadowColor: "#000",
  },
  userInfo: {
    color: "#fff",
    fontSize: 20,
  },
  swiper: {
    flex: 2/3
  },
  swiperSlide: {
    height: "95%",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 20,
    shadowColor: "#3AE456",
  },
  gameTitle: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    backgroundColor: "rgba(0,0,0,.6)",
    overflow: "hidden",
  },
  editButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "6%",
    width: "40%",
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 60,
    shadowColor: "#000",
    borderWidth: 1,
    borderColor: "#3AE456",
    borderRadius: 20,
    backgroundColor: "#483F6D",
    marginTop: 10,
  },
  rawg: {
    marginTop: 20,
    color: "#555"
  },
  errorContainer: {
    backgroundColor: "#201626",
    textAlign: "center",
    minHeight: "100%",
    alignItems: "center",
  },
  error: {
    marginTop: 100,
    color: "red",
    textAlign: "center",
    fontSize: 20,
    width: "80%",
  },
  close: {
    backgroundColor: "#3AE456",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
  },
  closeText: {
    fontWeight: "bold",
  },
});

export default ProfileScreen;
