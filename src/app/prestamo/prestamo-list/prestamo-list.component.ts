import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/game/model/Game';
import { Client } from 'src/app/client/model/Client';
import { ClientService } from 'src/app/client/client.service';
import { GameService } from 'src/app/game/game.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Prestamo } from '../model/Prestamo';
import { PrestamoService } from '../prestamo.service';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { Pageable } from 'src/app/core/model/page/Pageable';
import { PageEvent } from '@angular/material/paginator';
import { PrestamoEditComponent } from '../prestamo-edit/prestamo-edit.component';
import { Moment } from 'moment/moment';

@Component({
  selector: 'app-prestamo-list',
  templateUrl: './prestamo-list.component.html',
  styleUrls: ['./prestamo-list.component.scss']
})
export class PrestamoListComponent implements OnInit {

    clients : Client[];
    games: Game[];
    prestamos: Prestamo[];
    filterClient: Client;
    filterGame: Game;
    filterDate: Date;
    dataSource = new MatTableDataSource<Prestamo>();
    displayedColumns: string[] = ['id', 'game', 'client', 'fechainicio', 'fechafin', 'action'];
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;
   

  constructor(
    private prestamoService: PrestamoService,
    private clientService: ClientService,
    private gameService: GameService,
    public dialog: MatDialog,
    
  ) { }

  ngOnInit(): void {

    this.loadPage();

    this.gameService.getGames().subscribe(
      games => this.games = games
    ); 

    this.clientService.getClients().subscribe(
      clients => this.clients = clients
    );
  }

  loadPage(event?: PageEvent) {

    let pageable : Pageable =  {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sort: [{
            property: 'id',
            direction: 'ASC'
        }]
    }

    if (event != null) {
        pageable.pageSize = event.pageSize
        pageable.pageNumber = event.pageIndex;
    }
    

    this.prestamoService.getPrestamos3(pageable, null, null, "").subscribe(data => {
        this.dataSource.data = data.content;
        this.pageNumber = data.pageable.pageNumber;
        this.pageSize = data.pageable.pageSize;
        this.totalElements = data.totalElements;
    });

}  


  onCleanFilter(): void {
    this.filterGame = null;
    this.filterClient = null;
    this.filterDate = null;

    this.onSearch();
  }

  onSearch(): void {

      let pageable : Pageable =  {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sort: [{
            property: 'id',
            direction: 'ASC'
        }]
      }

      let gameId = this.filterGame != null ? this.filterGame.id : null;
      let clientId = this.filterClient != null ? this.filterClient.id : null;
      let fecha = this.filterDate != null ? this.filterDate : null;
      var fecha2 = new String();
      if(fecha != null){
        fecha2 = fecha.toISOString().split('T')[0];
      }
      else{
        fecha2 = "";
      }
      //let fecha2 = fecha.toISOString().split('T')[0];
      console.log(fecha);
      console.log(fecha2);


      this.prestamoService.getPrestamos3(pageable, gameId, clientId, fecha2).subscribe(data => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });

  }

  createPrestamo() {    
    const dialogRef = this.dialog.open(PrestamoEditComponent, {
        data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
    });    
  }  

  deletePrestamo(prestamo: Prestamo) {    
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { title: "Eliminar préstamo", description: "Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.prestamoService.deletePrestamo(prestamo.id).subscribe(result => {
          this.ngOnInit();
        }); 
      }
    });
  }  

 

}
