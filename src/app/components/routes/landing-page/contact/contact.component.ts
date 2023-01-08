import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserMasterService } from '../../../../services/user-master.service';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { CommonServiceService } from '../../../../services/common-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;

  constructor(
    private fb: FormBuilder, private http_user: UserMasterService, 
    private snackBar: SnackBarService, private common: CommonServiceService,) {
    this.contactForm = this.fb.group({
      from: [null, Validators.required],
      html: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  async sendMessage(): Promise<void> {
    try {
      const response = await this.http_user.sendMessage(this.contactForm.value);
      this.snackBar._showSnack(response.message, "success");
      this.common.reset(this.contactForm);

    } catch (err) {
      throw err;
    }
  }

}
