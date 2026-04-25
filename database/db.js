import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('treenipaivakirja.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS treenit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      laji TEXT NOT NULL,
      paivamaara TEXT NOT NULL,
      kesto INTEGER NOT NULL,
      muistiinpanot TEXT
    );
  `);
  db.execSync(`
    CREATE TABLE IF NOT EXISTS liikkeet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      treeni_id INTEGER NOT NULL,
      nimi TEXT NOT NULL,
      sarjat INTEGER,
      toistot INTEGER,
      paino REAL,
      FOREIGN KEY (treeni_id) REFERENCES treenit(id) ON DELETE CASCADE
    );
  `);
}

export function lisaaTreeni(laji, paivamaara, kesto, muistiinpanot) {
  return db.runSync(
    'INSERT INTO treenit (laji, paivamaara, kesto, muistiinpanot) VALUES (?, ?, ?, ?);',
    [laji, paivamaara, kesto, muistiinpanot]
  );
}

export function lisaaLiike(treeniId, nimi, sarjat, toistot, paino) {
  return db.runSync(
    'INSERT INTO liikkeet (treeni_id, nimi, sarjat, toistot, paino) VALUES (?, ?, ?, ?, ?);',
    [treeniId, nimi, sarjat, toistot, paino]
  );
}

export function haeTreenit() {
  return db.getAllSync('SELECT * FROM treenit ORDER BY paivamaara DESC;');
}

export function haeLiikkeet(treeniId) {
  return db.getAllSync('SELECT * FROM liikkeet WHERE treeni_id = ?;', [treeniId]);
}

export function poistaTreeni(id) {
  return db.runSync('DELETE FROM treenit WHERE id = ?;', [id]);
}

export function muokkaaTreeni(id, laji, paivamaara, kesto, muistiinpanot) {
  return db.runSync(
    'UPDATE treenit SET laji = ?, paivamaara = ?, kesto = ?, muistiinpanot = ? WHERE id = ?;',
    [laji, paivamaara, kesto, muistiinpanot, id]
  );
}

export function poistaLiike(id) {
  return db.runSync('DELETE FROM liikkeet WHERE id = ?;', [id]);
}