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
import { getTeamsInfo } from "./Axios";
import { GetTeamsScoresResponse, TeamScore, SortCriterion } from "./Interfaces";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setStorage } from "./AsyncStorage";

const windowWidth = Dimensions.get("window").width;

const calculateTotalAward = (score: TeamScore) => {
  const awardTotal = Array.isArray(score.award)
    ? score.award.reduce((acc: number, curr: number) => acc + curr, 0)
    : 0;

  const cupAwardTotal = Array.isArray(score.cupAward)
    ? score.cupAward.reduce((acc: number, curr: number) => acc + curr, 0)
    : 0;
  return awardTotal + cupAwardTotal + score.halfChampionship;
};

const calculateTotalScore = (score: TeamScore) => {
  const scoreTotal = Array.isArray(score.score)
    ? score.award.reduce((acc: number, curr: number) => acc + curr, 0)
    : 0;
  return scoreTotal;
};

type RootStackParamList = {
  Home: undefined;
  Detalhes: { teamData: TeamScore };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [teamData, setTeamData] = useState<GetTeamsScoresResponse | null>(null);
  const [sortedData, setSortedData] = useState<TeamScore[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortCriterion, setSortCriterion] =
    useState<SortCriterion>("totalScore");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamInfo = await getTeamsInfo();
        if (!teamInfo) {
          setError("Failed to fetch data");
          return;
        }
        const processedData = teamInfo.scores.map((score) => ({
          ...score,
          totalAward: calculateTotalAward(score),
          totalScore: calculateTotalScore(score),
        }));

        const processedTeamInfo = { ...teamInfo, scores: processedData };

        setTeamData(processedTeamInfo);
        await setStorage(processedTeamInfo);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (teamData && teamData.scores) {
      const sortedScores = [...teamData.scores].sort((a, b) => {
        const aValue = a[sortCriterion] as number;
        const bValue = b[sortCriterion] as number;
        return bValue - aValue;
      });

      setSortedData(sortedScores);
    }
  }, [teamData, sortCriterion]);

  const handleSortChange = (value: keyof TeamScore) => {
    setSortCriterion(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          items={[
            { label: "Pontuação Total", value: "totalScore" },
            { label: "Premiação", value: "totalAward" },
            { label: "Patrimônio", value: "netWorth" },
          ]}
          onValueChange={(itemValue) => handleSortChange(itemValue)}
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
          value={sortCriterion}
        ></RNPickerSelect>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <>
            {sortedData ? (
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
                  >
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      Premiação
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      Pontuação{" "}
                    </Text>
                    <TouchableOpacity
                      style={{ flexDirection: "row", flex: 1 }}
                      onPress={() => handleSortChange("award")}
                    ></TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      Patrimônio
                    </Text>
                    <TouchableOpacity
                      style={{ flexDirection: "row", flex: 1 }}
                      onPress={() => handleSortChange("award")}
                    ></TouchableOpacity>
                  </View>
                </View>
                {sortedData.map((score, index) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Detalhes", {
                        teamData: score,
                      })
                    }
                    key={index}
                  >
                    <View
                      key={index}
                      style={[
                        styles.scoreContainer,
                        index % 2 === 0 ? styles.evenScore : styles.oddScore,
                      ]}
                    >
                      <View style={{ flexDirection: "column", flex: 3 }}>
                        <Text style={{ fontSize: 15 }}>{score.team_name}</Text>
                        <Text style={{ fontSize: 12 }}>{score.team_owner}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{score.totalAward}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{score.totalScore}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{score.netWorth}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
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
