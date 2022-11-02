import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import ProfileScreen from "./src/components/ProfileScreen";
import MyGamesScreen from "./src/components/MyGamesScreen";
import SearchGamesScreen from "./src/components/SearchGamesScreen";
import FormSquadScreen from "./src/components/FormSquadScreen";
import MySquadsScreen from "./src/components/MySquadsScreen";
import CustomDrawer from "./src/components/CustomDrawer";

import { getAllUsers, getSingleUser } from "./src/apiCalls";
import { sortGames } from "./src/utility-functions";

const Drawer = createDrawerNavigator();

const App = () => {
  const [userGames, setUserGames] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getSingleUser(5)
      .then(({ data }) => {
        setError("");
        const userData = {
          id: data.id,
          gamertag: data.attributes.gamertag,
          platform: data.attributes.platform,
          userGames: data.attributes.user_games.map((game) => {
            return {
              gameTitle: game.game_title,
              gameID: game.game_id,
              id: game.id,
              imageURL: game.image_url,
              userID: game.user_id,
            };
          }),
        };
        sortGames(userData.userGames);
        setCurrentUser(userData);
        setUserGames(userData.userGames);
      })
      .catch(() =>
        setError("Looks like something went wrong retrieving the user data.")
      );

    getAllUsers()
      .then(({ data }) => {
        const usersData = data.map((user) => {
          return {
            id: user.id,
            gamertag: user.attributes.gamertag,
            platform: user.attributes.platform,
            userGames: user.attributes.user_games.map((game) => {
              return {
                gameTitle: game.game_title,
                gameID: game.game_id,
                id: game.id,
                imageURL: game.image_url,
                userID: game.user_id,
              };
            }),
          };
        });
        setAllUsers(usersData);
      })
      .catch(() =>
        setError("Looks like something went wrong retrieving the user data.")
      );
  }, []);

  const addGame = (game) => {
    setUserGames((currentUserGames) => sortGames([...currentUserGames, game]));
  };

  const removeGame = (gameID) => {
    const updatedUserGames = userGames.filter(
      (userGame) => userGame.gameID !== gameID
    );
    setUserGames(updatedUserGames);
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          drawerLabelStyle: {
            color: "#3AE456",
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: "#000",
          },
          headerTintColor: "#3AE456",
        }}
      >
        <Drawer.Screen name="Profile">
          {() => (
            <ProfileScreen
              error={error}
              setError={setError}
              user={currentUser}
              userGames={userGames}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="My Games">
          {() => (
            <MyGamesScreen
              userGames={userGames}
              addGame={addGame}
              removeGame={removeGame}
              userID={currentUser.id}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Search for Games">
          {() => (
            <SearchGamesScreen
              userGames={userGames}
              addGame={addGame}
              removeGame={removeGame}
              userID={currentUser.id}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Form Squad">
          {() => (
            <FormSquadScreen
              userGames={userGames}
              allUsers={allUsers.filter((user) => user.id !== currentUser.id)}
              userID={currentUser.id}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="My Squads">
          {() => <MySquadsScreen userID={currentUser.id} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
