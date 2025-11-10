// utils/validations/iscontoValidate.ts

export type IscontoType = "Yüzdesel" | "Tutarsal" | "Alınacak Tutar";

export const validateIsconto = (
  type: IscontoType,
  value: number,
  maxValue: number
): string | null => {
  if (type === "Yüzdesel") {
    if (value < 0) return "Yüzdesel iskonto negatif olamaz.";
    if (value > 100) return "Yüzdesel iskonto %100'ü geçemez.";
  }

  if (type === "Tutarsal") {
    if (value < 0) return "Tutarsal iskonto negatif olamaz.";
    if (value > maxValue) return "Tutarsal iskonto ürün tutarını aşamaz.";
  }

  if (type === "Alınacak Tutar") {
    if (value <= 0) return "Alınacak tutar 0 veya negatif olamaz.";
    if (value > maxValue) return "Alınacak tutar ürün tutarını aşamaz.";
  }

  return null; // hata yok
};
