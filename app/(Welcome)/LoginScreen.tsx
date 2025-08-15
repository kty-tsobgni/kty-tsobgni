import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
    const router = useRouter();
  const handleLogin = () => {
    // Simule une vérification
    router.push('/(tabs)/Acceuil'); // Navigue vers l’accueil
  };

  return (
    <ImageBackground
      source={require('@/assets/images/pylone.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />

        <View style={styles.formContainer}>
          <Text style={styles.label}>Adresse email</Text>
          <TextInput
            placeholder="Entrez votre email"
            placeholderTextColor="#ccc"
            style={styles.input}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            placeholder="Entrez votre mot de passe"
            placeholderTextColor="#ccc"
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(117, 134, 229, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: 1,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 14,
    color: '#000',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1e40af',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LoginScreen;