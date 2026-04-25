import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { haeLiikkeet, haeTreenit } from '../../database/db';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [treenit, setTreeenit] = useState([]);
  const [suosittuLiike, setSuosittuLiike] = useState(null);

  const lataaTreenit = useCallback(() => {
    const data = haeTreenit();
    setTreeenit(data);

    // Laske suosituin liike kaikista treeneistä
    const liikeLaskuri = {};
    data.forEach(t => {
      const liikkeet = haeLiikkeet(t.id);
      liikkeet.forEach(l => {
        liikeLaskuri[l.nimi] = (liikeLaskuri[l.nimi] || 0) + 1;
      });
    });
    const suosituin = Object.entries(liikeLaskuri).sort((a, b) => b[1] - a[1])[0];
    setSuosittuLiike(suosituin ? { nimi: suosituin[0], maara: suosituin[1] } : null);
  }, []);

  useFocusEffect(lataaTreenit);

  const yhteensaTreeneja = treenit.length;
  const yhteensaMinuutteja = treenit.reduce((sum, t) => sum + t.kesto, 0);
  const keskiarvo = yhteensaTreeneja > 0 ? Math.round(yhteensaMinuutteja / yhteensaTreeneja) : 0;
  const viimeisin = treenit.length > 0 ? treenit[0].paivamaara : null;

  // Treenit lajeittain
  const lajiLaskuri = {};
  treenit.forEach(t => {
    lajiLaskuri[t.laji] = (lajiLaskuri[t.laji] || 0) + 1;
  });
  const lajitSorted = Object.entries(lajiLaskuri).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const lajit = lajitSorted.map(([nimi]) => nimi);
  const lajienMaarat = lajitSorted.map(([, maara]) => maara);

  const chartData = {
    labels: lajit.length > 0 ? lajit : ['Ei dataa'],
    datasets: [{ data: lajienMaarat.length > 0 ? lajienMaarat : [0] }],
  };

  // Treenit viimeisen 4 viikon ajalta
  const viikoittain = [0, 0, 0, 0];
  const nyt = new Date();
  treenit.forEach(t => {
    const pvm = new Date(t.paivamaara);
    const diffPaivat = Math.floor((nyt - pvm) / (1000 * 60 * 60 * 24));
    const viikkoIndeksi = Math.floor(diffPaivat / 7);
    if (viikkoIndeksi < 4) {
      viikoittain[viikkoIndeksi]++;
    }
  });
  const viikkoData = {
    labels: ['Tällä vk', '-1 vk', '-2 vk', '-3 vk'],
    datasets: [{ data: viikoittain }],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.otsikko}>📊 Yhteenveto</Text>

      {/* Pääkortit */}
      <View style={styles.kortitRivi}>
        <View style={styles.kortti}>
          <Text style={styles.korttiLuku}>{yhteensaTreeneja}</Text>
          <Text style={styles.korttiTeksti}>Treeniä</Text>
        </View>
        <View style={styles.kortti}>
          <Text style={styles.korttiLuku}>{Math.round(yhteensaMinuutteja / 60 * 10) / 10}</Text>
          <Text style={styles.korttiTeksti}>Tuntia</Text>
        </View>
        <View style={styles.kortti}>
          <Text style={styles.korttiLuku}>{keskiarvo}</Text>
          <Text style={styles.korttiTeksti}>Min/treeni</Text>
        </View>
      </View>

      {/* Lisätiedot */}
      <View style={styles.infoRivi}>
        <View style={styles.infoKortti}>
          <Text style={styles.infoOtsikko}>📅 Viimeisin treeni</Text>
          <Text style={styles.infoArvo}>{viimeisin || '—'}</Text>
        </View>
        <View style={styles.infoKortti}>
          <Text style={styles.infoOtsikko}>⭐ Suosituin liike</Text>
          <Text style={styles.infoArvo} numberOfLines={1}>
            {suosittuLiike ? `${suosittuLiike.nimi} (${suosittuLiike.maara}x)` : '—'}
          </Text>
        </View>
      </View>

      {/* Kaavio: lajeittain */}
      <Text style={styles.otsikko}>💪 Treenit lajeittain</Text>
      {lajit.length > 0 ? (
        <BarChart
          data={chartData}
          width={screenWidth - 30}
          height={220}
          chartConfig={chartConfig}
          style={styles.kaavio}
          showValuesOnTopOfBars
        />
      ) : (
        <Text style={styles.tyhja}>Lisää treenejä nähdäksesi tilastot 💪</Text>
      )}

      {/* Kaavio: viikoittain */}
      <Text style={styles.otsikko}>📆 Treenit viikoittain</Text>
      {yhteensaTreeneja > 0 ? (
        <BarChart
          data={viikkoData}
          width={screenWidth - 30}
          height={200}
          chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})` }}
          style={styles.kaavio}
          showValuesOnTopOfBars
        />
      ) : (
        <Text style={styles.tyhja}>Ei dataa vielä</Text>
      )}

    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: () => '#333',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  otsikko: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  kortitRivi: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  kortti: {
    backgroundColor: '#fff', borderRadius: 10, padding: 15, alignItems: 'center',
    flex: 1, marginHorizontal: 5, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
  },
  korttiLuku: { fontSize: 28, fontWeight: 'bold', color: '#007AFF' },
  korttiTeksti: { fontSize: 12, color: '#888', marginTop: 4 },
  infoRivi: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  infoKortti: {
    flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 14,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
  },
  infoOtsikko: { fontSize: 12, color: '#888', marginBottom: 6 },
  infoArvo: { fontSize: 15, fontWeight: 'bold', color: '#1E1E2E' },
  kaavio: { borderRadius: 10, marginBottom: 20 },
  tyhja: { textAlign: 'center', color: '#888', fontSize: 16, marginTop: 20 },
});