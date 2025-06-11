import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPublicacionComponent } from './form-publicacion.component';

describe('FormPublicacionComponent', () => {
  let component: FormPublicacionComponent;
  let fixture: ComponentFixture<FormPublicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPublicacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
