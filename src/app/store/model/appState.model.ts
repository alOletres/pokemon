import { IUser } from '../../globals/interface/payload';
import { ICottage } from '../../globals/interface/cottage';
import { IBookAndCottagePayload } from '../../globals/interface/book';
export interface AppState {
	readonly user: Array<IUser>;
	readonly cottage: Array<IBookAndCottagePayload>; 
};