import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, TaskAdapter } from './task.model';
import { TASKS } from './task.data';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private trash: Set<number> = new Set([]); // trashed tasks' id; set is better for unique ids
  private _tasks: BehaviorSubject<object[]> = new BehaviorSubject([]);
  public readonly tasks: Observable<object[]> = this._tasks.asObservable();

  constructor(
    private adapter: TaskAdapter,
  ) {
    this._tasks.next(TASKS); // mock up backend with fake data (not Task objects yet!)
  }

  private compareTaskGravity(a: Task, b: Task): number {
    // if at least one of compared task deadlines is not null, compare deadline dates
    // (further date comes first), else compare priority (larger priority comes first)
    if (a.deadline !== null || b.deadline !== null) {
      // simply compare dates without converting to numbers
      // https://stackoverflow.com/a/29829370/5612001
      return -(a.deadline > b.deadline) || +(a.deadline < b.deadline);
    } else {
      return b.priority - a.priority;
    }
  }

  public getObjects(): Observable<Task[]> {
    return this.tasks.pipe(
      map((data: any[]) => data.filter(
          // do not return objects marked for delete
          (item: any) => ! this.trash.has(item.id)
        ).map(
          // convert objects to Task instances
          (item: any) => this.adapter.adapt(item)
        ).sort(this.compareTaskGravity)
      )
    );
  }

  public getObjectById(id: number): Observable<Task> {
    return this.tasks.pipe(
      map((data: any) => data.filter(
          // find object by id
          (item: any) => item.id === id
        ).map(
          // convert to Task instance
          (item: any) => this.adapter.adapt(item)
        )[0]
      )
    );
  }

  public createOject(task: any): void {
    task.id = this._tasks.getValue().length + 1; // mock Task object with fake id (we have no backend)
    this._tasks.next(this._tasks.getValue().concat(task));
  }

  public updateObject(task: Task): void {
    const tasks = this._tasks.getValue();
    const taskIndex = tasks.findIndex((t: any) => t.id === task.id);
    tasks[taskIndex] = task;
    this._tasks.next(tasks);
  }

  public deleteObject(task: Task): void {
    this._tasks.next(
      this._tasks.getValue().filter((t: any) => t.id !== task.id)
    );
  }

  public detachObject(task: Task): void {
    // add task id to trash
    this.trash.add(task.id);
    // force emit change for tasks observers
    return this._tasks.next(this._tasks.getValue());
  }

  public attachObject(task: Task): void {
    // remove task id from trash
    this.trash.delete(task.id);
    // force emit change for tasks observers
    return this._tasks.next(this._tasks.getValue());
  }

}
