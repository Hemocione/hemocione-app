export interface Donation {
  id: number;
  date: string;
  name: string;
  origin: string;
}

const fakeDonations = [
  {
    id: 1,
    date: "2023-06-01T00:00:00.000Z",
    name: "Semana Universitária de Doação de Sangue",
    origin: "competitions",
  },
  {
    id: 2,
    date: "2022-06-01T00:00:00.000Z",
    name: "UFRJ pela vida",
    origin: "competitions",
  },
  {
    id: 3,
    date: "2021-06-01T00:00:00.000Z",
    name: "Hemorio",
    origin: "user",
  },
  {
    id: 4,
    date: "2020-06-01T00:00:00.000Z",
    name: "Semana Universitária de Doação de Sangue",
    origin: "competitions",
  },
];

export const getDonations = async (): Promise<Donation[]> => {
  await setTimeout(() => {}, 2000);
  return fakeDonations;
};
