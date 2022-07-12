import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Prestamo } from './model/Prestamo';
import { Pageable } from '../core/model/page/Pageable';
import { PrestamoPage } from './model/PrestamoPage';

@Injectable({
    providedIn: 'root'
})
export class PrestamoService {

    constructor(
      private http: HttpClient
    ) { }

    /*getPrestamos(pageable: Pageable): Observable<PrestamoPage> {
      return this.http.post<PrestamoPage>('http://localhost:8080/prestamo', {pageable:pageable});
    }

    getPrestamos2(gameId?: number, clientId?: number): Observable<Prestamo[]> {
      return this.http.get<Prestamo[]>(this.composeFindUrl(gameId, clientId));
    }*/

    getPrestamos3(pageable: Pageable, gameId?: number, clientId?: number, fecha?: String): Observable<PrestamoPage>{
      return this.http.post<PrestamoPage>(this.composeFindUrl(gameId, clientId, fecha), {pageable:pageable});
    }

    savePrestamo(prestamo: Prestamo, gameId?: number, clientId?: number, fecha?: String): Observable<void> {
      let url = 'http://localhost:8080/prestamo';
      let params = '';


      if (prestamo.id != null) {
          url += '/'+prestamo.id;
      }
      if (gameId != null) {
        params += 'gameId='+gameId;
      }

      if (clientId != null) {
          if (params != '') params += "&";
          params += "clientId="+clientId;
      }

      if (fecha != null) {
        if (params != '') params += "&";
        params += "fecha="+fecha;
      }

      if (params == '') url = url;
      else url = url + '?'+params;

      return this.http.put<void>(url, prestamo);    
    }

    private composeFindUrl(gameId?: number, clientId?: number, fecha?: String) : string {
      let params = '';

      if (gameId != null) {
          params += 'gameId='+gameId;
      }

      if (clientId != null) {
          if (params != '') params += "&";
          params += "clientId="+clientId;
      }

      if (fecha != null) {
        if (params != '') params += "&";
        params += "fecha="+fecha;
      }

      let url = 'http://localhost:8080/prestamo'

      if (params == '') return url;
      else return url + '?'+params;
    }

    deletePrestamo(idPrestamo : number): Observable<any> {
      return this.http.delete('http://localhost:8080/prestamo/'+idPrestamo);
    }

    getAllPrestamos(): Observable<Prestamo[]> {
      return this.http.get<Prestamo[]>('http://localhost:8080/prestamo');
    }

    

}
