export interface IBook {
	id: number;
	date_booked: Date;
	cottage: number;
	selected_date_from: Date;
	selected_date_to: Date;
	payment_type: IBookingPaymentType;
	booker: number;
	receipt: string;
	createdAt: Date;
	updateAt: Date;
}

export type IBookingPaymentType = "gcash" | "cash"