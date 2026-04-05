import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const liikkeet = {
  'Jalat 🦵': [
    { nimi: 'Kyykky', kuvaus: 'Perusliike jaloille. Pidä selkä suorana ja polvet varpaiden suuntaisina.' },
    { nimi: 'Maastaveto', kuvaus: 'Koko kehon liike. Nosta tanko maasta lantion korkeudelle.' },
    { nimi: 'Askelkyykky', kuvaus: 'Ota pitkä askel eteen ja laske takapolvi lähelle maata.' },
    { nimi: 'Leg press', kuvaus: 'Työnnä alusta jaloilla poispäin. Hyvä vaihtoehto kyykkylle.' },
    { nimi: 'Pohjeennosto', kuvaus: 'Nouse varpaillesi hitaasti ylös ja alas.' },
  ],
  'Yläkroppa 💪': [
    { nimi: 'Penkkipunnerrus', kuvaus: 'Makaa penkillä ja työnnä tanko suorille käsille.' },
    { nimi: 'Leuanveto', kuvaus: 'Roiku tangosta ja vedä itsesi ylös leuan tangon yläpuolelle.' },
    { nimi: 'Soutu', kuvaus: 'Vedä tankoa tai kahvakuulaa kohti vatsaa. Vahvistaa selkää.' },
    { nimi: 'Olkapääpunnerrus', kuvaus: 'Työnnä tanko tai käsipainot pään yläpuolelle.' },
    { nimi: 'Dippi', kuvaus: 'Laske itsesi kahden tason välissä kyynärpäät taaksepäin.' },
  ],
  'Vatsa 🔥': [
    { nimi: 'Lankku', kuvaus: 'Pidä keho suorana kyynärpäiden ja varpaiden varassa. 30-60 sek.' },
    { nimi: 'Sit-up', kuvaus: 'Nouse makuulta istuma-asentoon. Pidä kädet rinnan päällä.' },
    { nimi: 'Pyörä', kuvaus: 'Tuo kyynärpää vastakkaiseen polveen vuorotellen.' },
    { nimi: 'Leg raise', kuvaus: 'Makaa selällään ja nosta suorat jalat 90 asteen kulmaan.' },
  ],
  'Selkä 🏋️': [
    { nimi: 'Hyperextensio', kuvaus: 'Laske yläkroppa alas ja nosta takaisin. Vahvistaa alaselkää.' },
    { nimi: 'Lat pulldown', kuvaus: 'Vedä tanko leuan alle laitteessa. Hyvä leuanvedon vaihtoehto.' },
    { nimi: 'Kaapelisoutu', kuvaus: 'Istu laitteessa ja vedä kahva kohti vatsaa.' },
  ],
};

export default function ExploreScreen() {
  const [avoinna, setAvoinna] = useState(null);
  const [avattuLiike, setAvattuLiike] = useState(null);

  function toggleKategoria(kategoria) {
    setAvoinna(avoinna === kategoria ? null : kategoria);
    setAvattuLiike(null);
  }

  function toggleLiike(nimi) {
    setAvattuLiike(avattuLiike === nimi ? null : nimi);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.otsikko}>💪 Kuntosaliliikkeet</Text>
      <Text style={styles.alaotsikko}>Paina kategoriaa nähdäksesi liikkeet</Text>

      {Object.keys(liikkeet).map((kategoria) => (
        <View key={kategoria} style={styles.kategoriaKortti}>
          <TouchableOpacity
            style={styles.kategoriaOtsikko}
            onPress={() => toggleKategoria(kategoria)}
          >
            <Text style={styles.kategoriaTeksti}>{kategoria}</Text>
            <Text style={styles.nuoli}>{avoinna === kategoria ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {avoinna === kategoria && (
            <View style={styles.liikeLista}>
              {liikkeet[kategoria].map((liike) => (
                <View key={liike.nimi}>
                  <TouchableOpacity
                    style={styles.liikeRivi}
                    onPress={() => toggleLiike(liike.nimi)}
                  >
                    <Text style={styles.liikeNimi}>{liike.nimi}</Text>
                    <Text style={styles.nuoli}>{avattuLiike === liike.nimi ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  {avattuLiike === liike.nimi && (
                    <Text style={styles.liikeKuvaus}>{liike.kuvaus}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
    color: '#1E1E2E',
  },
  alaotsikko: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  kategoriaKortti: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  kategoriaOtsikko: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E1E2E',
  },
  kategoriaTeksti: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  nuoli: {
    fontSize: 14,
    color: '#4FC3F7',
  },
  liikeLista: {
    padding: 10,
  },
  liikeRivi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  liikeNimi: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  liikeKuvaus: {
    fontSize: 13,
    color: '#666',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 5,
  },
});