export enum IndirimTipi {
  YuzdeIndirim = 0, // yüzde indirim
  TutarIndirimi = 1, // tutar indirimi
  OtoYuzdeIndirim = 2, // otomatik yüzde indirimi (müşteri kayıtlı ise)
  ArttirimTutar = 3, // arttırım tutar
  OtoTutarIndirim = 4, // otomatik tutar indirimi (müşteri kayıtlı ise)
}

export enum MüşteriAramaTipi {
  MusteriAdi = 0,
  MusteriSoyadi = 1,
  MusteriKartNo = 2,
  MusteriTcNo = 3,
  MusteriGsm = 4,
  VergiNumarasi = 5,
  VergiDairesi = 6,
  CariId = 7,
}

export enum SearchOptionTitles {
  AdTcKartNo = "Ad & T.C & Kart No",
  MusteriAdi = "Müşteri Adına Göre",
  MusteriSoyadi = "Müşteri Soyadına Göre",
  TcNumarasi = "T.C. Numarasına Göre",
  KartNumarasi = "Kart Numarasına Göre Ara",
  Gsm = "GSM'e Göre Ara",
  VergiDairesi = "Vergi Dairesine Göre Ara",
  VergiNumarasi = "Vergi Numarasına Göre Ara",
}


export enum SearchOptionValues {
  AdTcKartNo = 7,
  MusteriAdi = 0,
  MusteriSoyadi = 1,
  TcNumarasi = 2,
  KartNumarasi = 3,
  Gsm = 4,
  VergiDairesi = 5,
  VergiNumarasi = 6,
}