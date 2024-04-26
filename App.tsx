import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
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
});

export default function App() {
  const [data, setData] = useState<any>(null);
  const [sortedData, setSortedData] = useState<any>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://l3ap22g0wi.execute-api.sa-east-1.amazonaws.com/prod/get-teams-scores"
        );
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data && data.scores) {
      const sortedScores = data.scores
        .slice()
        .sort((a: any, b: any) => b.award - a.award);
      setSortedData(sortedScores);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <>
            {sortedData ? (
              <View>
                <View style={styles.header}>
                  <View style={{ flexDirection: "row", flex: 3 }}>
                    <Text style={{ fontSize: 18 }}>Time</Text>
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
                  </View>
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      Patrimônio
                    </Text>
                  </View>
                </View>
                {sortedData.map((score: any, index: number) => (
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
                      <Text style={{ fontSize: 12 }}>{score.award}</Text>
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
