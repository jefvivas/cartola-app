import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetTeamsScoresResponse } from "../Interfaces";

export const setStorage = async (teamInfo: GetTeamsScoresResponse) => {
  await AsyncStorage.setItem("teamInfo", JSON.stringify(teamInfo));
};

export const getStorage = async (): Promise<GetTeamsScoresResponse | void> => {
  const teamInfo = await AsyncStorage.getItem("teamInfo");
  if (!teamInfo) return;

  return JSON.parse(teamInfo);
};
