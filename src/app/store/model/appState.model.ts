import { IUser } from '../../globals/interface/payload';
import { ICottage } from '../../globals/interface/cottage';
export interface AppState {
	readonly user: Array<IUser>;
	readonly cottage: Array<ICottage>; 
};