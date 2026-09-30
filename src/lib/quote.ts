/* ==========================================================================
   Money and number formatting, plus the financing maths used wherever a
   monthly payment is shown.
   ========================================================================== */

export function monthlyPayment(principal: number, apr: number, months: number) {
  if (apr === 0) return principal / months;
  const r = apr / 100 / 12;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export const usd = (n: number, decimals = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

export const num = (n: number, decimals = 0) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
