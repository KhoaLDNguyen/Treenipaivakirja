import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { haeTreenit, poistaTreeni } from '../../database/db';

export default function HomeScreen() {
  const [treenit, setTreeenit] = useState([]);

  const lataaTreenit = useCallback(() => {
    const data = haeTreenit();
    setTreeenit(data);
  }, []);

  useFocusEffect(lataaTreenit);

  function poista(id) {
    Alert.alert('Poista treeni', 'Haluatko varmasti poistaa tämän treenin?', [
      { text: 'Peruuta', style: 'cancel' },
      {
        text: 'Poista',
        style: 'destructive',
        onPress: () => {
          poistaTreeni(id);
          lataaTreenit();
        },
      },
    ]);
  }

  function renderTreeni({ item }) {
    return (
      <View style={styles.kortti}>
        <View style={styles.korttiSisalto}>
          <Text style={styles.laji}>{item.laji}</Text>
          <Text style={styles.tieto}>📅 {item.paivamaara}</Text>
          <Text style={styles.tieto}>⏱ {item.kesto} min</Text>
          {item.muistiinpanot ? (
            <Text style={styles.muistiinpanot}>📝 {item.muistiinpanot}</Text>
          ) : null}
        </View>
        <TouchableOpacity style={styles.poistaNappi} onPress={() => poista(item.id)}>
          <Text style={styles.poistaTeksti}>🗑</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {treenit.length === 0 ? (
        <View style={styles.tyhja}>
          <Text style={styles.tyhjaTeksti}>Ei treenejä vielä.</Text>
          <Text style={styles.tyhjaTeksti}>Lisää ensimmäinen treeni! 💪</Text>
        </View>
      ) : (
        <FlatList
          data={treenit}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTreeni}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  kortti: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  korttiSisalto: {
    flex: 1,
  },
  laji: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tieto: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  muistiinpanot: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  poistaNappi: {
    padding: 8,
  },
  poistaTeksti: {
    fontSize: 22,
  },
  tyhja: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tyhjaTeksti: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
});