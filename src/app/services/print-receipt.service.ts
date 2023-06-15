import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  Content,
  Margins,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { IBookAndCottagePayload } from '../globals/interface/book';
import { ICottage, IUser } from '../globals/interface';
import { EMage } from '../globals/enums/image';
import * as moment from 'moment';
import { CommonServiceService } from './common-service.service';
import { convertNumberWithComma } from '../utils/method';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
(<any>pdfMake).fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};
@Injectable({
  providedIn: 'root',
})
export class PrintReceiptService {
  constructor(private CommonServiceService: CommonServiceService) {}

  printReceipt(
    {
      id,
      account_name,
      account_number,
      reference_number,
      selected_date_from,
      selected_date_to,
      amount,
      complete_name,
      address,
      email,
      receipt,
      cottage_number,
    }: IBookAndCottagePayload & Pick<IUser, 'address' | 'email'>,
    cottages: ICottage[]
  ) {
    let total = 0;
    const numberoFdays = this.CommonServiceService.diff_minutes(
      new Date(selected_date_to),
      new Date(selected_date_from)
    );
    const totalAmount =
      cottages &&
      cottages.length &&
      cottages.forEach((value) => {
        const product = value.price * numberoFdays;
        total += product;
      });

    const styles: StyleDictionary = {
      HEADER: {
        fontSize: 12,
      },
      TABLEHEADER: {
        fillColor: '#d2d2d4',
        bold: true,
        fontSize: 8,
        alignment: 'center',
      },
      TABLESTYLE: {
        fontSize: 8,
      },
      SUBHEADER: {
        fontSize: 8,
      },
    };

    const content: Content[] = [
      {
        alignment: 'left',
        columns: [
          {
            width: '*',
            stack: [{ image: EMage.RVS_LOGO, width: 100, height: 100 }],
          },

          {
            margin: [0, 40, 0, 0],
            width: '*',
            stack: [
              {
                text: 'RVS Resort Receipt',
                style: styles['HEADER'],
              },
              {
                text: 'Gabay 2, Poblacion Margosatubig, Zamboanga del Sur',
                style: styles['SUBHEADER'],
              },
            ],
          },
        ],
        columnGap: -360,
      },
      {
        alignment: 'left',
        columns: [
          {
            width: '*',
            style: styles['SUBHEADER'],

            stack: [
              { text: 'Name' },
              { text: (complete_name ?? '')?.toUpperCase() as string },
              '\n',
              { text: 'Email' },
              { text: email && email.toLowerCase() },
            ],
          },
          {
            width: '*',
            style: styles['SUBHEADER'],
            stack: [
              { text: 'Address' },
              { text: address && address.toUpperCase() },
              '\n',
              { text: 'Payment method' },
              { text: receipt ? 'gcash' : 'cash' },
            ],
          },
          {
            width: '*',
            style: styles['SUBHEADER'],
            stack: [
              { text: 'Receipt No.' },
              { text: String(id).padStart(5, '0') },
              '\n',
              { text: 'Receipt date' },
              { text: moment(new Date()).format('YYYY/MM/DD') },
            ],
          },

          {
            width: '*',
            style: styles['SUBHEADER'],
            stack: [
              { text: 'Start date' },
              {
                text: moment(new Date(selected_date_from)).format('YYYY/MM/DD'),
              },
              '\n',
              { text: 'End date' },
              { text: moment(new Date(selected_date_to)).format('YYYY/MM-DD') },
            ],
          },
        ],
      },
      '\n',
      {
        style: styles['TABLESTYLE'],

        table: {
          widths: [100, 100, 120, 120],
          body: [
            [
              { text: 'Cottage number', style: styles['TABLEHEADER'] },
              { text: 'Number of day/s', style: styles['TABLEHEADER'] },
              { text: 'Price per day', style: styles['TABLEHEADER'] },
              { text: 'Total', style: styles['TABLEHEADER'] },
            ],
            ...cottages.map((value) => [
              value.cottage_number,
              numberoFdays,
              convertNumberWithComma(value.price),
              convertNumberWithComma(value.price * numberoFdays),
            ]),
            [
              { text: '', border: [false] },
              { text: '', border: [false] },
              { text: 'Total amount', border: [false] },
              { text: convertNumberWithComma(total), border: [false] },
            ],
          ],
        },
        layout: {
          paddingLeft: () => 5,
          paddingRight: () => 5,
          paddingTop: () => 5,
          paddingBottom: () => 5,
        },
      },
      '\n',
      {
        text: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - ',
      },
    ];

    const pageMargins: Margins = [20, 10, 20, 20];

    const document: TDocumentDefinitions = {
      pageMargins,
      content,
      styles,
    };

    pdfMake.createPdf(document).open();
  }
}
