import {Action} from "@ngrx/store";
import { EBookActionTypes } from "../model/book.model";
import { IBook } from '../../globals/interface/book';

export class AddCottageAction implements Action {
	readonly type = EBookActionTypes.ADD_COTTAGE;

	constructor(public payload: IBook) {}
}

export class DeleteCottageAction implements Action {
	readonly type = EBookActionTypes.DELETE_COTTAGE;
	constructor(public payload: number) {}
}

export type CottageAction = AddCottageAction | DeleteCottageAction;
