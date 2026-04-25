import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

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
    { nimi: 'Leuanveto', kuvaus: 'Roiju tangosta ja vedä itsesi ylös leuan tangon yläpuolelle.' },
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

const juoksuohjelmat = [
  {
    nimi: 'Aloittelija 🟢',
    kuvaus: '5 viikon ohjelma juoksun aloittamiseen. Sopii täysin aloittelijalle.',
    viikot: [
      { viikko: 'Viikko 1', ohje: 'Kävele 20 min. Toista 3x viikossa.' },
      { viikko: 'Viikko 2', ohje: 'Vuorottele: 1 min juoksu, 2 min kävely. Yhteensä 20 min. 3x viikossa.' },
      { viikko: 'Viikko 3', ohje: 'Vuorottele: 2 min juoksu, 1 min kävely. Yhteensä 20 min. 3x viikossa.' },
      { viikko: 'Viikko 4', ohje: 'Juokse 5 min, kävele 1 min. Toista 3 kertaa. 3x viikossa.' },
      { viikko: 'Viikko 5', ohje: 'Juokse 20 min yhtäjaksoisesti. 3x viikossa.' },
    ],
  },
  {
    nimi: 'Keskitaso 🟡',
    kuvaus: '4 viikon ohjelma peruskunnon parantamiseen. Sopii jos juokset jo jonkin verran.',
    viikot: [
      { viikko: 'Viikko 1', ohje: 'Ma: 30 min rauhallinen juoksu. Ke: 20 min intervallit (1 min nopea, 1 min hidas). Pe: 35 min rauhallinen.' },
      { viikko: 'Viikko 2', ohje: 'Ma: 35 min rauhallinen. Ke: 25 min intervallit. Pe: 40 min rauhallinen.' },
      { viikko: 'Viikko 3', ohje: 'Ma: 40 min rauhallinen. Ke: 30 min intervallit. Pe: 45 min rauhallinen.' },
      { viikko: 'Viikko 4', ohje: 'Ma: 45 min rauhallinen. Ke: 35 min intervallit. Pe: 50 min rauhallinen.' },
    ],
  },
  {
    nimi: 'Edistynyt 🔴',
    kuvaus: '4 viikon tehoohjelma. Sopii kokeneemmille juoksijoille.',
    viikot: [
      { viikko: 'Viikko 1', ohje: 'Ma: 50 min rauhallinen. Ti: 30 min intervallit (2 min nopea, 1 min hidas). To: 40 min tempo. La: 60 min pitkä lenkki.' },
      { viikko: 'Viikko 2', ohje: 'Ma: 55 min rauhallinen. Ti: 35 min intervallit. To: 45 min tempo. La: 70 min pitkä lenkki.' },
      { viikko: 'Viikko 3', ohje: 'Ma: 60 min rauhallinen. Ti: 40 min intervallit. To: 50 min tempo. La: 80 min pitkä lenkki.' },
      { viikko: 'Viikko 4', ohje: 'Ma: 45 min rauhallinen (palautusviikko). Ti: 30 min kevyt. To: 35 min rauhallinen. La: 60 min rauhallinen.' },
    ],
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [nakyma, setNakyma] = useState('kuntosali');
  const [avoinna, setAvoinna] = useState(null);
  const [avattuLiike, setAvattuLiike] = useState(null);
  const [avattuViikko, setAvattuViikko] = useState(null);

  function toggleKategoria(kategoria) {
    setAvoinna(avoinna === kategoria ? null : kategoria);
    setAvattuLiike(null);
  }

  function toggleLiike(nimi) {
    setAvattuLiike(avattuLiike === nimi ? null : nimi);
  }

  function toggleOhjelma(nimi) {
    setAvoinna(avoinna === nimi ? null : nimi);
    setAvattuViikko(null);
  }

  function toggleViikko(viikko) {
    setAvattuViikko(avattuViikko === viikko ? null : viikko);
  }

  function lisaaPaivakirjaan(laji: string, muistiinpanot: string) {
    router.push({
      pathname: '/(tabs)/add',
      params: { laji, muistiinpanot },
    });
  }

  return (
    <ScrollView style={styles.container}>

      {/* Välilehdet */}
      <View style={styles.tabRivi}>
        <TouchableOpacity
          style={[styles.tab, nakyma === 'kuntosali' && styles.tabAktiivinen]}
          onPress={() => { setNakyma('kuntosali'); setAvoinna(null); }}
        >
          <Text style={[styles.tabTeksti, nakyma === 'kuntosali' && styles.tabTekstiAktiivinen]}>
            💪 Kuntosali
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, nakyma === 'juoksu' && styles.tabAktiivinen]}
          onPress={() => { setNakyma('juoksu'); setAvoinna(null); }}
        >
          <Text style={[styles.tabTeksti, nakyma === 'juoksu' && styles.tabTekstiAktiivinen]}>
            🏃 Juoksu
          </Text>
        </TouchableOpacity>
      </View>

      {/* Kuntosaliliikkeet */}
      {nakyma === 'kuntosali' && (
        <View>
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
                        <View style={styles.liikeKuvausContainer}>
                          <Text style={styles.liikeKuvaus}>{liike.kuvaus}</Text>
                          <TouchableOpacity
                            style={styles.lisaaNappi}
                            onPress={() => lisaaPaivakirjaan('Kuntosali', liike.nimi)}
                          >
                            <Text style={styles.lisaaNappiTeksti}>📝 Lisää päiväkirjaan</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Juoksuohjelmat */}
      {nakyma === 'juoksu' && (
        <View>
          <Text style={styles.otsikko}>🏃 Juoksuohjelmat</Text>
          <Text style={styles.alaotsikko}>Valitse tasosi ja seuraa ohjelmaa</Text>
          {juoksuohjelmat.map((ohjelma) => (
            <View key={ohjelma.nimi} style={styles.kategoriaKortti}>
              <TouchableOpacity
                style={styles.kategoriaOtsikko}
                onPress={() => toggleOhjelma(ohjelma.nimi)}
              >
                <Text style={styles.kategoriaTeksti}>{ohjelma.nimi}</Text>
                <Text style={styles.nuoli}>{avoinna === ohjelma.nimi ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {avoinna === ohjelma.nimi && (
                <View style={styles.liikeLista}>
                  <Text style={styles.ohjelmakuvaus}>{ohjelma.kuvaus}</Text>
                  {ohjelma.viikot.map((v) => (
                    <View key={v.viikko}>
                      <TouchableOpacity
                        style={styles.liikeRivi}
                        onPress={() => toggleViikko(v.viikko)}
                      >
                        <Text style={styles.liikeNimi}>{v.viikko}</Text>
                        <Text style={styles.nuoli}>{avattuViikko === v.viikko ? '▲' : '▼'}</Text>
                      </TouchableOpacity>
                      {avattuViikko === v.viikko && (
                        <View style={styles.liikeKuvausContainer}>
                          <Text style={styles.liikeKuvaus}>{v.ohje}</Text>
                          <TouchableOpacity
                            style={styles.lisaaNappi}
                            onPress={() => lisaaPaivakirjaan('Juoksu', `${ohjelma.nimi} - ${v.viikko}: ${v.ohje}`)}
                          >
                            <Text style={styles.lisaaNappiTeksti}>📝 Lisää päiväkirjaan</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
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
  tabRivi: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabAktiivinen: {
    backgroundColor: '#1E1E2E',
  },
  tabTeksti: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  tabTekstiAktiivinen: {
    color: '#4FC3F7',
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
  ohjelmakuvaus: {
    fontSize: 13,
    color: '#555',
    padding: 12,
    fontStyle: 'italic',
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
  liikeKuvausContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 5,
    padding: 12,
  },
  liikeKuvaus: {
    fontSize: 13,
    color: '#666',
  },
  lisaaNappi: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  lisaaNappiTeksti: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});