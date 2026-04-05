import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { lisaaTreeni } from '../../database/db';

export default function AddScreen() {
    const [laji, setLaji] = useState('');
    const [paivamaara, setPaivamaara] = useState('');
    const [kesto, setKesto] = useState('');
    const [muistiinpanot, setMuistiinpanot] = useState('');

    function tallenna() {
        if (!laji || !paivamaara || !kesto) {
            Alert.alert('Virhe', 'Täytä kaikki pakolliset kentät!');
            return;
        }
        lisaaTreeni(laji, paivamaara, parseInt(kesto), muistiinpanot);
        Alert.alert('Valmis', 'Treeni tallennettu!');
        setLaji('');
        setPaivamaara('');
        setKesto('');
        setMuistiinpanot('');
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
            <TextInput
                style={styles.input}
                placeholder="esim. 2026-04-05"
                value={paivamaara}
                onChangeText={setPaivamaara}
            />

            <Text style={styles.label}>Kesto (min) *</Text>
            <TextInput
                style={styles.input}
                placeholder="esim. 45"
                value={kesto}
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
                <Text style={styles.nappiTeksti}>Tallenna treeni</Text>
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
    nappi: {
        backgroundColor: '#007AFF',
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