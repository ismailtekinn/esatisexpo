import React from "react";
import { View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import ProductBarcodeReadList, { Product } from "./ProductBarcodeReadList";

type RootStackParamList = {
  ProductBarcodeReadList: { products: Product[] };
};

type ProductBarcodeReadListRouteProp = RouteProp<
  RootStackParamList,
  "ProductBarcodeReadList"
>;

const ProductBarcodeReadListScreen = () => {
  const route = useRoute<ProductBarcodeReadListRouteProp>();
  const products = route.params?.products || [];

  return (
    <View style={{ flex: 1 }}>
      <ProductBarcodeReadList products={products} />
    </View>
  );
};

export default ProductBarcodeReadListScreen;
