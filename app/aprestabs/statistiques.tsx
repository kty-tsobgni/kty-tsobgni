import React, { useEffect, useState } from "react";
import { View, Dimensions, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";

export default function Statistique() {
  const [labels, setLabels] = useState<string[]>([]);
  const [newData, setNewData] = useState<number[]>([]);
  const [oldData, setOldData] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const saved = await AsyncStorage.getItem("thermographieData");
      if (saved) {
        const parsed = JSON.parse(saved);

        // On prend juste PH0 pour l'exemple
        setLabels(parsed.map((item: any) => item.name.split(" ")[0])); 
        setNewData(parsed.map((item: any) => Number(item.PH0)));

        // Simulation ancienne donnée
        setOldData(parsed.map(() => Math.floor(Math.random() * 50) + 10));
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView horizontal>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            { data: oldData, color: () => "rgba(255,0,0,1)", strokeWidth: 2 },
            { data: newData, color: () => "rgba(0,255,0,1)", strokeWidth: 2 }
          ],
          legend: ["Ancienne mesure", "Nouvelle mesure"]
        }}
        width={Math.max(labels.length * 80, Dimensions.get("window").width)}
        height={300}
        chartConfig={{
          backgroundGradientFrom: "#1E2923",
          backgroundGradientTo: "#08130D",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => "#fff",
          decimalPlaces: 1
        }}
        bezier
      />
    </ScrollView>
  );
}
