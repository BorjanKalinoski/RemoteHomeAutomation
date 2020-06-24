
export enum ModeType {
  HEAT, COOL, DRY, FAN, AUTO,
}
export enum FanType {
  LOW, MED, HI, AUTO,
}

export interface AC {
  deviceType: 'AC';
  deviceName: string;
  state: ACState;
}

export interface ACState {
  mode: ModeType;
  temp: number;
  fan: FanType;
  swing: boolean;
  power: boolean;
}

export interface TVState {
  hex: string;
}
export interface MailboxState {
  mail: boolean;
}

export interface TV {
  deviceType: 'TV';
  deviceName: string;
  state: {
    hex: string;
  };
}

export interface Device {
  deviceName: string;
  deviceType: 'AC' | 'MAILBOX';
}
