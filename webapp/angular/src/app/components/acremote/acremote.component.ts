import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {
  faPowerOff,
  faSun,
  faSnowflake,
  faFan,
  faThermometerFull,
  faToggleOff,
  faToggleOn,
  faPlusSquare,
  faMinusSquare,
  faInfoCircle,
  faTint,
  faBrain,
  faBatteryQuarter,
  faBatteryHalf,
  faBatteryFull

} from '@fortawesome/free-solid-svg-icons';

import {AC, ACState, FanType, ModeType} from '../../types';
import {DeviceService} from '../../services/device.service';

@Component({
  selector: 'app-acremote',
  templateUrl: './acremote.component.html',
  styleUrls: ['./acremote.component.css']
})
export class ACRemoteComponent implements OnInit {

  constructor(private deviceService: DeviceService,
              private route: ActivatedRoute
  ) {}

  ModeType = ModeType;
  FanType = FanType;

  ac: AC = {
    deviceName: '',
    deviceType: 'AC',
    state: {
      mode: ModeType.HEAT,
      temp: 23,
      fan: FanType.MED,
      swing: false,
      power: true
    }
  };

  isConsistent = true;
  isDisabled = false;
  faPower = faPowerOff;
  faPlus = faPlusSquare;
  faMinus = faMinusSquare;
  faHeat = faSun;
  faCool = faSnowflake;
  faDry = faTint;
  faFan = faFan;
  faAuto = faBrain;
  faTemp = faThermometerFull;
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;
  faInfo = faInfoCircle;
  faLow = faBatteryQuarter;
  faMed = faBatteryHalf;
  faHigh = faBatteryFull;

  ngOnInit(): void {
    this.ac.deviceName = this.route.snapshot.paramMap.get('deviceName');

    this.deviceService.getDeviceState(this.ac.deviceName).subscribe((message: ACState) => {
      this.ac.state = message;
    });

    this.deviceService.disabledButtonsSubject.subscribe((isDisabled: boolean) => {
      this.isDisabled = isDisabled;
    });

    this.deviceService.consistentInfoSubject.subscribe((isConsistent: boolean) => {
      this.isConsistent = isConsistent;
    });
  }

  onModeChange(mode: ModeType) {
    if (mode === ModeType.DRY) {
      this.ac.state.fan = FanType.AUTO;
    } else if (mode === ModeType.FAN) {
      if (this.ac.state.fan === FanType.AUTO) {
        this.ac.state.fan = FanType.MED;
      }
    }
    this.ac.state.mode = mode;
    console.log('%c Sending new state', 'color:yellow; background-color:blue;');
    console.log(this.ac);
    console.log('%c Sent new state', 'color:yellow; background-color:blue;');
    this.deviceService.sendState(this.ac);
  }


  onFanChange(fan: FanType) {
    if (this.ac.state.mode === ModeType.DRY) {
      this.ac.state.fan = FanType.AUTO;
    } else if (this.ac.state.mode === ModeType.FAN) {
      if (fan === FanType.AUTO) { // cannot have auto mode
        this.ac.state.fan = FanType.MED;
      } else {
        this.ac.state.fan = fan;
      }
    } else {
      this.ac.state.fan = fan;
    }
    this.deviceService.sendState(this.ac);
  }

  onTempChange(temp: number) {
    if (temp >= 16 && temp <= 31) {
      this.ac.state.temp = temp;
    }
    this.deviceService.sendState(this.ac);
  }

  onPowerChange() {
    this.ac.state.power = !this.ac.state.power;
    this.deviceService.sendState(this.ac);
  }

  onSwingChange() {
    // TODO check if fan mode
    this.ac.state.swing = !this.ac.state.swing;
    this.deviceService.sendState(this.ac);
  }
}
