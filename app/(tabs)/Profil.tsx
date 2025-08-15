// app/tabs/Profil.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profil() {
  const [photo, setPhoto] = useState<string | null>(null);

  const user = {
    nom: "Jean Dupont",
    email: "jean.dupont@example.com",
    telephone: "+237 6 99 99 99 99",
    role: "Technicien"
  };

  // Charger la photo sauvegardée au démarrage
  useEffect(() => {
    (async () => {
      const savedPhoto = await AsyncStorage.getItem("photoProfil");
      if (savedPhoto) {
        setPhoto(savedPhoto);
      }
    })();
  }, []);

  // Choisir et sauvegarder la photo
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission refusée", "Vous devez autoriser l'accès à la galerie.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (!result.canceled) {
      const newPhoto = result.assets[0].uri;
      setPhoto(newPhoto);
      await AsyncStorage.setItem("photoProfil", newPhoto); // Sauvegarde persistante
    }
  };

  // Déconnexion
  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Oui", onPress: () => console.log("Utilisateur déconnecté") }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: photo || "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />
        <Text style={styles.changePhoto}>Changer la photo</Text>
      </TouchableOpacity>

      <Text style={styles.name}>{user.nom}</Text>
      <Text style={styles.role}>{user.role}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>📧 Email</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>📞 Téléphone</Text>
        <Text style={styles.value}>{user.telephone}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20, backgroundColor: "#f9f9f9" },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 8, borderWidth: 2, borderColor: "#ccc" },
  changePhoto: { color: "#007bff", textAlign: "center", marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold" },
  role: { fontSize: 16, color: "#555", marginBottom: 20 },
  infoBox: { width: "100%", backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  label: { fontSize: 14, color: "#777" },
  value: { fontSize: 16, fontWeight: "500", marginTop: 5 },
  logoutButton: { marginTop: 30, backgroundColor: "red", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});
