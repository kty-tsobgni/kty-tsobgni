// jqe.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';

type JQEItem = {
  id: string;
  poste: string;
  details?: string;
  dysfonctionnement: boolean;
  heure?: string;
  // d'autres champs possibles...
};

const postesOrdre = ['Tchouwong', 'Nkongsamba', 'Bafoussam', 'Bamenda', 'Djombe'];

// --- Mock initial data (tu remplaceras par ton backend plus tard) ---
const initialMock: Record<string, JQEItem[]> = {
  '2025-08-09': [
    { id: 'm1', poste: 'Tchouwong', dysfonctionnement: true, details: 'AT - panne', heure: '18:30' },
    { id: 'm2', poste: 'Nkongsamba', dysfonctionnement: false, details: 'OK', heure: '18:10' },
  ],
  '2025-08-10': [
    { id: 'm3', poste: 'Tchouwong', dysfonctionnement: false, details: 'OK', heure: '18:00' },
    { id: 'm4', poste: 'Nkongsamba', dysfonctionnement: true, details: 'AT - Thermo', heure: '19:00' },
    { id: 'm5', poste: 'Bafoussam', dysfonctionnement: false, details: 'OK', heure: '18:45' },
    { id: 'm6', poste: 'Bamenda', dysfonctionnement: true, details: 'Coupure', heure: '20:00' },
    // Djombe absent ce jour
  ],
};

// --- Helpers date ---
function isoDate(d: Date) {
  return d.toISOString().split('T')[0];
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  return new Date(d.setDate(diff));
}

function endOfWeek(date: Date) {
  const s = startOfWeek(date);
  return new Date(s.getFullYear(), s.getMonth(), s.getDate() + 6);
}

function startOfMonth(date: Date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(date: Date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date: Date) {
  return new Date(date.getFullYear(), 11, 31);
}

// --- Composant principal ---
export default function JQE() {
  const [data, setData] = useState<Record<string, JQEItem[]>>(initialMock);
  const [selectedDate, setSelectedDate] = useState<string>(isoDate(new Date()));
  const [filterMode, setFilterMode] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [modalVisible, setModalVisible] = useState(false);

  // marque les dates qui ont JQE pour le calendrier
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    Object.keys(data).forEach((d) => {
      marks[d] = { marked: true, dotColor: 'red' };
    });
    // highlighted selection
    marks[selectedDate] = { ...(marks[selectedDate] || {}), selected: true, selectedColor: '#0b74de' };
    // si semaine => mettre en évidence la plage
    if (filterMode === 'week') {
      const d = new Date(selectedDate);
      const s = startOfWeek(d);
      for (let i = 0; i < 7; i++) {
        const cur = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i);
        const key = isoDate(cur);
        marks[key] = { ...(marks[key] || {}), selected: true, selectedColor: '#cfe9ff' };
      }
      marks[selectedDate] = { ...(marks[selectedDate] || {}), selected: true, selectedColor: '#0b74de' };
    }
    return marks;
  }, [data, selectedDate, filterMode]);

  // Récupère les JQE selon le filtre et la date sélectionnée
  const jqeDisplayed = useMemo(() => {
    const sel = new Date(selectedDate);
    let rangeStart = sel;
    let rangeEnd = sel;

    if (filterMode === 'week') {
      rangeStart = startOfWeek(sel);
      rangeEnd = endOfWeek(sel);
    } else if (filterMode === 'month') {
      rangeStart = startOfMonth(sel);
      rangeEnd = endOfMonth(sel);
    } else if (filterMode === 'year') {
      rangeStart = startOfYear(sel);
      rangeEnd = endOfYear(sel);
    }

    // gather all JQEs in range, grouped by date
    const collected: { date: string; items: JQEItem[] }[] = [];
    const cur = new Date(rangeStart);
    while (cur <= rangeEnd) {
      const key = isoDate(cur);
      const items = data[key] || [];
      // we want them sorted by postesOrdre and keep placeholders for missing if desired
      const sorted = postesOrdre
        .map((p) => items.find((it) => it.poste === p))
        .map((found, idx) => (found ? found : { id: `missing-${key}-${idx}`, poste: postesOrdre[idx], dysfonctionnement: false, details: 'Aucun JQE', heure: '' }));
      collected.push({ date: key, items: sorted });
      cur.setDate(cur.getDate() + 1);
    }
    return collected;
  }, [data, selectedDate, filterMode]);

  // --- Fonction d'ajout mock (simule un chef qui envoie un JQE) ---
  function addMockJQE(dateStr: string, poste: string, dysfonctionnement = false, details = 'Nouvel JQE', heure = '18:00') {
    setData((prev) => {
      const arr = prev[dateStr] ? [...prev[dateStr]] : [];
      const newItem: JQEItem = {
        id: `${dateStr}-${poste}-${Date.now()}`,
        poste,
        dysfonctionnement,
        details,
        heure,
      };
      arr.push(newItem);
      return { ...prev, [dateStr]: arr };
    });
    Alert.alert('JQE ajouté', `JQE ajouté pour ${poste} le ${dateStr}`);
  }

  // --- Exporter les JQE du jour sélectionné (xlsx) ---
  async function exportJQEsForDate(dateStr: string) {
    // on exporte uniquement les JQE existants pour cette date (si aucun => on exporte la table vide avec postes)
    const items = data[dateStr] || [];
    // construire tableau pour Excel : on veut une ligne par poste
    const tableRows = postesOrdre.map((poste) => {
      const found = items.find((it) => it.poste === poste);
      return {
        Date: dateStr,
        Poste: poste,
        Dysfonctionnement: found ? (found.dysfonctionnement ? 'Oui' : 'Non') : 'Non',
        Details: found ? found.details || '' : '',
        Heure: found ? found.heure || '' : '',
      };
    });

    try {
      // Convert to worksheet
      const ws = XLSX.utils.json_to_sheet(tableRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'JQE');

      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const filename = `JQE_${dateStr}.xlsx`;
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 });

      Alert.alert('Exporté', `Fichier enregistré : ${fileUri}`);
      // sur Android tu pourrais vouloir partager ce fichier avec Share API ou l'ouvrir avec un viewer
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Impossible d’exporter le fichier.');
    }
  }

  return (
    <SafeAreaView
      style={styles.safe}
    >
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.hamburger} onPress={() => setModalVisible(true)}>
          {/* Simple 3-bar icon */}
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>JQE - Journal Quotidien</Text>
        <View style={{ width: 40 }} /> {/* placeholder pour centrer le titre */}
      </View>

      {/* Filtre modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtres</Text>
            <TouchableOpacity
              style={[styles.filterBtn, filterMode === 'day' && styles.filterBtnActive]}
              onPress={() => {
                setFilterMode('day');
                setModalVisible(false);
              }}>
              <Text style={styles.filterText}>Jour</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterBtn, filterMode === 'week' && styles.filterBtnActive]}
              onPress={() => {
                setFilterMode('week');
                setModalVisible(false);
              }}>
              <Text style={styles.filterText}>Semaine</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterBtn, filterMode === 'month' && styles.filterBtnActive]}
              onPress={() => {
                setFilterMode('month');
                setModalVisible(false);
              }}>
              <Text style={styles.filterText}>Mois</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterBtn, filterMode === 'year' && styles.filterBtnActive]}
              onPress={() => {
                setFilterMode('year');
                setModalVisible(false);
              }}>
              <Text style={styles.filterText}>Année</Text>
            </TouchableOpacity>

            <View style={{ height: 10 }} />
            <TouchableOpacity
              style={[styles.filterBtn, { backgroundColor: '#ddd' }]}
              onPress={() => {
                // ajouter un mock JQE pour tester l'insertion
                addMockJQE(selectedDate, postesOrdre[Math.floor(Math.random() * postesOrdre.length)], Math.random() > 0.5, 'Test ajout via UI', '19:00');
                setModalVisible(false);
              }}>
              <Text style={styles.filterText}>Ajouter un JQE mock (test)</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Calendar */}
      <Calendar
        onDayPress={(day: DateData) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={markedDates}
        style={styles.calendar}
      />

      {/* Bouton Exporter pour la date sélectionnée */}
      <View style={styles.exportRow}>
        <Text style={styles.selectedDateText}>{filterMode === 'day' ? `JQE du ${selectedDate}` : `Période (${filterMode}) autour de ${selectedDate}`}</Text>
        <TouchableOpacity
          style={styles.exportBtn}
          onPress={() => {
            // Export pour le mode day : exporte la date sélectionnée
            // pour d'autres modes tu pourrais exporter toute la période (à développer)
            if (filterMode === 'day') {
              exportJQEsForDate(selectedDate);
            } else {
              // Si tu veux exporter la période entière, on peut concaténer les dates
              Alert.alert('Export', 'L’export actuel exporte uniquement la date sélectionnée. Pour exporter la période, on l’implémente si tu veux.');
            }
          }}>
          <Text style={styles.exportBtnText}>Exporter (.xlsx)</Text>
        </TouchableOpacity>
      </View>

      {/* Listes JQE (par date selon le filter) */}
      <FlatList
        data={jqeDisplayed}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.dayBlock}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>{item.date}</Text>
              <Text style={styles.daySubtitle}>{item.items.filter((it) => it && it.details && it.details !== 'Aucun JQE').length} JQE présents</Text>
            </View>
            {/* Liste des postes (toujours dans l'ordre) */}
            {item.items.map((it) => (
              <View key={it.id} style={[styles.jqeRow, it.details === 'Aucun JQE' ? styles.jqeEmpty : undefined, it.dysfonctionnement ? styles.jqeAlert : undefined]}>
                <Text style={styles.poste}>{it.poste}</Text>
                <View style={styles.rightCol}>
                  <Text style={styles.details}>{it.details}</Text>
                  {it.heure ? <Text style={styles.heure}>{it.heure}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        )}
      />
    </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safe :{
    flex: 1
  },
  container: { flex: 1, backgroundColor: '#f6fbff' },
  header: {
    height: 56,
    backgroundColor: '#0b74de',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  hamburger: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  bar: {
    height: 3,
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 2,
    width: 22,
  },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  calendar: { marginVertical: 8, borderRadius: 8, marginHorizontal: 8, elevation: 2, paddingBottom: 6 },
  exportRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginTop: 8 },
  exportBtn: { backgroundColor: '#0b74de', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  exportBtnText: { color: '#fff', fontWeight: '600' },
  selectedDateText: { fontWeight: '600' },
  dayBlock: { marginHorizontal: 12, marginTop: 12, backgroundColor: '#fff', borderRadius: 8, padding: 10, elevation: 1 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dayTitle: { fontWeight: '700' },
  daySubtitle: { color: '#666' },
  jqeRow: { flexDirection: 'row', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  jqeEmpty: { backgroundColor: '#fafafa' },
  jqeAlert: { backgroundColor: '#fff0f0' },
  poste: { width: 120, fontWeight: '700' },
  rightCol: { flex: 1, alignItems: 'flex-end' },
  details: { color: '#333' },
  heure: { color: '#666', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  modalTitle: { fontWeight: '700', fontSize: 16, marginBottom: 10 },
  filterBtn: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#f2f2f2', marginBottom: 8 },
  filterBtnActive: { backgroundColor: '#dbefff' },
  filterText: { fontWeight: '600' },
});
