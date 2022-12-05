
export interface IUser {
  id?: number;
  role: string | string[];
  displayRole: string[];
  firstname: string;
  lastname: string;
  address: string;
  mobile_number: string;
  email: string;
  password: string;
  refresh_token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Types
export interface IDates { 
  from: Date; 
  to: Date; 
}

export interface IPayment {
  accountName: string;
  accountNumber: number;
  amount: number;
  payment_type: string;
  reference: string;
  remarks: string;
}



export interface IBookingPayload {
  cottages: number[];
  dates: IDates;
  user?: IUser;
  payment: IPayment;
  other?: object;
}

export type TProps = "cottages" | "dates" | "user" | "payment" | "other";


