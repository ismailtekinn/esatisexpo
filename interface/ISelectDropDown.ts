export interface CustomerPickerProps {
    customers: string[]; // Müşteri listesi string dizisi olarak gelir
    selectedCustomer: string; // Seçilen müşteri string olur
    onSelectCustomer: (customer: string) => void; // Seçilen müşteri değiştiğinde çağrılır
    onAddCustomer: () => void; // Müşteri ekleme butonu için fonksiyon
  }