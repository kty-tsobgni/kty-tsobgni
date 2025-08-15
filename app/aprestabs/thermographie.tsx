// app/tabs/thermographique.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';

type Equipment = {
  name: string;
  PH0: string;
  PH4: string;
  PH8: string;
  observation: string;
};

const equipmentList = [
  "Descente câble ligne - Entrée parafoudre",
  "Circuit bouchon",
  "Sortie parafoudre - Sélectionneur ligne",
  "Mâchoire sélectionneur ligne",
  "Sortie sélectionneur - Combiné de mesure",
  "Entrée combiné de mesure",
  "Sortie combiné de mesure",
  "Entrée disjoncteur combiné de mesure",
  "Sortie disjoncteur",
  "Entrée sectionneur barre",
  "Mâchoire sectionneur barre",
  "Sortie sectionneur barre au jeu de barre",
  "Jeu de barre 90 KV - Entrée transformateur côté primaire",
  "Sortie secondaire 30 KV au départ AT",
  "Émergence",
  "Borne neutre 90 KV",
  "Entrée neutre 90 KV secondaire",
  "Mâchoire sectionneur neutre",
  "Sortie neutre 90 KV secondaire"
];

export default function Thermographique() {
  const [data, setData] = useState<Equipment[]>(
    equipmentList.map(name => ({
      name,
      PH0: "",
      PH4: "",
      PH8: "",
      observation: ""
    }))
  );

  const updateValue = (index: number, field: keyof Equipment, value: string) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relevé Thermographique</Text>
      
      {data.map((item, index) => (
        <View key={index} style={styles.equipmentBox}>
          <Text style={styles.equipmentName}>{index + 1}. {item.name}</Text>
          
          <View style={styles.inputRow}>
            <TextInput
              placeholder="PH0"
              style={styles.input}
              keyboardType="numeric"
              value={item.PH0}
              onChangeText={(val) => updateValue(index, 'PH0', val)}
            />
            <TextInput
              placeholder="PH4"
              style={styles.input}
              keyboardType="numeric"
              value={item.PH4}
              onChangeText={(val) => updateValue(index, 'PH4', val)}
            />
            <TextInput
              placeholder="PH8"
              style={styles.input}
              keyboardType="numeric"
              value={item.PH8}
              onChangeText={(val) => updateValue(index, 'PH8', val)}
            />
          </View>

          <TextInput
            placeholder="Observation"
            style={styles.observationInput}
            value={item.observation}
            onChangeText={(val) => updateValue(index, 'observation', val)}
            multiline
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginTop: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  equipmentBox: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2
  },
  equipmentName: {
    fontWeight: "bold",
    marginBottom: 8
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginHorizontal: 3,
    textAlign: "center"
  },
  observationInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    minHeight: 40
  }
});
