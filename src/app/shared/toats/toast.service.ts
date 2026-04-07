import { Injectable } from '@angular/core';
import Swal, {SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { Observable, of, from } from 'rxjs';
import { map, finalize } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  /**
   * Muestra un toast con SweetAlert2
   * @param options icono y texto a mostrar
   */
  showToast(options: { icon: 'success' | 'error' | 'warning' | 'info'; text: string }): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: options.icon,
      title: options.text
    });
  }

  /**
   * Muestra un alert modal (no toast)
   */
  showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK'
    });
  }
  confirmToast({
        icon,
        title,
        text,
        showCancelButton = true,
    }: SweetAlertOptions): Observable<SweetAlertResult> {
        return from(
            Swal.fire({
                title,
                text,
                icon,
                showCancelButton,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'SI',
                cancelButtonText: 'NO',
            })
        );
    }
}

// /* eslint-disable @typescript-eslint/no-shadow */
// import { Injectable } from '@angular/core';
// import { from, Observable } from 'rxjs';
// import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

// @Injectable({ providedIn: 'root' })
// export class ToastService {
//     constructor() {}

//     showToast({
//         icon,
//         text,
//         title = '',
//         timer = 5000,
//         position = 'top-end',
//         toast = true,
//         showConfirmButton = false,
//         timerProgressBar = true,
//     }: SweetAlertOptions): void {
//         const TOAST = Swal.mixin({
//             toast,
//             position,
//             showConfirmButton,
//             timer,
//             timerProgressBar,
//             didOpen: (toast) => {
//                 toast.addEventListener('mouseenter', Swal.stopTimer);
//                 toast.addEventListener('mouseleave', Swal.resumeTimer);
//             },
//         });

//         TOAST.fire({
//             icon,
//             title,
//             text,
//         });
//     }

//     confirmToast({
//         icon,
//         title,
//         text,
//         showCancelButton = true,
//     }: SweetAlertOptions): Observable<SweetAlertResult> {
//         return from(
//             Swal.fire({
//                 title,
//                 text,
//                 icon,
//                 showCancelButton,
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//                 confirmButtonText: 'SI',
//                 cancelButtonText: 'NO',
//             })
//         );
//     }

//     infoToast(title: string, html: string): void {
//         Swal.fire({
//             title,
//             icon: 'info',
//             html: html,
//             showCloseButton: true,
//             showCancelButton: false,
//             focusConfirm: false,
//         });
//     }
// }
