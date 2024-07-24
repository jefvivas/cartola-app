import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  header: {
    flex: 1,
    backgroundColor: "lightgray",
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },
  scrollViewContent: {
    alignItems: "center",
  },
  scoreContainer: {
    width: windowWidth,
    padding: 10,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: "lightgray",
    flexDirection: "row",
  },
  evenScore: {
    backgroundColor: "#ffffff",
  },
  oddScore: {
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  pickerContainer: {
    height: 50,
    width: 250,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default function PartialResultScreen({ navigation }: any) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [round, setRound] = useState(0);
  const [sortedData, setSortedData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://da65a8cz49.execute-api.sa-east-1.amazonaws.com/prod/get-teams-scores"
        );

        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data && data.scores && round >= 0) {
      const sortedUsefulData = data.scores.map((score: any) => ({
        teamOwner: score.team_owner,
        teamName: score.team_name,
        score: score.score[round],
      }));

      const sortedScores = sortedUsefulData.sort(
        (a: any, b: any) => b.score - a.score
      );

      setSortedData(sortedScores);
    }
  }, [data, round]);

  const handleRoundChange = (round: number) => {
    setRound(round);
  };

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const scoreItems = data.scores[0].score.map((_: any, index: number) => ({
    label: `Rodada ${index + 1}`,
    value: index,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          items={scoreItems}
          onValueChange={(itemValue) => handleRoundChange(itemValue)}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: {
              fontSize: 16,
              padding: 10,
              color: "gray",
            },
            inputAndroid: {
              fontSize: 16,
              padding: 10,
              color: "#000",
              textAlign: "center",
            },
          }}
          value={round}
        ></RNPickerSelect>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <>
            {data && data.scores ? (
              <View>
                <View style={styles.header}>
                  <View style={{ flexDirection: "row", flex: 3 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Time
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                    }}
                  ></View>
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      Pontuação{" "}
                    </Text>
                  </View>
                </View>
                {sortedData &&
                  sortedData.map((score: any, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.scoreContainer,
                        index % 2 === 0 ? styles.evenScore : styles.oddScore,
                      ]}
                    >
                      <View style={{ flexDirection: "column", flex: 3 }}>
                        <Text style={{ fontSize: 15 }}>{score.teamName}</Text>
                        <Text style={{ fontSize: 12 }}>{score.teamOwner}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{score.score}</Text>
                      </View>
                    </View>
                  ))}
              </View>
            ) : (
              <Text style={styles.loadingText}>Loading...</Text>
            )}
          </>
        )}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}
