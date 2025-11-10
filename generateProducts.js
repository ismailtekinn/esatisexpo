// generateProducts.js
import * as fs from "fs";

const totalProducts = 20000; // 20 bin ürün
const products = [];

for (let i = 1; i <= totalProducts; i++) {
  products.push({
    Index: i,
    ProductName: `Ürün ${i}`,
    Barcode: 1000000000000 + i,
    Stock: Math.floor(Math.random() * 100) + 1,
    Price: parseFloat((Math.random() * 500).toFixed(2)),
    VatRate: 10,
    Rayon: "",
    Currency: "TL",
    UrunId: 1000 + i,
    Tutar: parseFloat((Math.random() * 500).toFixed(2)),
  });
}

const finalJson = {
  products,
  documentType: "Fiş",
  timestamp: new Date().toISOString(),
};

fs.writeFileSync("assets/products_20000.json", JSON.stringify(finalJson, null, 2));
console.log("20 bin ürünlük JSON oluşturuldu: assets/products_20000.json");
