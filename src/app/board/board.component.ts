import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
// import { first } from 'rxjs/operators';

import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
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
  private snackBarRef: MatSnackBarRef<SimpleSnackBar>;
  // @Input() public taskTrash: Array<number>;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.lists = {};
    // this.taskTrash = [];
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

  //
  // Removing task:
  //
  // - simpler method, but task counter does not being updated:
  //
  // public removeTask(taskId: number): void {
  //   // show "deleted" info
  //   const snack = this.snackBar.open('Zadanie zostało usunięte', 'Cofnij');
  //   // put taskId to the trash
  //   this.taskTrash.push(taskId);
  //   // when snack has been removed (dismissed)
  //   snack.afterDismissed().subscribe((info) => {
  //     if (info.dismissedByAction !== true) {
  //       // if dismissed not by undo click (so it dissappeared)
  //       // then get task by id and delete it
  //       this.taskService.getObjectById(taskId).pipe(first()).subscribe(task => {
  //         this.taskService.deleteObject(task);
  //       })
  //     }
  //   });
  //   // snack action has been taken
  //   snack.onAction().subscribe(() => {
  //     // undo button clicked, so remove last task from trash
  //     this.taskTrash.pop();
  //   });
  // }
  //
  // - more complicated method, but task counter seems working:
  //
  public removeTask(task: Task): void {
    // show "deleted" info
    this.snackBarRef = this.snackBar.open('Zadanie zostało usunięte', 'Cofnij');
    // get task list key (TODO, ONGOING or DONE)
    const listKey = TaskStatus[task.status];
    // find task position on the list
    const listIndex = this.lists[listKey].findIndex((item: Task) => {
      return item.id === task.id;
    });
    // remove task from the list (not from db!)
    this.lists[listKey].splice(listIndex, 1);
    // when snack has been removed (dismissed)
    this.snackBarRef.afterDismissed().subscribe((info) => {
      if (info.dismissedByAction !== true) {
        // if dismissed not by undo click (so info dissappeared)
        // then make copy of list with possible another spliced
        // (but not yet removed) elements..
        const listContent = this.lists[listKey];
        // delete task object...
        this.taskService.deleteObject(task);
        // and restore above list
        this.lists[listKey] = listContent;
      }
    });
    // snack action has been taken
    this.snackBarRef.onAction().subscribe(() => {
      // undo button clicked, so restore task to the list (keep previous position)
      // https://stackoverflow.com/a/586189/5612001
      this.lists[listKey].splice(listIndex, 0, task);
    });
  }

  public newTaskDialog(): void {
    this.dialogOpen('Utwórz zadanie');
  }

  public editTaskDialog(task: Task): void {
    this.dialogOpen('Edytuj zadanie', task);
  }

  private dialogOpen(title: string, task: Task = null): void {
    // dismiss active snack bars (no undo anymore)
    if (this.snackBarRef !== undefined) {
      this.snackBarRef.dismiss();
    }
    // open angular material dialog
    this.dialog.open(TaskDialogComponent, {
      autoFocus: true,
      data: {
        title, task
      }
    });
  }

}
