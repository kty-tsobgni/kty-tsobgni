// app/tabs/Accueil.tsx
import React, { useRef, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";

const { width, height } = Dimensions.get("window");

const images = [
  require('../../assets/images/sona1.jpg'), // mets tes images ici
  require('../../assets/images/sona2.jpg'),
  require('../../assets/images/sona3.jpg'),
  require('../../assets/images/sona3.jpg'),
  require('../../assets/images/sona3.jpg'),
];

export default function Accueil() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-défilement
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  return (
    <View style={styles.container}>
      {/* Message de bienvenue */}
      <Text style={styles.welcomeText}>Bienvenue cher agent 👋</Text>

      {/* Cadre du carrousel */}
      <View style={styles.carouselFrame}>
        <FlatList
          data={images}
          ref={flatListRef}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <Image source={item} style={styles.carouselImage} />
          )}
        />

        {/* Indicateurs */}
        <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { opacity: index === currentIndex ? 1 : 0.3 },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bouton commencer */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/Transition/Options')}
      >
        <Text style={styles.buttonText}>Commencer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 100, // Descend le contenu
    
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#00AEEF",
    marginBottom: 50, // espace avant le carrousel
  },
  carouselFrame: {
    width: width * 0.9,
    height: height * 0.45,
    backgroundColor: "#F5F9FF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // pour que les images restent dans le cadre
    marginBottom: 70,
  },
  carouselImage: {
    width: width * 0.9,
    height: height * 0.45,
    resizeMode: "cover",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
  },
  indicator: {
    width: 9,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00AEEF",
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: "#00AEEF",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 40,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop: 20, // descend le bouton
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});
