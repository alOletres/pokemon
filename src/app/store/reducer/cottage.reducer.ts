
import { EBookActionTypes } from '../model/book.model';
import { CottageAction } from '../action/book.actions';
import { IBookAndCottagePayload } from '../../globals/interface/book';


const initialState: Array<IBookAndCottagePayload> = [];

export const CottageReducer = (
	state: Array<IBookAndCottagePayload> = initialState,
	action: CottageAction,
	) => {
		switch(action.type) {
			case EBookActionTypes.ADD_COTTAGE:
				return [...state, action.payload]; 
			case EBookActionTypes.DELETE_COTTAGE:
				return state.filter(user => user.id !== action.payload);
			// case ECottageActionTypes.UPDATE_COTTAGE:
			// 	return {
			// 		...state,
			// 		...state.map((user) => {
			// 			if(user.id === action.payload.id) {
			// 				user = action.payload
			// 			}
			// 			return user;
			// 		})
			// 	};
			default:
				return state;
		}
	};