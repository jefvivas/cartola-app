import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function TeamDetailsScreen({ route }: any) {
  const { teamId } = route.params;
  const [leagueData, setLeagueData] = useState<any>(null);
  const [cupData, setCupData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leagueResponse = await axios.get(
          `https://da65a8cz49.execute-api.sa-east-1.amazonaws.com/prod/get-team-awards?team=${teamId}`
        );
        const cupResponse = await axios.get(
          `https://da65a8cz49.execute-api.sa-east-1.amazonaws.com/prod/get-team-cup-awards?team=${teamId}`
        );
        setLeagueData(leagueResponse.data);
        setCupData(cupResponse.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Error: {error}</Text>
      </View>
    );
  }
  const leagueSum =
    leagueData?.award?.reduce((acc: number, curr: number) => acc + curr, 0) ||
    0;
  const cupSum =
    cupData?.award?.reduce((acc: number, curr: number) => acc + curr, 0) || 0;

  if (leagueSum === 0 && cupSum === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sem Premiação</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {leagueData.award.map((item: any, index: any) => {
        if (item !== 0) {
          return (
            <View key={index} style={styles.box}>
              <Text style={styles.text}>
                Ganhou {item} reais na rodada {index + 1}
              </Text>
            </View>
          );
        }
        return null;
      })}

      {cupData.map((item: any, index: any) => {
        if (item !== 0) {
          return (
            <View key={index} style={styles.box}>
              <Text style={styles.text}>
                Ganhou {item} reais na liga mata-mata {index + 1}
              </Text>
            </View>
          );
        }
        return null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
