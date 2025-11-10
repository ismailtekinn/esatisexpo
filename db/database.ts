import * as SQLite from 'expo-sqlite';

const db = (SQLite as any).openDatabase('products.db');

export const createProductsTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Products (
        Index INTEGER PRIMARY KEY,
        ProductName TEXT,
        Barcode TEXT,
        Stock INTEGER,
        Price REAL,
        VatRate REAL,
        Rayon TEXT,
        Currency TEXT,
        UrunId INTEGER,
        Tutar REAL
      );`,
      [],
      () => console.log('Products tablosu oluşturuldu veya zaten mevcut.'),
      (_tx: any, error: any) => {
        console.error('Products tablosu oluşturulamadı:', error);
        return false;
      }
    );
  }, (error: any) => {
    console.error('Transaction hatası:', error);
  });
};
