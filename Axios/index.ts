import axios from "axios";
import { GetTeamsScoresResponse } from "../Interfaces";

const getTeamsInfo = async (): Promise<GetTeamsScoresResponse | undefined> => {
  try {
    const { data } = await axios.get<GetTeamsScoresResponse>(
      "https://da65a8cz49.execute-api.sa-east-1.amazonaws.com/prod/get-teams-scores"
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { getTeamsInfo };
