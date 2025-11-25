export interface PillType {
  id: number;
  name: string;
  price: string;
}

export const FakePills: PillType[] = [
  { id: 1, name: "Paracetamol 500mg", price: "12000" },
  { id: 2, name: "Ibuprofen 200mg", price: "18000" },
  { id: 3, name: "Noshpa 40mg", price: "10000" },
  { id: 4, name: "Aspirin 100mg", price: "8000" },
  { id: 5, name: "Strepsils", price: "22000" },
  { id: 6, name: "Azithromycin 500mg", price: "35000" },
  { id: 7, name: "Aqualor Baby", price: "40000" },
  { id: 8, name: "Vitamin C 1000mg", price: "15000" },
  { id: 9, name: "Amoxicillin 500mg", price: "28000" },
  { id: 10, name: "Immuno Plus", price: "30000" },
];
