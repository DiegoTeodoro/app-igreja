import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalStorageService {
  private notaFiscal: any;

  setNotaFiscal(nota: any): void {
    this.notaFiscal = nota;
  }

  getNotaFiscal(): any {
    return this.notaFiscal;
  }
}
