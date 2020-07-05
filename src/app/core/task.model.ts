import { Injectable } from '@angular/core';
import { Adapter } from './adapters';

export enum TaskStatus {
  TODO = 0,
  ONGOING = 1,
  DONE = 2
}

export enum TaskPriority {
  LOW = -1,
  MEDIUM = 0,
  HIGH = 1
}

export class Task {
    constructor(
        public id: number,
        public name: string,
        public status: number = TaskStatus.TODO,
        public description: string = null,
        public deadline: Date = null,
        public priority: number = TaskPriority.MEDIUM
    ) { }
}

@Injectable({
    providedIn: 'root'
})
export class TaskAdapter implements Adapter<Task> {

  adapt(item: any): Task {
    const adapted = new Task(
      Number(item.id),
      item.name,
      (item.status) ? Number(item.status) : undefined,
      item.description,
      (item.deadline) ? new Date(item.deadline) : undefined,
      (item.priority) ? Number(item.priority) : undefined
    );
    // console.log('Task-adapted object:', adapted);
    return adapted;
  }

}
