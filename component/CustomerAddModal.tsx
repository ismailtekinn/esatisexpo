import React, { useRef, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Switch,
  Dimensions,
} from "react-native";
import CustomerSelectDropDownModal from "./CustomerSelectDropDownModal";
import { AddCustomerDropDownType } from "../types/addCustomerDropDownType";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useAddCustomerForm } from "../contex/customer/addCustomerFormContext";
import { useBussinessContext } from "../contex/addCustomerModal/bussinessContext";
import { addUpdateEntity, fetchSearchMethot } from "../api/generic";
import {
  API_URL8082,
  API_URL8082_Local,
  API_URL8082_Local2,
  CARI_EKLE_GUNCELLE_URL,
  MUSTERI_SORGULA_URL,
} from "../constants/constant";
import AlertModal from "./AlertModal";
import { CustomerItem, DATum } from "../types/apiresponse/searchCustomers";
import { SearchCustomerFields } from "../types/customerType";
// import { SqlData } from "../types/apiresponse/genericResponseType";
import {
  mapBackendToForm,
  mapCustomerBackendToForm,
} from "../utils/func/formMapper";
import { TCKimlikDogrula } from "../utils/func/tcKimlikDogrula";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CustomerAddModal({ visible, onClose }: Props) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState(0);
  const [smsGuncellemessin, setSmsGuncellemessin] = useState(false);
  const [kanGrubuModalVisible, setKanGrubuModalVisible] = useState(false);
  const { customerData } = useBussinessContext();
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [dropdownType, setDropDownType] =
    useState<AddCustomerDropDownType>("kanGrubu");
  const { addCustomForm, setAddCustomForm } = useAddCustomerForm();
  const scrollRef = useRef<ScrollView>(null);

  const [showFamilyDeposit, setShowFamilyDeposit] = useState(false);
  const [searchData, setSearchData] = useState<SearchCustomerFields>({
    WebErisimKullanici: "TRIA_TEST",
    WebErisimSifre: "SFR57220",
    Aranan: "A%%",
    AramaTipi: 7,
    MusteriKartBilgileriGetir: true,
    DetayDataGetir: true,
    CariBakiyeGetir: true,
    AileBakiyesiGetir: true,
  });

  // const handleSave = async () => {
  //   try {
  //     console.log("handlesave fonksiyonu tetiklendi, addCustomForm: ");
  //     const newCustomerId = 280454; // save sonucunda dönen ID
  //     const mergedItem = await fetchCustomerById(newCustomerId);

  //     console.log("response parse verisi console yazdırılıyor: ", mergedItem);
  //     if (mergedItem) {
  //       setAddCustomForm((prevForm) =>
  //         mapCustomerBackendToForm(mergedItem, prevForm)
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Müşteri verisi çekilirken hata oluştu:", error);
  //   }
  // };

  const formatMusteriUyarilari = (
    uyarilar: { id: number; label: string }[]
  ) => {
    if (!Array.isArray(uyarilar) || uyarilar.length === 0) return "";
    return uyarilar.map((u) => u.label.trim()).join("\r\n");
  };

  const fetchCustomerById = async (customerId: number) => {
    // const url = `${API_URL8082_Local}MusteriSorgula`;
    const searchDataForCustomer: SearchCustomerFields = {
      ...searchData,
      Aranan: String(customerId),
      AramaTipi: 7,
      MusteriKartBilgileriGetir: true,
    };

    const response = await fetchSearchMethot<DATum, SearchCustomerFields>(
      MUSTERI_SORGULA_URL,
      searchDataForCustomer
    );
    const firstItem = response.main.DATA?.[0] || {};
    const secondItem = response.SQL_Data_2?.DATA?.[0] || {};
    return { ...firstItem, ...secondItem };
  };

  const handleSave = async () => {
    const newErrors: { [key: string]: string } = {};
    // Müşteri adı kontrolü
    if (!addCustomForm.CARI_ADI || addCustomForm.CARI_ADI.trim() === "") {
      newErrors.CARI_ADI = "Müşteri adı boş bırakılamaz.";
    }

    // TC kontrolü
    if (
      !addCustomForm.TC_KIMLIK_NO ||
      addCustomForm.TC_KIMLIK_NO.trim() === ""
    ) {
      newErrors.TC_KIMLIK_NO = "TC alanı boş bırakılamaz.";
    } else if (!/^\d{11}$/.test(addCustomForm.TC_KIMLIK_NO)) {
      newErrors.TC_KIMLIK_NO = "Geçersiz TC numarası!";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const allMessages = Object.values(newErrors).join("\n");
      setAlertMessage(allMessages);
      setAlertModalVisible(true);
      return;
    }

    const musterUyarilariStr = formatMusteriUyarilari(
      addCustomForm.MusteriUyarilari || []
    );

    const formToSend = {
      ...addCustomForm,
      UYARI_BILGI: musterUyarilariStr,
    };
    // const url = `${API_URL8082_Local}CariEkleGuncelle`;

    const response = await addUpdateEntity(CARI_EKLE_GUNCELLE_URL, formToSend);
    let newCustomerId: number;
    if (response.success) {
      newCustomerId =
        response.raw?.Id ||
        JSON.parse(response.raw?.SQL_Data || "{}")?.DATA?.[0]?.ID;

      const mergedItem = await fetchCustomerById(newCustomerId);

      if (mergedItem) {
        setAddCustomForm((prevForm) =>
          mapCustomerBackendToForm(mergedItem, prevForm)
        );
      }
      setAlertMessage("Müşteri kaydı başarılı bir şekilde oluşturuldu");
      setAlertModalVisible(true);
    } else {
      setAlertMessage(`${response.message}`);
      setAlertModalVisible(true);
    }
  };

  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleChange = (key: string, value: string) => {
    setAddCustomForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (key === "TC_KIMLIK_NO") {
        if (value.length < 11) {
          newErrors[key] = "T.C Kimlik No 11 haneli olmalı";
        } else if (value.length === 11) {
          const isValid = TCKimlikDogrula(value);
          if (!isValid) newErrors[key] = "Geçersiz T.C Kimlik No";
          else delete newErrors[key]; // geçerliyse hatayı kaldır
        } else {
          delete newErrors[key];
        }
      }

      return newErrors;
    });
  };

  const tabs = [
    { id: 0, label: "Temel Bilgiler", icon: "profile" },
    { id: 1, label: "Firma & Diğer Bilgiler", icon: "idcard" },
    { id: 2, label: "Borç & Alacak", icon: "swap" },
    { id: 3, label: "Kart&Uyarı Bilgileri", icon: "warning" },
    { id: 4, label: "Müşteri Grupları", icon: "team" },
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      // temel bilgiler
      case 0:
        return (
          <View style={styles.tabContent}>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Cari Adı </Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.CARI_ADI && { borderColor: "red" },
                  ]}
                  value={addCustomForm.CARI_ADI}
                  onChangeText={(t) => handleChange("CARI_ADI", t)}
                  placeholder="Müşteri Adı"
                  placeholderTextColor="#999"
                />
                {errors.CARI_ADI && (
                  <Text style={{ color: "red", marginTop: 4 }}>
                    {errors.CARI_ADI}
                  </Text>
                )}
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Telefon No</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.TELEFON && { borderColor: "red" },
                  ]}
                  value={addCustomForm.TELEFON}
                  onChangeText={(t) => handleChange("TELEFON", t)}
                  keyboardType="phone-pad"
                  placeholder="(0xxx) xxx xx xx"
                  placeholderTextColor="#999"
                />
                {errors.TELEFON && (
                  <Text style={{ color: "red", marginTop: 4 }}>
                    {errors.TELEFON}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>T.C Kimlik No</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.TC_KIMLIK_NO ? styles.inputError : null,
                  ]}
                  value={addCustomForm.TC_KIMLIK_NO}
                  onChangeText={(t) => handleChange("TC_KIMLIK_NO", t)}
                  placeholder="11 haneli T.C No"
                  placeholderTextColor="#999"
                />
                {errors.TC_KIMLIK_NO && (
                  <Text style={styles.errorText}>{errors.TC_KIMLIK_NO}</Text>
                )}
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Meslek</Text>
                <TouchableOpacity
                  style={styles.input}
                  activeOpacity={0.7}
                  onPress={() => {
                    setKanGrubuModalVisible(true);
                    setDropDownType("meslek");
                  }}
                >
                  <Text
                    style={{
                      color: addCustomForm.MESLEK ? "#000" : "#999",
                    }}
                  >
                    {addCustomForm.MESLEK || "Meslek"}
                  </Text>
                  <AntDesign
                    name="down"
                    size={16}
                    color="#999"
                    style={{
                      position: "absolute",
                      right: "5%",
                      top: "60%",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Kan Grubu</Text>

                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setKanGrubuModalVisible(true);
                    setDropDownType("kanGrubu");
                  }} // modal aç
                >
                  <Text
                    style={{ color: addCustomForm.KAN_GRUBU ? "#000" : "#999" }}
                  >
                    {addCustomForm.KAN_GRUBU || "A+, B-, AB+, O- vb."}
                  </Text>
                  <AntDesign
                    name="down"
                    size={16}
                    color="#999"
                    style={{
                      position: "absolute",
                      right: "5%",
                      top: "60%",
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Yaş </Text>
                <TextInput
                  style={[styles.input]}
                  value={addCustomForm.Yas}
                  onChangeText={(t) => handleChange("Yas", t)}
                  placeholder="Yas"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Doğum Tarihi</Text>

                <TouchableOpacity
                  style={[styles.input]}
                  onPress={() => {
                    DateTimePickerAndroid.open({
                      value: addCustomForm.M_DOGUM_TARIHI
                        ? new Date(addCustomForm.M_DOGUM_TARIHI)
                        : new Date(),
                      mode: "date",
                      onChange: (event, date) => {
                        if (event.type === "set" && date) {
                          // Tarihi sadece GG.AA.YYYY formatında kaydet
                          const formattedDate = date.toLocaleDateString(
                            "tr-TR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          );

                          handleChange("M_DOGUM_TARIHI", formattedDate);
                        }
                      },
                    });
                  }}
                >
                  <Text
                    style={{
                      color: addCustomForm.M_DOGUM_TARIHI ? "#000" : "#999",
                    }}
                  >
                    {addCustomForm.M_DOGUM_TARIHI
                      ? addCustomForm.M_DOGUM_TARIHI
                      : "Şehir / GG.AA.YYYY"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Cinsiyet</Text>

                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setKanGrubuModalVisible(true); // modal aç
                    setDropDownType("cinsiyet"); // type'ı taşı
                  }}
                >
                  <Text
                    style={{
                      color: addCustomForm.M_CINSIYETI ? "#000" : "#999",
                    }}
                  >
                    {addCustomForm.M_CINSIYETI === "0"
                      ? "Erkek"
                      : addCustomForm.M_CINSIYETI === "1"
                      ? "Kadın"
                      : "Erkek / Kadın"}
                  </Text>
                  <AntDesign
                    name="down"
                    size={16}
                    color="#999"
                    style={{
                      position: "absolute",
                      right: "5%",
                      top: "60%",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Müşteri Grubu</Text>

                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setDropDownType("musteriGrubu"); // açılacak dropdown tipi
                    setKanGrubuModalVisible(true); // modalı aç
                  }}
                >
                  <Text
                    style={{
                      color: addCustomForm.GRUP_NO ? "#000" : "#999",
                    }}
                  >
                    {/* {addCustomForm.GRUP_NO || "Grup seçiniz"} */}
                    {customerData?.find(
                      (g) => g.GRUP_NO.toString() === addCustomForm.GRUP_NO
                    )?.GRUP_ADI || "Grup seçiniz"}
                  </Text>
                  <AntDesign
                    name="down"
                    size={16}
                    color="#999"
                    style={{
                      position: "absolute",
                      right: "5%",
                      top: "60%",
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Vergi Dairesi</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.VERGI_DAIRESI}
                  onChangeText={(t) => handleChange("VERGI_DAIRESI", t)}
                  placeholder="Vergi dairesi adı"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Vergi No</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.VERGI_NUMARASI}
                  onChangeText={(t) => handleChange("VERGI_NUMARASI", t)}
                  keyboardType="numeric"
                  placeholder="10 haneli vergi no"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>İl</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.IL}
                  onChangeText={(t) => handleChange("IL", t)}
                  keyboardType="phone-pad"
                  placeholder="İl"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>İlçe</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.ILCE}
                  onChangeText={(t) => handleChange("ILCE", t)}
                  keyboardType="phone-pad"
                  placeholder="İlçe"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Semt</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.SEMT}
                  onChangeText={(t) => handleChange("SEMT", t)}
                  keyboardType="phone-pad"
                  placeholder="Semt"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>
        );
      // firma ve diğer bilgiler
      case 1:
        return (
          <View style={styles.tabContent}>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Cari Unvanı</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.CARI_UNVANI}
                  onChangeText={(t) => handleChange("CARI_UNVANI", t)}
                  placeholder="Yetkili Unvanı"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Yetkili Adı</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.YetkiliAdi}
                  onChangeText={(t) => handleChange("YetkiliAdi", t)}
                  placeholder="Yetkili Adı"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Medeni Hali</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.MedeniHali}
                  onChangeText={(t) => handleChange("MedeniHali", t)}
                  placeholder="Müşteri Medeni Hali"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Yupass</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.YUPAS_NO}
                  onChangeText={(t) => handleChange("YUPAS_NO", t)}
                  placeholder="Yupass No"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Veresiye Limiti</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.VeresiyeLimiti}
                  onChangeText={(t) => handleChange("VeresiyeLimiti", t)}
                  placeholder="VeresiyeLimiti"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Emanet Limiti</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.EmanetLimiti}
                  onChangeText={(t) => handleChange("EmanetLimiti", t)}
                  placeholder="EmanetLimiti"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={addCustomForm.EMAIL}
                onChangeText={(t) => handleChange("webEmail", t)}
                keyboardType="email-address"
                placeholder="ornek@email.com"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        );
      // Borç alacak bilgileri
      case 2:
        return (
          <View style={styles.tabContent}>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Müşteri Borcu</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.MusteriBorcu}
                  onChangeText={(t) => handleChange("MusteriBorcu", t)}
                  placeholder="Müşteri Borcu"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Müşteri Alacağı</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.MusteriAlacagi}
                  onChangeText={(t) => handleChange("MusteriAlacagi", t)}
                  keyboardType="numeric"
                  placeholder="Müşteri Alacağı"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Emanet Adedi</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.MusteriBorcu}
                  onChangeText={(t) => handleChange("MusteriBorcu", t)}
                  placeholder="Müşteri Borcu"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Toplam Borç</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.MusteriAlacagi}
                  onChangeText={(t) => handleChange("MusteriAlacagi", t)}
                  keyboardType="numeric"
                  placeholder="Müşteri Alacağı"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#2563eb",
                marginBottom: 8,
              }}
            >
              E-Fatura
            </Text>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Fatura Senaryosu</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.E_FAT_SENARYO}
                  onChangeText={(t) => handleChange("E_FAT_SENARYO", t)}
                  placeholder="Fatura Senaryosu"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Posta Kutusu</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.E_FAT_POS_KUTUSU}
                  onChangeText={(t) => handleChange("E_FAT_POS_KUTUSU", t)}
                  keyboardType="numeric"
                  placeholder="E-Posta Kutusu"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={{ marginTop: 16 }}>
              <TouchableOpacity
                style={[
                  styles.familyButton,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setShowFamilyDeposit((prev) => !prev);
                  scrollRef.current?.scrollToEnd({ animated: true });
                }}
              >
                <Text style={styles.familyButtonText}>
                  Aile üyelerinin emanet bilgileri
                </Text>
                <AntDesign
                  name={showFamilyDeposit ? "up" : "down"}
                  size={18}
                  color="#2563eb"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
              {showFamilyDeposit && (
                <View
                  style={[
                    styles.familyDepositBox,
                    {
                      borderLeftWidth: 4,
                      borderLeftColor: "#2563eb",
                      shadowColor: "#2563eb",
                      shadowOpacity: 0.08,
                      shadowRadius: 8,
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <AntDesign
                      name="team"
                      size={22}
                      color="#2563eb"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#2563eb",
                      }}
                    >
                      Aile Emanet Özeti
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <View>
                      <Text style={styles.summaryLabel}>
                        Toplam aile fert sayısı
                      </Text>
                      <Text style={styles.summaryValue}>
                        {addCustomForm.AileFertTotal}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.summaryLabel}>
                        Toplam emanet sayısı
                      </Text>
                      <Text style={styles.summaryValue}>
                        {addCustomForm.ToplamAileEmanetAdet}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <View>
                      <Text style={styles.summaryLabel}>Toplam alacak</Text>
                      <Text style={[styles.summaryValue, { color: "#22c55e" }]}>
                        {addCustomForm.AileFertAlacak} ₺
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.summaryLabel}>Toplam verecek</Text>
                      <Text style={[styles.summaryValue, { color: "#ef4444" }]}>
                        {addCustomForm.AileFertBorç} ₺
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "center", marginTop: 8 }}>
                    <Text style={[styles.summaryLabel, { fontSize: 15 }]}>
                      Toplam borç miktarı
                    </Text>
                    <Text
                      style={[
                        styles.summaryValue,
                        { fontSize: 18, color: "#2563eb", fontWeight: "bold" },
                      ]}
                    >
                      {addCustomForm.ToplamAileEmanetTutar} ₺
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        );
      //  kart ve uyarı bilgileri
      case 3:
        return (
          <View style={styles.tabContent}>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Kart No</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.KART_NO}
                  onChangeText={(t) => handleChange("KART_NO", t)}
                  placeholder="KART NO"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Kart Adı</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.KartAdı}
                  onChangeText={(t) => handleChange("KartAdı", t)}
                  placeholder="Kart Adı"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Kart Türü</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.KartTuru}
                  onChangeText={(t) => handleChange("KartTuru", t)}
                  placeholder="Kart Türü"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Kart Durumu</Text>
                <TextInput
                  style={styles.input}
                  value={addCustomForm.KartDurumu}
                  onChangeText={(t) => handleChange("KartDurumu", t)}
                  placeholder="Kart Durumu"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.rowInner}>
              <View style={styles.row}>
                <View style={styles.fieldHalf}>
                  <Text style={styles.label}>Müşteri Grubu1</Text>

                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => {
                      setDropDownType("musteriGrubu"); // açılacak dropdown tipi
                      setKanGrubuModalVisible(true); // modalı aç
                    }}
                  >
                    <Text
                      style={{
                        color: addCustomForm.GRUP_NO ? "#000" : "#999",
                      }}
                    >
                      {/* {addCustomForm.GRUP_NO || "Grup seçiniz"} */}
                      {customerData?.find(
                        (g) => g.GRUP_NO.toString() === addCustomForm.GRUP_NO
                      )?.GRUP_ADI || "Grup seçiniz"}
                    </Text>
                    <AntDesign
                      name="down"
                      size={16}
                      color="#999"
                      style={{
                        position: "absolute",
                        right: "5%",
                        top: "60%",
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldHalf}>
                  <View style={styles.switchBox}>
                    <Switch
                      value={addCustomForm.SMS_GONDERILMESIN === 1}
                      onValueChange={(value) => {
                        setAddCustomForm((prev) => ({
                          ...prev,
                          SMS_GONDERILMESIN: value ? 1 : 0,
                        }));
                      }}
                      trackColor={{ false: "#ddd", true: "#2563eb" }}
                      thumbColor="#fff"
                      disabled={addCustomForm.ID === 0}
                    />
                    <Text style={styles.switchLabel}>SMS Gönderilmesin</Text>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={[
                  styles.familyButton,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setShowFamilyDeposit((prev) => !prev);
                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
              >
                <Text style={styles.musteriUyarıButonText}>
                  Müşteri Uyarıları
                </Text>
                <AntDesign
                  name={showFamilyDeposit ? "up" : "down"}
                  size={18}
                  color="#2563eb"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
              {showFamilyDeposit && (
                <View
                  style={[styles.musteriuyarıButonuBox, { marginTop: 8 }]}
                  onLayout={() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }}
                >
                  {addCustomForm.MusteriUyarilari?.map((uyari) => (
                    <View
                      key={uyari.id}
                      style={[
                        styles.warningBox,
                        { flexDirection: "row", alignItems: "center" },
                      ]}
                    >
                      <AntDesign
                        name="warning"
                        size={18}
                        color="#f59e42"
                        style={{ marginRight: 8 }}
                      />
                      <TextInput
                        style={[
                          styles.summaryText,
                          {
                            flex: 1,
                            backgroundColor: "transparent",
                            padding: 0,
                            maxHeight: 80,
                          },
                        ]}
                        onFocus={() => {
                          setTimeout(() => {
                            scrollRef.current?.scrollToEnd({ animated: true });
                          }, 300);
                        }}
                        multiline={true}
                        scrollEnabled={true}
                        value={uyari.label}
                        onChangeText={(text) => {
                          setAddCustomForm((prev) => ({
                            ...prev,
                            MusteriUyarilari: (prev.MusteriUyarilari ?? []).map(
                              (item) =>
                                item.id === uyari.id
                                  ? { ...item, label: text }
                                  : item
                            ),
                          }));
                        }}
                        placeholder="Uyarı metni"
                        placeholderTextColor="#999"
                      />

                      {/* 🗑️ Silme butonu */}
                      <TouchableOpacity
                        onPress={() => {
                          setAddCustomForm((prev) => ({
                            ...prev,
                            MusteriUyarilari: prev.MusteriUyarilari?.filter(
                              (item) => item.id !== uyari.id
                            ),
                          }));
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        <AntDesign name="delete" size={20} color="#e53935" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* ➕ Listenin en altına ekleme butonu */}
                  <TouchableOpacity
                    onPress={() => {
                      setAddCustomForm((prev) => ({
                        ...prev,
                        MusteriUyarilari: [
                          ...(prev.MusteriUyarilari ?? []),
                          { id: Date.now(), label: "" },
                        ],
                      }));
                      setTimeout(() => {
                        scrollRef.current?.scrollToEnd({ animated: true });
                      }, 200);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <AntDesign name="pluscircleo" size={20} color="#4CAF50" />
                    <Text style={{ marginLeft: 6, color: "#4CAF50" }}>
                      Yeni Uyarı Ekle
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );
      // Müşteri grupları
      case 4:
        return (
          <View style={styles.tabContent}>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Müşteri Grubu1</Text>

                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setDropDownType("musteriGrubu"); // açılacak dropdown tipi
                    setKanGrubuModalVisible(true); // modalı aç
                  }}
                >
                  <Text
                    style={{
                      color: addCustomForm.GRUP_NO ? "#000" : "#999",
                    }}
                  >
                    {/* {addCustomForm.GRUP_NO || "Grup seçiniz"} */}
                    {customerData?.find(
                      (g) => g.GRUP_NO.toString() === addCustomForm.GRUP_NO
                    )?.GRUP_ADI || "Grup seçiniz"}
                  </Text>
                  <AntDesign
                    name="down"
                    size={16}
                    color="#999"
                    style={{
                      position: "absolute",
                      right: "5%",
                      top: "60%",
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Müşteri Grubu2</Text>

                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setDropDownType("musteriGrubu"); // açılacak dropdown tipi
                    setKanGrubuModalVisible(true); // modalı aç
                  }}
                >
                  <Text
                    style={{
                      color: addCustomForm.GRUP_NO ? "#000" : "#999",
                    }}
                  >
                    {/* {addCustomForm.GRUP_NO || "Grup seçiniz"} */}
                    {customerData?.find(
                      (g) => g.GRUP_NO.toString() === addCustomForm.GRUP_NO
                    )?.GRUP_ADI || "Grup seçiniz"}
                  </Text>
                  <AntDesign
                    name="down"
                    size={16}
                    color="#999"
                    style={{
                      position: "absolute",
                      right: "5%",
                      top: "60%",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Müşteri Grubu3</Text>

                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setDropDownType("musteriGrubu"); // açılacak dropdown tipi
                    setKanGrubuModalVisible(true); // modalı aç
                  }}
                >
                  <Text
                    style={{
                      color: addCustomForm.GRUP_NO ? "#000" : "#999",
                    }}
                  >
                    {/* {addCustomForm.GRUP_NO || "Grup seçiniz"} */}
                    {customerData?.find(
                      (g) => g.GRUP_NO.toString() === addCustomForm.GRUP_NO
                    )?.GRUP_ADI || "Grup seçiniz"}
                  </Text>
                  <AntDesign
                    name="down"
                    size={16}
                    color="#999"
                    style={{
                      position: "absolute",
                      right: "5%",
                      top: "60%",
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Müşteri Grubu4</Text>

                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setDropDownType("musteriGrubu"); // açılacak dropdown tipi
                    setKanGrubuModalVisible(true); // modalı aç
                  }}
                >
                  <Text
                    style={{
                      color: addCustomForm.GRUP_NO ? "#000" : "#999",
                    }}
                  >
                    {/* {addCustomForm.GRUP_NO || "Grup seçiniz"} */}
                    {customerData?.find(
                      (g) => g.GRUP_NO.toString() === addCustomForm.GRUP_NO
                    )?.GRUP_ADI || "Grup seçiniz"}
                  </Text>
                  <AntDesign
                    name="down"
                    size={16}
                    color="#999"
                    style={{
                      position: "absolute",
                      right: "5%",
                      top: "60%",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>👤</Text>
              </View>
              <Text style={styles.title}>Müşteri Kartı</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <AntDesign
                name="close"
                size={24}
                color="#fff"
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tabBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row" }}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    activeTab === tab.id && styles.tabActive,
                    // Hatalı alan varsa tabı kırmızı yap
                    tab.id === 0 && errors.CARI_ADI
                      ? { borderBottomColor: "red", borderBottomWidth: 2 }
                      : {},
                  ]}
                  onPress={() => handleTabChange(tab.id)}
                >
                  <AntDesign
                    name={tab.icon}
                    size={22}
                    color={activeTab === tab.id ? "blue" : "gray"}
                    style={styles.tabIcon}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.id && styles.tabTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Content */}
          <ScrollView
            ref={scrollRef}
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderTabContent()}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.btnSecondary]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>✕ İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.btnPrimary]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>✓ Kaydet</Text>
            </TouchableOpacity>
          </View>

          <CustomerSelectDropDownModal
            modalVisible={kanGrubuModalVisible}
            onClose={() => setKanGrubuModalVisible(false)}
            type={dropdownType}
          />
          <AlertModal
            visible={alertModalVisible}
            message={alertMessage}
            onClose={() => setAlertModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "95%",
    // maxHeight: "90%",
    height: Dimensions.get("window").height * 0.8,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#2563eb",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 2,
    borderBottomColor: "#e2e8f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#2563eb",
    backgroundColor: "#fff",
  },
  tabIcon: {
    fontSize: 21,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#2563eb",
  },
  scrollContent: {
    // maxHeight: Dimensions.get("window").height * 0.5,
  },
  tabContent: {
    padding: 20,
  },
  field: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fieldHalf: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#0f172a",
    height: 40, // sabit yükseklik
    lineHeight: 18,
  },
  switchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  switchLabel: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  btnSecondary: {
    backgroundColor: "#64748b",
  },
  btnPrimary: {
    backgroundColor: "#2563eb",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  familyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  familyButtonText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 15,
  },
  familyDepositBox: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  musteriUyarıButon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  musteriUyarıButonText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 15,
  },
  musteriuyarıButonuBox: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryText: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 4,
    fontWeight: "600",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e42",
    shadowColor: "#f59e42",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 16,
    color: "#475569",
    fontWeight: "700",
  },
  errorText: { color: "red", marginTop: 4 },
  inputError: { borderColor: "red" }, // hata varsa kırmızı kenarlık
});
