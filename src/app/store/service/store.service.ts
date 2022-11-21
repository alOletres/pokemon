import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IUser } from '../../globals/interface/payload';
import { AddUserAction, DeleteUserAction, UpdateUserAction } from '../action/user.actions';
import { AddCottageAction, DeleteCottageAction } from '../action/book.actions';
import { IBook, IBookAndCottagePayload } from '../../globals/interface/book';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private store: Store) { }

  addToUser (payload: IUser) {
		this.store.dispatch(new AddUserAction(payload));
	}

	deleteUser (id: number) {
		this.store.dispatch(new DeleteUserAction(id));
	}

	updateUser (payload: IUser) {
		this.store.dispatch(new UpdateUserAction(payload));
	}

	/**
	 * cottage store config
	 */

	addToCottage (payload: IBookAndCottagePayload) {
		this.store.dispatch(new AddCottageAction(payload));
	}

	deleteCottage (payload: number) {
		this.store.dispatch(new DeleteCottageAction(payload));
	}

}
