// app/tabs/parametres.tsx
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';

export default function Parametres() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => setLanguage(language === 'fr' ? 'en' : 'fr');
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      {/* Thème */}
      <View style={styles.option}>
        <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>
          Thème : {isDarkMode ? 'Sombre' : 'Clair'}
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      {/* Langue */}
      <View style={styles.option}>
        <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>
          Langue : {language === 'fr' ? 'Français' : 'English'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={toggleLanguage}>
          <Text style={styles.buttonText}>Changer</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      <View style={styles.option}>
        <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>
          Notifications : {notificationsEnabled ? 'Activées' : 'Désactivées'}
        </Text>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#e6e6e6',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
