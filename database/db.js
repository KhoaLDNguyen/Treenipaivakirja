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
}

export function lisaaTreeni(laji, paivamaara, kesto, muistiinpanot) {
  return db.runSync(
    'INSERT INTO treenit (laji, paivamaara, kesto, muistiinpanot) VALUES (?, ?, ?, ?);',
    [laji, paivamaara, kesto, muistiinpanot]
  );
}

export function haeTreenit() {
  return db.getAllSync('SELECT * FROM treenit ORDER BY paivamaara DESC;');
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