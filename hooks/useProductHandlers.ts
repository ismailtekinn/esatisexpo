// import { useCallback } from "react";

// export const useProductHandlers = (products: any[], setProducts: (p: any[]) => void, selectedProduct?: any) => {
//   const adetArttir = useCallback((index: number) => {
//     const yeniUrunler = [...products];
//     yeniUrunler[index].Stok_Quantity += 1;
//     setProducts(yeniUrunler);
//   }, [products, setProducts]);

//   const adetAzalt = useCallback((index: number) => {
//     const yeniUrunler = [...products];
//     if (yeniUrunler[index].Stok_Quantity > 1) {
//       yeniUrunler[index].Stok_Quantity -= 1;
//       setProducts(yeniUrunler);
//     }
//   }, [products, setProducts]);

//   const deleteProduct = useCallback((productId: number) => {
//     setProducts((prev) => prev.filter((item) => item.ProductID !== productId));
//     if (selectedProduct && selectedProduct.ProductID === productId) {
//       setProducts([]);
//     }
//   }, [selectedProduct, setProducts]);

//   return { adetArttir, adetAzalt, deleteProduct };
// }