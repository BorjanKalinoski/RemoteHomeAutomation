import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TVRemoteComponent } from './tvremote.component';

describe('TVRemoteComponent', () => {
  let component: TVRemoteComponent;
  let fixture: ComponentFixture<TVRemoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TVRemoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TVRemoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
