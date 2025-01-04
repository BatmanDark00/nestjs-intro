import { Injectable } from '@nestjs/common';
import { ITask, TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { randomUUID } from 'crypto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status-exception';

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

  public updateTask(task: ITask, updateTaskDto: UpdateTaskDto): ITask {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    Object.assign(task, updateTaskDto);
    return task;
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  public delete(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
