import {Action} from "@ngrx/store";
import { EUserActionTypes } from "../model/user.model";
import { IUser } from '../../globals/interface/payload';


export class AddUserAction implements Action {
	readonly type = EUserActionTypes.ADD_USER;

	constructor(public payload: IUser) {}
};

export class DeleteUserAction implements Action {
	readonly type = EUserActionTypes.DELETE_USER;
	constructor(public payload: number) {}
}

export class UpdateUserAction implements Action {
	readonly type = EUserActionTypes.UPDATE_USER;
	constructor(public payload: IUser) {}
}

export type UserAction = AddUserAction | DeleteUserAction | UpdateUserAction;