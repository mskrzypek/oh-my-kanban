import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public title = 'To do, or not to do';
  public today = Date.now();

  @ViewChild(BoardComponent) boardComponent: BoardComponent;

}
