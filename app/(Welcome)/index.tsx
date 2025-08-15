import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const index = () => {
    const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/LoginScreen');
    }, 2000); // 3 secondes

    return () => clearTimeout(timer);
  }, );

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7586E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default index;
