export interface Device {
    deviceName: string;
    deviceType: 'AC' | 'TV';
}

export interface Feeds {
    name: string;
    description: string;
}

export enum ModeType {
    HEAT, COOL, DRY, FAN, AUTO,
}
export enum FanType {
    LOW, MED, HI, AUTO,
}

export enum TCLModeType {
    HEAT = 1,
    DRY = 2,
    COOL = 3,
    FAN = 7,
    AUTO = 8,
}

export enum TCLFanType {
    AUTO = 0,
    LOW = 2,
    MED = 3,
    HI = 5,
}

export const TCL_MIN_TEMP = 16;
export const TCL_MAX_TEMP = 31;

export enum TCLSwingType {
    OFF,
    ON = 7,
}

export interface AC {
    deviceType: 'AC';
    deviceName: string;
    state: {
        mode: ModeType;
        temp: number;
        fan: FanType;
        swing: boolean;
        power: boolean;
    };
}

export interface ACState {
    mode: ModeType;
    temp: number;
    fan: FanType;
    swing: boolean;
    power: boolean;
}
export interface MailboxState {
    mail: boolean;
}
export interface TVState {
    hex: string;
}

export interface TV {
    deviceType: 'TV';
    deviceName: string;
    state: {
        hex: string;
    };
}
