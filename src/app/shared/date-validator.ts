import {
    AbstractControl,
    FormControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export class DateValidator {
    
    static lessThanToday(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const today: Date = new Date();
    if (control.value && new Date(control.value) > today) {
      return { lessThanToday: true };
    }
    return null;
  };
}

    static lessThanFechaFin(
        fechaInicio: string,
        fechaFin: string
    ): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: any } | null => {
            const fechaInicioControl = formGroup.get(fechaInicio);
            const fechaFinControl = formGroup.get(fechaFin);

            if (!fechaInicioControl || !fechaFinControl) {
                return null;
            }

            if (fechaInicioControl.value > fechaFinControl.value) {
                fechaInicioControl.setErrors({ moreThanFechaFin: true });
                return { moreThanFechaFin: true };
            } else {
                fechaInicioControl.setErrors(null);
                return null;
            }
        };
    }
}
