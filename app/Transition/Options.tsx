import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const data = [
  { id: '1', title: 'JQE', image: require('../../assets/images/JQE.png'), route: 'aprestabs/jqe' },
  { id: '2', title: 'Membres', image: require('../../assets/images/membres.png'), route: 'aprestabs/membres' },
  { id: '3', title: 'Thermographie', image: require('../../assets/images/thermo.png'), route: 'aprestabs/thermographie' },
  { id: '4', title: 'Statistiques', image: require('../../assets/images/Stat.png'), route: 'aprestabs/statistiques' },
  { id: '5', title: 'Problèmes', image: require('../../assets/images/pb.png'), route: 'aprestabs/problemes' },
  { id: '6', title: 'Paramètres', image: require('../../assets/images/para.png'), route: 'aprestabs/parametres' },
  { id: '7', title: 'Postes', image: require('../../assets/images/pylone.jpg'), route: 'aprestabs/postes' },
  { id: '8', title: 'AT', image: require('../../assets/images/JQE.png'), route: 'aprestabs/AT' },
];

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 30;

export default function HomeScreen() {
  const router = useRouter();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(item.route)}>
      <Image source={item.image} style={styles.icon} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: 15}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingTop: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    width: itemSize,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 90,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});
