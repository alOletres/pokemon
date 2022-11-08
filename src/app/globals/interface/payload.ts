
export interface IUserDetails {
	id: number;
	firstname: string;
	lastname: string;
	contact: string;
	role: string;
} 

export interface ICottage {
	id: number;
	cottageType: string;
	cottageNumber: string;
	capacity: string;
	cottagePrice: string;
	description: string;
	cottagePhoto: Blob;
}