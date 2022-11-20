import { IUser } from '../../globals/interface/payload';
import { UserAction } from '../action/user.actions';
import { EUserActionTypes } from '../model/user.model';


const initialState: Array<IUser> = [];

export const UserReducer = (
	state: Array<IUser> = initialState,
	action: UserAction,
	) => {
		switch(action.type) {
			case EUserActionTypes.ADD_USER:
				return [...state, action.payload]; 
			case EUserActionTypes.DELETE_USER:
				return state.filter(user => user.id !== action.payload);
			case EUserActionTypes.UPDATE_USER:
				return {
					...state,
					...state.map((user) => {
						if(user.id === action.payload.id) {
							user = action.payload
						}
						return user;
					})
				};
			default:
				return state;
		}
	};