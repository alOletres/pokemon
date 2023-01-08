import { HttpErrorResponse } from "@angular/common/http";

export const ErrorResponse = (err: unknown) => {
	const {error, status, statusText }:HttpErrorResponse  = err as HttpErrorResponse;
	const myError = (!error.message)? error : error.message; 
	return {myError, status, statusText };
}
