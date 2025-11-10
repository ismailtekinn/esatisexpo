import React from "react";
import { AlertProvider, useAlert } from "../contex/AlertContext";
import AlertModal from "../component/AlertModal";
import { SelectedCustomerProvider } from "../contex/selectedCustomerContex";
import { AddCustomerFormProvider } from "../contex/customer/addCustomerFormContext";
import { KullaniciProvider } from "../contex/kullaniciContext";
import { AutoLoginProvider } from "../contex/settings/autoLoginContext";
import { MenuProccesProvider } from "../contex/salesscreen/MenuProccesContext";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AlertProvider>
      <MenuProccesProvider>
        <KullaniciProvider>
          <AutoLoginProvider>
            <AddCustomerFormProvider>
              <SelectedCustomerProvider>
                <AppInner>{children}</AppInner>
              </SelectedCustomerProvider>
            </AddCustomerFormProvider>
          </AutoLoginProvider>
        </KullaniciProvider>
      </MenuProccesProvider>
    </AlertProvider>
  );
};

const AppInner = ({ children }: { children: React.ReactNode }) => {
  const { alertModalVisible, alertMessage, setAlertModalVisible } = useAlert();

  return (
    <>
      {children}

      {/* Tek bir yerde modal */}
      <AlertModal
        visible={alertModalVisible}
        message={alertMessage}
        onClose={() => setAlertModalVisible(false)}
      />
    </>
  );
};
