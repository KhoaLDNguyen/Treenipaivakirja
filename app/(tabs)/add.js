import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { lisaaLiike, lisaaTreeni } from '../../database/db';

const LAJIT = [
  'Juoksu', 'Pyöräily', 'Uinti', 'Kuntosali',
  'Jalkapallo', 'Koripallo', 'Jooga', 'Hiihto',
  'Tennis', 'Sulkapallo', 'Salibandy', 'Muu'
];

const VALMIIT_LIIKKEET = [
  'Kyykky', 'Maastaveto', 'Askelkyykky', 'Leg press', 'Pohjeennosto',
  'Penkkipunnerrus', 'Leuanveto', 'Soutu', 'Olkapääpunnerrus', 'Dippi',
  'Lankku', 'Sit-up', 'Pyörä', 'Leg raise',
  'Hyperextensio', 'Lat pulldown', 'Kaapelisoutu',
  'Muu / Oma liike',
];

export default function AddScreen() {
  const { laji: lajiParam, muistiinpanot: muistiinpanotParam } = useLocalSearchParams();
  const [laji, setLaji] = useState(lajiParam || LAJIT[0]);
  const [muistiinpanot, setMuistiinpanot] = useState(muistiinpanotParam || '');
  const [naytaLajiModal, setNaytaLajiModal] = useState(false);
  const [paivamaara, setPaivamaara] = useState(new Date());
  const [naytaPicker, setNaytaPicker] = useState(false);
  const [kesto, setKesto] = useState('');
  const [liikkeet, setLiikkeet] = useState([]);
  const [naytaLiikeModal, setNaytaLiikeModal] = useState(false);
  const [uusiLiikeNimi, setUusiLiikeNimi] = useState('');
  const [uusiLiikeSarjat, setUusiLiikeSarjat] = useState('');
  const [uusiLiikeToistot, setUusiLiikeToistot] = useState('');
  const [uusiLiikePaino, setUusiLiikePaino] = useState('');

  useEffect(() => {
    if (lajiParam) setLaji(lajiParam);
    if (muistiinpanotParam) {
      setLiikkeet([{ nimi: muistiinpanotParam, sarjat: '', toistot: '', paino: '' }]);
      setMuistiinpanot('');
    }
  }, [lajiParam, muistiinpanotParam]);

  function formatPaivamaara(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function lisaaLiikeListaan() {
    if (!uusiLiikeNimi) {
      Alert.alert('Virhe', 'Anna liikkeen nimi!');
      return;
    }
    setLiikkeet([...liikkeet, {
      nimi: uusiLiikeNimi,
      sarjat: uusiLiikeSarjat,
      toistot: uusiLiikeToistot,
      paino: uusiLiikePaino,
    }]);
    setUusiLiikeNimi('');
    setUusiLiikeSarjat('');
    setUusiLiikeToistot('');
    setUusiLiikePaino('');
    setNaytaLiikeModal(false);
  }

  function poistaLiikeListasta(index) {
    setLiikkeet(liikkeet.filter((_, i) => i !== index));
  }

  function tallenna() {
    if (!kesto) {
      Alert.alert('Virhe', 'Täytä kesto!');
      return;
    }
    const tulos = lisaaTreeni(laji, formatPaivamaara(paivamaara), parseInt(kesto), muistiinpanot);
    const treeniId = tulos.lastInsertRowId;
    liikkeet.forEach(l => {
      lisaaLiike(
        treeniId,
        l.nimi,
        l.sarjat ? parseInt(l.sarjat) : null,
        l.toistot ? parseInt(l.toistot) : null,
        l.paino ? parseFloat(l.paino) : null
      );
    });
    Alert.alert('Valmis', 'Treeni tallennettu!');
    setLaji(LAJIT[0]);
    setPaivamaara(new Date());
    setKesto('');
    setMuistiinpanot('');
    setLiikkeet([]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Laji */}
      <Text style={styles.label}>Laji *</Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setNaytaLajiModal(true)}>
        <Text style={styles.dropdownButtonText}>{laji}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {/* Laji Modal */}
      <Modal visible={naytaLajiModal} transparent animationType="slide" onRequestClose={() => setNaytaLajiModal(false)}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setNaytaLajiModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Valitse laji</Text>
            <FlatList
              data={LAJIT}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, laji === item && styles.modalItemSelected]}
                  onPress={() => { setLaji(item); setNaytaLajiModal(false); }}
                >
                  <Text style={[styles.modalItemText, laji === item && styles.modalItemTextSelected]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Päivämäärä */}
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

      {/* Kesto */}
      <Text style={styles.label}>Kesto (min) *</Text>
      <TextInput
        style={styles.input}
        placeholder="esim. 45"
        placeholderTextColor="#888"
        value={kesto}
        onChangeText={setKesto}
        keyboardType="numeric"
      />

      {/* Liikkeet */}
      <Text style={styles.label}>Liikkeet</Text>
      {liikkeet.length === 0 && (
        <Text style={styles.tyhjaText}>Ei liikkeitä lisätty</Text>
      )}
      {liikkeet.map((l, index) => (
        <View key={index} style={styles.liikeKortti}>
          <View style={styles.liikeKorttiYlarivi}>
            <Text style={styles.liikeNimi}>{l.nimi}</Text>
            <TouchableOpacity onPress={() => poistaLiikeListasta(index)}>
              <Text style={styles.poistanappi}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.liikeTiedot}>
            {[
              l.sarjat && `${l.sarjat} sarjaa`,
              l.toistot && `${l.toistot} toistoa`,
              l.paino && `${l.paino} kg`,
            ].filter(Boolean).join('  ·  ') || 'Ei tarkempia tietoja'}
          </Text>
        </View>
      ))}
      <TouchableOpacity style={styles.lisaaLiikeNappi} onPress={() => setNaytaLiikeModal(true)}>
        <Text style={styles.lisaaLiikeNappiTeksti}>+ Lisää liike</Text>
      </TouchableOpacity>

      {/* Liike Modal */}
      <Modal visible={naytaLiikeModal} transparent animationType="slide" onRequestClose={() => setNaytaLiikeModal(false)}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setNaytaLiikeModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lisää liike</Text>

            <Text style={styles.liikeLabel}>Valitse liike</Text>
            <FlatList
              data={VALMIIT_LIIKKEET}
              keyExtractor={(item) => item}
              style={{ maxHeight: 200, marginBottom: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, uusiLiikeNimi === item && styles.modalItemSelected]}
                  onPress={() => setUusiLiikeNimi(item === 'Muu / Oma liike' ? '' : item)}
                >
                  <Text style={[styles.modalItemText, uusiLiikeNimi === item && styles.modalItemTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.liikeLabel}>Tai kirjoita oma nimi</Text>
            <TextInput
              style={styles.liikeInput}
              placeholder="esim. Penkkipunnerrus"
              placeholderTextColor="#888"
              value={uusiLiikeNimi}
              onChangeText={setUusiLiikeNimi}
            />

            <View style={styles.liikeRivi}>
              <View style={styles.liikeKenttaPuolikas}>
                <Text style={styles.liikeLabel}>Sarjat</Text>
                <TextInput
                  style={styles.liikeInput}
                  placeholder="esim. 3"
                  placeholderTextColor="#888"
                  value={uusiLiikeSarjat}
                  onChangeText={setUusiLiikeSarjat}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.liikeKenttaPuolikas}>
                <Text style={styles.liikeLabel}>Toistot</Text>
                <TextInput
                  style={styles.liikeInput}
                  placeholder="esim. 10"
                  placeholderTextColor="#888"
                  value={uusiLiikeToistot}
                  onChangeText={setUusiLiikeToistot}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.liikeLabel}>Paino (kg)</Text>
            <TextInput
              style={styles.liikeInput}
              placeholder="esim. 60"
              placeholderTextColor="#888"
              value={uusiLiikePaino}
              onChangeText={setUusiLiikePaino}
              keyboardType="decimal-pad"
            />

            <TouchableOpacity style={styles.nappi} onPress={lisaaLiikeListaan}>
              <Text style={styles.nappiTeksti}>Lisää</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Muistiinpanot */}
      <Text style={styles.label}>Muistiinpanot</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Vapaaehtoinen"
        placeholderTextColor="#888"
        value={muistiinpanot}
        onChangeText={setMuistiinpanot}
        multiline
      />

      <TouchableOpacity style={styles.nappi} onPress={tallenna}>
        <Text style={styles.nappiTeksti}>Tallenna treeni</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, marginTop: 15 },
  dropdownButton: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12,
    backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  dropdownButtonText: { fontSize: 16, color: '#333' },
  dropdownArrow: { fontSize: 12, color: '#888' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: 20, maxHeight: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemSelected: { backgroundColor: '#E8F0FE' },
  modalItemText: { fontSize: 16, color: '#333' },
  modalItemTextSelected: { color: '#007AFF', fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, fontSize: 16, backgroundColor: '#fff',
  },
  multiline: { height: 100, textAlignVertical: 'top' },
  dateButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  dateButtonText: { fontSize: 16, color: '#333' },
  tyhjaText: { color: '#aaa', fontStyle: 'italic', marginBottom: 8 },
  liikeKortti: {
    backgroundColor: '#f0f4ff', borderRadius: 8, padding: 12,
    marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#007AFF',
  },
  liikeKorttiYlarivi: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liikeNimi: { fontSize: 15, fontWeight: 'bold', color: '#1E1E2E' },
  poistanappi: { fontSize: 16, color: '#FF3B30', paddingHorizontal: 6 },
  liikeTiedot: { fontSize: 13, color: '#555', marginTop: 4 },
  lisaaLiikeNappi: {
    borderWidth: 2, borderColor: '#007AFF', borderStyle: 'dashed',
    borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 8,
  },
  lisaaLiikeNappiTeksti: { color: '#007AFF', fontWeight: 'bold', fontSize: 15 },
  liikeRivi: { flexDirection: 'row', gap: 10 },
  liikeKenttaPuolikas: { flex: 1 },
  liikeLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4, marginTop: 10, color: '#333' },
  liikeInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, fontSize: 15, backgroundColor: '#f9f9f9',
  },
  nappi: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  nappiTeksti: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});