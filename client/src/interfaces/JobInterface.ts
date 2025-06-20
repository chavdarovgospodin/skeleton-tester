export interface Job {
  id: number;
  description: string;
  price: number;
  paid: boolean | null;
  paymentDate: string | null;
  ContractId: number;
}
