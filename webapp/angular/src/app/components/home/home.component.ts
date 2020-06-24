import { Component, OnInit } from '@angular/core';

import {Device, MailboxState} from '../../types';
import {DeviceService} from '../../services/device.service';
import {
  faEnvelope,
  faEnvelopeOpen
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private deviceService: DeviceService) {
    this.deviceService.getDevices().subscribe((message: Device[]) => {
      this.fetchingDevices = false;
      this.devices = message;
      console.log(this.devices);
    });
    // this.deviceService.getDeviceState('mailbox');
    this.deviceService.getDeviceState('mailbox').subscribe((message: MailboxState) => {
      console.log('triggered!');

      this.mailboxState = message;
      this.faMail = message.mail ? faEnvelope : faEnvelopeOpen;
    });
  }

  devices: Device[] = [];

  fetchingDevices: boolean;

  style = {
    border: '1px solid #d9d9d9',
    'border-radius': '4px'
  };

  mailboxState: MailboxState;

  faMail = this.mailboxState ? faEnvelope : faEnvelopeOpen;

  ngOnInit(): void {
    this.devices = this.deviceService.devices;
    console.log('devices');
    console.log(this.devices);
    this.fetchingDevices = this.deviceService.fetchingDevices;


  }

}
