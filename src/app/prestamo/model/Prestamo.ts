import { Game } from "src/app/game/model/Game";
import { Client } from "src/app/client/model/Client";

export class Prestamo {
    id: number;
    game: Game;
    client: Client;
    fechainicio: Date;
    fechafin: Date;
}
