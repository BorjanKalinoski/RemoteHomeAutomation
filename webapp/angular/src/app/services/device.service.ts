import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as io from 'socket.io-client';

import {AC, ACState, Device, TV, TVState} from '../types';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(public  http: HttpClient) {
    this.socket = io(this.url);
  }

  devices: Device[] = [];
  fetchingDevices = true;
  private url = 'http://localhost:3000';
  private socket;
  disabledButtonsSubject = new Subject<boolean>();
  consistentInfoSubject = new Subject<boolean>();

  sendState(deviceData: AC | TV) {
    this.socket.emit('sendDeviceState', deviceData);
    this.disabledButtonsSubject.next(true);
    setTimeout(() => {
      this.disabledButtonsSubject.next(false);
    }, 2000);
    this.consistentInfoSubject.next(false);
  }

  public getDevices = (): Observable<Device[]> => {
    return new Observable((observer) => {
      this.socket.on('devices', (message: Device[]) => {
        this.devices = message;
        this.fetchingDevices = false;
        observer.next(message);
      });
    });
  };

  public getDeviceState = (deviceName: string) => {
    this.socket.emit('getDeviceState', deviceName);
    console.log('%c Requesting device state!', 'color:white; background-color:black;');
    console.log(deviceName);
    return new Observable((observer) => {
      this.socket.on(`${deviceName}Response`, (message: any) => {
        observer.next(JSON.parse(message));
        this.consistentInfoSubject.next(true);
      });
    });
  }


}

