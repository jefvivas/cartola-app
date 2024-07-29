import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { TeamScore } from "./Interfaces";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  Home: undefined;
  Detalhes: { teamData: TeamScore };
};

type TeamDetailsRouteProp = RouteProp<RootStackParamList, "Detalhes">;

export default function TeamDetailsScreen({
  route,
}: {
  route: TeamDetailsRouteProp;
}) {
  const { teamData } = route.params;

  const leagueSum =
    teamData?.award?.reduce((acc: number, curr: number) => acc + curr, 0) || 0;
  const cupSum =
    teamData?.cupAward?.reduce((acc: number, curr: number) => acc + curr, 0) ||
    0;

  if (
    leagueSum === 0 &&
    cupSum === 0 &&
    teamData?.halfChampionship === 0 &&
    teamData?.secondHalfChampionship === 0 &&
    teamData?.richerTeam === 0 &&
    teamData?.champion === 0
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sem Premiação</Text>
      </View>
    );
  }

  return (
    <View style={styles.flexContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {teamData?.award?.map((item, index) => {
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

        {teamData?.cupAward?.map((item, index) => {
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
              Ganhou {teamData?.halfChampionship} reais por liderar o primeiro
              turno
            </Text>
          </View>
        )}

        {teamData?.secondHalfChampionship !== 0 && (
          <View style={styles.box}>
            <Text style={styles.text}>
              Ganhou {teamData?.secondHalfChampionship} reais por liderar o
              segundo turno
            </Text>
          </View>
        )}

        {teamData?.richerTeam !== 0 && (
          <View style={styles.box}>
            <Text style={styles.text}>
              Ganhou {teamData?.richerTeam} reais por ter o maior patrimônio
            </Text>
          </View>
        )}

        {teamData?.champion !== 0 && (
          <View style={styles.box}>
            <Text style={styles.text}>
              Ganhou {teamData?.champion} reais por vencer o campeonato
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: Dimensions.get("window").width - 30,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
