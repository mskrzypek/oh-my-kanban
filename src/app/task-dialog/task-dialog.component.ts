import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../core/task.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TaskService } from '../core/task.service';
import { TaskStatus, TaskPriority } from '../core/task.model';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html'
})
export class TaskDialogComponent implements OnInit {

  private task: Task;
  public dialogTitle: string;
  public form: FormGroup;
  public statusChoices: typeof TaskStatus;
  public priorityChoices: typeof TaskPriority;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private taskService: TaskService
  ) {

      this.dialogTitle = data.title;
      this.task = data.task;
      this.statusChoices = TaskStatus;
      this.priorityChoices = TaskPriority;

      // https://stackoverflow.com/a/58644073/5612001
      const nonWhiteSpaceRegExp: RegExp = new RegExp('\\S');

      this.form = this.formBuilder.group({
        name: [this.task?.name, [Validators.required, Validators.pattern(nonWhiteSpaceRegExp)]],
        status: [(this.task) ? this.task.status : this.statusChoices.TODO],
        description: [this.task?.description],
        deadline: [this.task?.deadline],
        priority: [(this.task) ? this.task.priority : this.priorityChoices.MEDIUM]
      });

  }

  public ngOnInit(): void { }

  public save(): void {
    if ( ! this.form.valid) {
      return;
    }
    if (this.task) {
      // update task object with form values
      Object.assign(
        this.task,
        this.form.value
      );
      this.taskService.updateObject(this.task);
      this.snackBar.open('Zadanie zostało zaktualizowane');
    } else {
      this.taskService.createOject(this.form.value);
      this.snackBar.open('Zadanie zostało utworzone');
    }
  }

}
