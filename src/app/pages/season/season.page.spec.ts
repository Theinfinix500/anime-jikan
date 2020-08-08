import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeasonPage } from './season.page';

describe('SeasonPage', () => {
  let component: SeasonPage;
  let fixture: ComponentFixture<SeasonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
