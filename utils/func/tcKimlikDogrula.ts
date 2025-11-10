export const TCKimlikDogrula = (tcId: string): boolean => {
  if (tcId.length !== 11) return false;

  const digits = tcId.split("").map(Number);
  if (digits.some(isNaN)) return false;
  if (digits[0] === 0) return false; // ilk hane 0 olamaz

  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];

  const total1 = oddSum * 3 + evenSum;
  const chkDigit1 = (10 - (total1 % 10)) % 10;

  const oddSum2 = chkDigit1 + digits[1] + digits[3] + digits[5] + digits[7];
  const evenSum2 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const total2 = oddSum2 * 3 + evenSum2;
  const chkDigit2 = (10 - (total2 % 10)) % 10;

  const reconstructedTc =
    digits.slice(0, 9).join("") + chkDigit1.toString() + chkDigit2.toString();

  return reconstructedTc === tcId;
};
