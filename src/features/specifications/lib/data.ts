import { pharmData, type PharmType } from "@/features/pharm/lib/data";
import { FakeUserList, type User } from "@/features/users/lib/data";

export interface SpecificationsPillType {
  id: number;
  name: string;
  price: number; // numberga o‘zgartirdim
  count: number;
}

export interface SpecificationsType {
  id: number;
  medicines: SpecificationsPillType[];
  pharm: PharmType;
  client: string;
  user: User;
  percentage: number;
  totalPrice: number;
  paidPrice: number;
}

export const SpecificationsFakePills: SpecificationsPillType[] = [
  { id: 1, name: "Paracetamol 500mg", price: 12000, count: 10 },
  { id: 2, name: "Ibuprofen 200mg", price: 18000, count: 20 },
  { id: 3, name: "Noshpa 40mg", price: 10000, count: 10 },
  { id: 4, name: "Aspirin 100mg", price: 8000, count: 0 },
  { id: 5, name: "Strepsils", price: 22000, count: 0 },
  { id: 6, name: "Azithromycin 500mg", price: 35000, count: 0 },
  { id: 7, name: "Aqualor Baby", price: 40000, count: 0 },
  { id: 8, name: "Vitamin C 1000mg", price: 15000, count: 0 },
  { id: 9, name: "Amoxicillin 500mg", price: 28000, count: 0 },
  { id: 10, name: "Immuno Plus", price: 30000, count: 0 },
];

export const FakeSpecifications: SpecificationsType[] = [
  {
    id: 1,
    medicines: [
      SpecificationsFakePills[0],
      SpecificationsFakePills[2],
      SpecificationsFakePills[9],
      SpecificationsFakePills[4],
    ],
    pharm: pharmData[0],
    client: "Abdullayev Javlon",
    user: FakeUserList[0],
    percentage: 100,
    totalPrice: 98000,
    paidPrice: 98000,
  },
  {
    id: 2,
    medicines: [
      SpecificationsFakePills[1],
      SpecificationsFakePills[5],
      SpecificationsFakePills[7],
      SpecificationsFakePills[9],
    ],
    pharm: pharmData[0],
    client: "Qodirova Dilnoza",
    user: FakeUserList[1],
    percentage: 50,
    totalPrice: 62000,
    paidPrice: 31000,
  },
  {
    id: 3,
    medicines: [
      SpecificationsFakePills[0],
      SpecificationsFakePills[3],
      SpecificationsFakePills[5],
      SpecificationsFakePills[9],
    ],
    pharm: pharmData[0],
    client: "Saidov Mirjalol",
    user: FakeUserList[2],
    percentage: 20,
    totalPrice: 112000,
    paidPrice: 22400,
  },
];
