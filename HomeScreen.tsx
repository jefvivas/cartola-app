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

const calculateTotalAward = (score: any) => {
  return (
    score.award.reduce((acc: any, curr: any) => acc + curr, 0) +
    score.cupAward.reduce((acc: any, curr: any) => acc + curr, 0) +
    score.halfChampionship
  );
};

export default function HomeScreen({ navigation }: any) {
  const [data, setData] = useState<any>(null);
  const [sortedData, setSortedData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [sortCriterion, setSortCriterion] = useState("totalScore");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://da65a8cz49.execute-api.sa-east-1.amazonaws.com/prod/get-teams-scores"
        );
        const processedData = response.data.scores.map((score: any) => ({
          ...score,
          totalAward: calculateTotalAward(score),
        }));

        setData({ ...response.data, scores: processedData });
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data && data.scores) {
      const sortedScores = [...data.scores].sort((a: any, b: any) => {
        return b[sortCriterion] - a[sortCriterion];
      });

      setSortedData(sortedScores);
    }
  }, [data, sortCriterion]);

  const handleSortChange = (value: string) => {
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
                {sortedData.map((score: any, index: number) => (
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
                        <Text style={{ fontSize: 12 }}>
                          {score.award.reduce(
                            (acc: number, curr: number) => acc + curr,
                            0
                          ) +
                            score.cupAward.reduce(
                              (acc: number, curr: number) => acc + curr,
                              0
                            ) +
                            score.halfChampionship}
                        </Text>
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
