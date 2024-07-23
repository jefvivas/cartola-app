import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function TeamDetailsScreen({ route }: any) {
  const { teamData } = route.params;

  const leagueSum =
    teamData?.award?.reduce((acc: number, curr: number) => acc + curr, 0) || 0;
  const cupSum =
    teamData?.cupAward?.reduce((acc: number, curr: number) => acc + curr, 0) ||
    0;

  if (leagueSum === 0 && cupSum === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sem Premiação</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {teamData?.award?.map((item: any, index: any) => {
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

      {teamData?.cupAward?.map((item: any, index: any) => {
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
      {teamData?.halfChampionship !== 0 && (
        <View style={styles.box}>
          <Text style={styles.text}>
            Ganhou {teamData?.halfChampionship} reais por liderar o turno
          </Text>
        </View>
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
