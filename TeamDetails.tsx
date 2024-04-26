import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function TeamDetailsScreen({ route }: any) {
  const { teamId } = route.params;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://l3ap22g0wi.execute-api.sa-east-1.amazonaws.com/prod/get-team-awards?team=${teamId}`
        );
        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {data ? (
        data.award.map((item: any, index: any) => {
          if (item !== 0) {
            return (
              <Text>
                Ganhou {item} reais na rodada {index + 1}{" "}
              </Text>
            );
          }
        })
      ) : (
        <Text>No awards</Text>
      )}
    </View>
  );
}
