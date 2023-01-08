import { Injectable } from '@angular/core';
import { IReportPayload, IBook, IPayment } from '../globals/interface/book';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, Margins, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { IUser } from '../globals/interface/payload';
import * as moment from 'moment';
import { CommonServiceService } from './common-service.service';
import { total_amount, total_income } from '../utils/method';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
(<any>pdfMake).fonts  = {
	Roboto: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Medium.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-MediumItalic.ttf'
	}
}

@Injectable({
  providedIn: 'root'
})
export class PdfmakeService {

  constructor(private common: CommonServiceService) { }

  generate(payload: (IUser & IBook & IPayment)[]): void {



    const styles: StyleDictionary = {
      HEADER: {
        fontSize: 12,
        alignment: 'left',
      },
      TABLEHEADER: {
        fillColor: "#d2d2d4",
				bold: true,
				fontSize: 8,
        alignment: 'center',
      },
      TABLESTYLE: {
        fontSize: 8,
      },
    };

    const content: Content[] = [
      {text: 'RVS Resort Income Report', style: styles['HEADER']},

      {
        margin: [0, 20, 0, 0],
        style: styles['TABLESTYLE'],
        table: {
          // widths: [70, 'auto', 'auto', 70, 70, 'auto', 'auto', 'auto'],
          body: [
            [
              {text: 'Created date', style: styles['TABLEHEADER']},
              {text: 'Customer name', style: styles['TABLEHEADER']},
              {text: 'Customer type', style: styles['TABLEHEADER']},
              {text: 'Selected date from', style: styles['TABLEHEADER']},
              {text: 'Selected date to', style: styles['TABLEHEADER']},
              {text: 'Payment type', style: styles['TABLEHEADER']},
              {text: 'Number of days', style: styles['TABLEHEADER']},
              {text: 'Amount', style: styles['TABLEHEADER']},
              {text: 'Total amount', style: styles['TABLEHEADER']},
            ],
            ...payload.map((x) => [
              (moment(x.createdAt).format('MM-DD-YYYY')),
              (x.firstname.charAt(0).toUpperCase() + x.firstname.slice(1)),
              (x.role),
              (moment(x.selected_date_from).format('MM-DD-YYYY')),
              (moment(x.selected_date_to).format('MM-DD-YYYY')),
              (x.type),
              (
                total_amount(
                  new Date(x.selected_date_from),
                  new Date(x.selected_date_to)
                )[0]
              ),
              (x.amount),
              (
                total_amount(
                  new Date(x.selected_date_from),
                  new Date(x.selected_date_to),
                  x.amount
                )[1]
              ),
            ]),
            [{text: '',  colSpan: 7}, '', '', '', '', '', '', {text: 'Total Income'}, `${total_income(payload)}`]
          ]
        },
        layout: {
          paddingLeft:  () => 5,
          paddingRight: () => 5,
          paddingTop:   () => 5,
          paddingBottom:() => 5
        },
      }
    ];
    

    const pageMargins: Margins = 20;
    
    const document: TDocumentDefinitions = {
      pageMargins,
      content,
      styles,
    };
		
		pdfMake.createPdf(document).open();
    
  }
}


