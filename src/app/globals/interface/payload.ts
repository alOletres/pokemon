
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





