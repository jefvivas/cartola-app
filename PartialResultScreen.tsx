import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { getTeamsInfo } from "./Axios";
import {
  GetTeamsScoresResponse,
  PartialSortedData,
  TeamScore,
} from "./Interfaces";
import { StackNavigationProp } from "@react-navigation/stack";

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

type RootStackParamList = {
  Home: undefined;
  PartialResult: undefined;
  TeamDetails: { teamData: TeamScore };
};

type PartialResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PartialResult"
>;

interface Props {
  navigation: PartialResultScreenNavigationProp;
}

export default function PartialResultScreen({ navigation }: Props) {
  const [teamData, setTeamData] = useState<GetTeamsScoresResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const [sortedData, setSortedData] = useState<PartialSortedData[] | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamInfo = await getTeamsInfo();

        if (!teamInfo) {
          setError("Failed to fetch data");
          return;
        }

        setTeamData(teamInfo);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (teamData && teamData.scores && round >= 0) {
      const sortedUsefulData: PartialSortedData[] = teamData.scores.map(
        (score) => ({
          teamOwner: score.team_owner,
          teamName: score.team_name,
          score: score.score[round],
        })
      );

      const sortedScores = sortedUsefulData.sort((a, b) => b.score - a.score);

      setSortedData(sortedScores);
    }
  }, [teamData, round]);

  const handleRoundChange = (round: number) => {
    setRound(round);
  };

  if (!teamData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const scoreItems = teamData.scores[0].score.map((_, index: number) => ({
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
            {teamData && teamData.scores ? (
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
                  sortedData.map((score, index: number) => (
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
