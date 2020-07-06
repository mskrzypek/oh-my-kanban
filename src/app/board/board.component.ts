import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Task, TaskStatus } from '../core/task.model';
import { TaskService } from '../core/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public lists: object;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.lists = {};
  }

  public ngOnInit(): void {
    this.taskService.getObjects().subscribe((tasks: Task[]) => {
      // split task to status categories
      this.lists = {
        TODO: tasks.filter(task => task.status === TaskStatus.TODO),
        ONGOING: tasks.filter(task => task.status === TaskStatus.ONGOING),
        DONE: tasks.filter(task => task.status === TaskStatus.DONE)
      };
    });
  }

  public unsorted(): void {
    // empty function to pass as an argument to keyvalue pipe in template
  }

  public drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer !== event.container) {
      const task = event.item.data;
      task.status = TaskStatus[event.container.id];
      this.taskService.updateObject(task);
    }
  }

  public addTask(name: string, status: string): void {
    if ( ! /\S/.test(name)) {
      // do not add task if name is empty or contain white spaces only
      return;
    }
    this.taskService.createOject({
      name, status: TaskStatus[status]
    });
  }

  public removeTask(task: Task): void {
    // show "deleted" info
    const snack = this.snackBar.open('Zadanie zostało usunięte', 'Cofnij');
    // put task to the trash
    this.taskService.detachObject(task);
    // when snack has been removed (dismissed)
    snack.afterDismissed().subscribe((info) => {
      if (info.dismissedByAction !== true) {
        // if dismissed not by undo click (so it dissappeared)
        // then get task by id and delete it
        this.taskService.deleteObject(task);
      }
    });
    // snack action has been taken
    snack.onAction().subscribe(() => {
      // undo button clicked, so remove task from the trash
      this.taskService.attachObject(task);
    });
  }

  public newTaskDialog(): void {
    this.dialogOpen('Utwórz zadanie');
  }

  public editTaskDialog(task: Task): void {
    this.dialogOpen('Edytuj zadanie', task);
  }

  private dialogOpen(title: string, task: Task = null): void {
    // open angular material dialog
    this.dialog.open(TaskDialogComponent, {
      autoFocus: true,
      data: {
        title, task
      }
    });
  }

}
