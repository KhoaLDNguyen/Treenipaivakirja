import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import { haeTreenit } from '../../database/db';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [treenit, setTreeenit] = useState([]);

  const lataaTreenit = useCallback(() => {
    const data = haeTreenit();
    setTreeenit(data);
  }, []);

  useFocusEffect(lataaTreenit);

  // Laske tilastot
  const yhteensaTreeneja = treenit.length;
  const yhteensaMinuutteja = treenit.reduce((sum, t) => sum + t.kesto, 0);
  const keskiarvo = yhteensaTreeneja > 0
    ? Math.round(yhteensaMinuutteja / yhteensaTreeneja)
    : 0;

  // Laske treenit lajeittain kaavioita varten
  const lajiLaskuri = {};
  treenit.forEach((t) => {
    lajiLaskuri[t.laji] = (lajiLaskuri[t.laji] || 0) + 1;
  });

  const lajit = Object.keys(lajiLaskuri).slice(0, 5);
  const lajienMaarat = lajit.map((l) => lajiLaskuri[l]);

  const chartData = {
    labels: lajit.length > 0 ? lajit : ['Ei dataa'],
    datasets: [{ data: lajienMaarat.length > 0 ? lajienMaarat : [0] }],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.otsikko}>Yhteenveto</Text>

      <View style={styles.kortitRivi}>
        <View style={styles.kortti}>
          <Text style={styles.korttiLuku}>{yhteensaTreeneja}</Text>
          <Text style={styles.korttiTeksti}>Treeniä</Text>
        </View>
        <View style={styles.kortti}>
          <Text style={styles.korttiLuku}>{yhteensaMinuutteja}</Text>
          <Text style={styles.korttiTeksti}>Minuuttia</Text>
        </View>
        <View style={styles.kortti}>
          <Text style={styles.korttiLuku}>{keskiarvo}</Text>
          <Text style={styles.korttiTeksti}>Min/treeni</Text>
        </View>
      </View>

      <Text style={styles.otsikko}>Treenit lajeittain</Text>

      {lajit.length > 0 ? (
        <BarChart
          data={chartData}
          width={screenWidth - 30}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: () => '#333',
          }}
          style={styles.kaavio}
          showValuesOnTopOfBars
        />
      ) : (
        <Text style={styles.tyhja}>Lisää treenejä nähdäksesi tilastot 💪</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  otsikko: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  kortitRivi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  kortti: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  korttiLuku: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  korttiTeksti: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  kaavio: {
    borderRadius: 10,
    marginBottom: 20,
  },
  tyhja: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
});