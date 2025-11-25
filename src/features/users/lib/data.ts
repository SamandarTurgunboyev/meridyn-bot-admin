export interface User {
  id: number;
  firstName: string;
  lastName: string;
  region: string;
  isActive: boolean;
}

export const FakeUserList: User[] = [
  {
    id: 1,
    firstName: "Samandar",
    lastName: "Turgunboyev",
    region: "Toshkent",
    isActive: true,
  },
  {
    id: 2,
    firstName: "Azizbek",
    lastName: "Usmonov",
    region: "Samarqand",
    isActive: false,
  },
  {
    id: 3,
    firstName: "Ali",
    lastName: "Valiyev",
    region: "Buxoro",
    isActive: true,
  },
  {
    id: 4,
    firstName: "Laylo",
    lastName: "Karimova",
    region: "Namangan",
    isActive: false,
  },
  {
    id: 5,
    firstName: "Davron",
    lastName: "Usmonov",
    region: "Andijon",
    isActive: true,
  },
  {
    id: 6,
    firstName: "Gulbahor",
    lastName: "Rashidova",
    region: "Farg‘ona",
    isActive: true,
  },
];
