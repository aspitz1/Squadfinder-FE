import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

const LoadingModal = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        style={styles.activityIndicator}
        size="large"
        color="#3AE456"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#201626",
  },
  activityIndicator: {
    marginTop: 150 
  }
});

export default LoadingModal;
