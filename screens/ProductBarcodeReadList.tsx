import React from "react";

export interface Product {
  name: string;
  barcode: string;
  price: number;
  quantity: number;
}

interface ProductBarcodeReadListProps {
  products: Product[];
}

const ProductBarcodeReadList: React.FC<ProductBarcodeReadListProps> = ({
  products,
}) => {
  // Toplam fiyatı hesapla
  const totalPrice = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Okunan Ürünler</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 20,
        }}
      >
        {products.map((product, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ccc",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>{product.name}</div>
              <div style={{ fontSize: 12, color: "#555" }}>
                Barcode: {product.barcode}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div>Fiyat: ${product.price.toFixed(2)}</div>
              <div>Adet: {product.quantity}</div>
              <div style={{ fontWeight: "bold" }}>
                Toplam: ${(product.price * product.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          fontWeight: "bold",
          fontSize: 16,
          textAlign: "right",
        }}
      >
        Genel Toplam: ${totalPrice.toFixed(2)}
      </div>
    </div>
  );
};

export default ProductBarcodeReadList;
