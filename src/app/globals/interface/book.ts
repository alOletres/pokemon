import { IBookPayload, ICottage } from './cottage';
import { IUser } from './payload';

export type EBookingStatuses =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'voided'
  | 'cancelled';

export interface IBook
  extends Pick<
    IDBPayment,
    'account_name' | 'account_number' | 'amount' | 'reference_number'
  > {
  id: number;
  type: string;

  date_booked: Date;
  cottage: number;
  cottages: string | number[] | ICottage[];
  selected_date_from: Date | string;
  selected_date_to: Date | string;
  payment_type: IBookingPaymentType;
  booker: number;
  receipt: string;
  createdAt: Date;
  updateAt: Date;
  isCottage: boolean;
  status: EBookingStatuses;
  payment_record: number;
  number_of_days?: number;
  firstname: string;
  lastname: string;
  complete_name?: string;
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
export type TBookingType = '"walkin"' | '"online"';

export interface IBookingPayload {
  cottages: number[] | string;
  dates: IDates;
  user?: IUser;
  payment: IPayment;
  other?: object;
}

export interface IDBPayment {
  id: number;
  payment_type: IBookingPaymentType;
  account_name: string;
  account_number: string;
  reference_number: string;
  receipt: string | string[];
  type: TBookingType;
  amount: number;
}

export type TProps =
  | 'cottages'
  | 'dates'
  | 'user'
  | 'payment'
  | 'other'
  | 'type';

export type IBookingPaymentType = 'gcash' | 'cash';

export type IBookAndCottagePayload = IBookPayload & IBook & IBookingPayload;

export type IReportPayload = IBookAndCottagePayload & IUser & IDBPayment;

export interface IBookChangesPayload extends IBook {
  cottages: ICottage[];
  books: IBook[];
}
