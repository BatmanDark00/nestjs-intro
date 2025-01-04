import { Injectable } from '@nestjs/common';
import { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  public findAll(): ITask[] {
    return this.tasks;
  }

  public findOne(id: string): ITask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  public create(CreateTaskDto: CreateTaskDto): ITask {
    const task: ITask = {
      id: randomUUID(),
      ...CreateTaskDto,
    };

    this.tasks.push(task);
    return task;
  }

  public delete(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}