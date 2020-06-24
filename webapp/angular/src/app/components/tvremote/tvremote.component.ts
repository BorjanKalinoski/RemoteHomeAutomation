import { Component, OnInit } from '@angular/core';

import {
  faPowerOff,
  faVolumeMute,
  faAngleUp,
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faPlusCircle,
  faMinusCircle,
  faFastForward,
  faFastBackward,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faPause,
  faPlay,
  faStop
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tvremote',
  templateUrl: './tvremote.component.html',
  styleUrls: ['./tvremote.component.css']
})
export class TVRemoteComponent  implements OnInit {
  faPower = faPowerOff;
  faMute = faVolumeMute;
  faUp = faAngleUp;
  faDown = faAngleDown;
  faLeft = faAngleLeft;
  faRight = faAngleRight;
  faPlus = faPlusCircle;
  faMinus = faMinusCircle;
  faDoubleLeft = faAngleDoubleLeft;
  faDoubleRight = faAngleDoubleRight;
  faPause = faPause;
  faPlay = faPlay;
  faForward = faFastForward;
  faBackward = faFastBackward;
  faStop = faStop;
  deviceName: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
