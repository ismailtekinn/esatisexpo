export type AddCustomerDropDownOption = {
  id: string;
  title: string;
  icon: string;
};

export type AddCustomerDropDownProps = {
  modalVisible: boolean;
  onClose: () => void;
  type: AddCustomerDropDownType;
};

export type AddCustomerDropDownType = "kanGrubu" | "cinsiyet" | "musteriGrubu"|"dogumTarihi" |"meslek";
