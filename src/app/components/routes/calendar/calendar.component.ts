import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { Subject } from 'rxjs';
import { ErrorResponse } from 'src/app/utils';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import Method from '../../../utils/method';
import { CommonServiceService } from '../../../services/common-service.service';
import { BookService } from '../../../services/book.service';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

refresh = new Subject<void>();
events: CalendarEvent[] = [
 
  // {
  //   //an event no end date
  //   start: startOfDay(new Date()),
  //   title: 'Birthday event',
  //   color: { ...colors['yellow'] },
  //   // actions: this.actions,
  // },
  // {
  //   start: subDays(endOfMonth(new Date()), 3),
  //   end: addDays(endOfMonth(new Date()), 3),
  //   title: 'A long event that spans 2 months',
  //   color: { ...colors['blue'] },
  //   allDay: true,
  // },
  // {
  //   // A draggable and resizable event
  //   start: addHours(startOfDay(new Date()), 2),
  //   end: addHours(new Date(), 2),
  //   title: 'Wedding event',
  //   color: { ...colors['yellow'] },
  //   // actions: this.actions,
  //   resizable: {
  //     beforeStart: true,
  //     afterEnd: true,
  //   },
  //   draggable: true,
  // },
];
activeDayIsOpen: boolean = false;

constructor(
  private snackBar: SnackBarService, 
  private http_book: BookService,
  private http_common: CommonServiceService,) { }

ngOnInit(): void {
  this.getBook();
}

dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  if (isSameMonth(date, this.viewDate)) {
    if (
      (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
      events.length === 0
    ) {
      this.activeDayIsOpen = false;
    } else {
      this.activeDayIsOpen = true;
    }
    this.viewDate = date;
  }
  // this.refresh.next();
}
eventTimesChanged({
  event,
  newStart,
  newEnd,
}: CalendarEventTimesChangedEvent): void {
  this.events = this.events.map((iEvent) => {
    if (iEvent === event) {
      return {
        ...event,
        start: newStart,
        end: newEnd,
      };
    }
    return iEvent;
  });
  this.handleEvent('Dropped or resized', event);
}
handleEvent(action: string, event: CalendarEvent): void {
  // this.modalData = { event, action };
  // this.modal.open(this.modalContent, { size: 'lg' });
}

//  addEvent(): void {
//     this.events = [
//       ...this.events,
//       {
//         title: 'New event',
//         start: startOfDay(new Date()),
//         end: endOfDay(new Date()),
//         color: colors['red'],
//         draggable: true,
//         resizable: {
//           beforeStart: true,
//           afterEnd: true,
//         },
//       },
//     ];
//   }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

	closeOpenMonthViewDay() {
	  this.activeDayIsOpen = false;
  }

  async getBook(): Promise<void> {
    try {
      const response = await this.http_book.getBook();
      const data = response.data?.filter((x) => (x.status === 'approved'));

      const events: CalendarEvent[] = [];

      data?.map((x) => {

        const total_days = this.http_common.diff_minutes(
          new Date(x.selected_date_to),
          new Date(x.selected_date_from)
        );
        
        events.push({
          start: startOfDay(new Date(x.selected_date_from)),
          end: endOfDay(new Date(x.selected_date_to)),
          title: `A ${total_days} day event`,
          color: { ...colors['red'] },
          // actions: this.actions,
          allDay: true,
          resizable: {
            beforeStart: true,
            afterEnd: true, 
          },
          // draggable: true,
        })
      });


      this.events = [...events];
      
    } catch (err) {
      const error = ErrorResponse(err);
			this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
    }
  }

}
