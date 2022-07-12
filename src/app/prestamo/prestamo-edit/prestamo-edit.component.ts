import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrestamoService } from '../prestamo.service';
import { Prestamo } from '../model/Prestamo';
import { Game } from 'src/app/game/model/Game';
import { Client } from 'src/app/client/model/Client';
import { GameService } from 'src/app/game/game.service';
import { ClientService } from 'src/app/client/client.service';

@Component({
  selector: 'app-prestamo-edit',
  templateUrl: './prestamo-edit.component.html',
  styleUrls: ['./prestamo-edit.component.scss']
})
export class PrestamoEditComponent implements OnInit {

  prestamo : Prestamo;
  games: Game[];
  clients: Client[];

  constructor(
    public dialogRef: MatDialogRef<PrestamoEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prestamoService: PrestamoService,
    private gameService: GameService,
    private clientService: ClientService,

  ) { }

  ngOnInit(): void {
    if (this.data.prestamo != null) {
      this.prestamo = Object.assign({}, this.data.prestamo);
    }
    else {
      this.prestamo = new Prestamo();
    } 
  
    this.gameService.getGames().subscribe(
      games => {
          this.games = games;

          if (this.prestamo.game != null) {
              let gameFilter: Game[] = games.filter(game => game.id == this.data.prestamo.game.id);
              if (gameFilter != null) {
                  this.prestamo.game = gameFilter[0];
              }
          }
      }
    );

    this.clientService.getClients().subscribe(
      clients => {
          this.clients = clients;

          if (this.prestamo.client != null) {
              let clientFilter: Client[] = clients.filter(client => client.id == this.data.prestamo.client.id);
              if (clientFilter != null) {
                  this.prestamo.client = clientFilter[0];
              }
          }
      }
    );
  
  
  }



  onSave() {
    if((this.prestamo.fechafin.getTime() >= this.prestamo.fechainicio.getTime())){
      if((this.prestamo.fechafin.getTime() - this.prestamo.fechainicio.getTime()) <= 1210000000){
        this.prestamoService.savePrestamo(this.prestamo, this.prestamo.game.id, this.prestamo.client.id, this.prestamo.fechainicio.toISOString().split('T')[0]).subscribe(result => {
          this.dialogRef.close();
        });
      } 
      else{
        window.alert("El periodo máximo es de 14 días.")
      }  
    }
    else{
      window.alert("La fecha de fin no puede ser anterior a la de inicio.")
    }   
  }  

  onClose() {
    this.dialogRef.close();
  }

}
