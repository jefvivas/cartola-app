import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetTeamsScoresResponse } from "../Interfaces";

export const setStorage = async (teamInfo: GetTeamsScoresResponse) => {
  await AsyncStorage.setItem("teamInfo", JSON.stringify(teamInfo));
};

export const getStorage = async (): Promise<GetTeamsScoresResponse> => {
  const teamInfo = await AsyncStorage.getItem("teamInfo");
  if (!teamInfo) throw new Error("Team info not found");
  return JSON.parse(teamInfo);
};
