import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { muokkaaTreeni } from '../../database/db';

export default function EditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [laji, setLaji] = useState(params.laji || '');
  const [paivamaara, setPaivamaara] = useState(new Date(params.paivamaara || Date.now()));
  const [naytaPicker, setNaytaPicker] = useState(false);
  const [kesto, setKesto] = useState(params.kesto || '');
  const [muistiinpanot, setMuistiinpanot] = useState(params.muistiinpanot || '');

  function formatPaivamaara(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function tallenna() {
    if (!laji || !kesto) {
      Alert.alert('Virhe', 'Täytä kaikki pakolliset kentät!');
      return;
    }
    muokkaaTreeni(
      parseInt(params.id),
      laji,
      formatPaivamaara(paivamaara),
      parseInt(kesto),
      muistiinpanot
    );
    Alert.alert('Valmis', 'Treeni päivitetty!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.label}>Laji *</Text>
      <TextInput
        style={styles.input}
        placeholder="esim. Juoksu"
        value={laji}
        onChangeText={setLaji}
      />

      <Text style={styles.label}>Päivämäärä *</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setNaytaPicker(true)}>
        <Text style={styles.dateButtonText}>📅 {formatPaivamaara(paivamaara)}</Text>
      </TouchableOpacity>

      {naytaPicker && (
        <DateTimePicker
          value={paivamaara}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setNaytaPicker(Platform.OS === 'ios');
            if (selectedDate) setPaivamaara(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Kesto (min) *</Text>
      <TextInput
        style={styles.input}
        placeholder="esim. 45"
        value={String(kesto)}
        onChangeText={setKesto}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Muistiinpanot</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Vapaaehtoinen"
        value={muistiinpanot}
        onChangeText={setMuistiinpanot}
        multiline
      />

      <TouchableOpacity style={styles.nappi} onPress={tallenna}>
        <Text style={styles.nappiTeksti}>Tallenna muutokset</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  nappi: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  nappiTeksti: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});