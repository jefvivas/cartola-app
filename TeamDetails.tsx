import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function TeamDetailsScreen({ route }: any) {
  const { teamId } = route.params;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://l3ap22g0wi.execute-api.sa-east-1.amazonaws.com/prod/get-team-awards?team=${teamId}`
        );
        setData(response.data);
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

  const totalSum = data?.award?.reduce((acc: number, curr: number) => acc + curr, 0) || 0;

  return (
    <View style={styles.container}>
      {totalSum !== 0 ? (
        data.award.map((item: any, index: any) => {
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
        })
      ) : (
        <Text style={styles.text}>No awards</Text>
      )}
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
