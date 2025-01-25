import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status-exception';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  public async findOne(@Param() Param: FindOneParams): Promise<Task> {
    return this.findOneOrFail(Param.id);
  }

  @Post()
  public create(@Body() CreateTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(CreateTaskDto);
  }

  /*  @Patch('/:id/status')
  public updateStatus(
    @Param() params: FindOneParams,
    @Body() body: UpdateTaskStatusDto,
  ): ITask {
    const task = this.findOneOrFail(params.id);
    task.status = body.status;

    return task;
  } */

  @Patch('/:id')
  public async UpdateTaskDto(
    @Param() Param: FindOneParams,
    @Body() UpdateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneOrFail(Param.id);
    try {
      return await this.tasksService.updateTask(task, UpdateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);

    await this.tasksService.deleteTask(task);
  }

  @Post(':id/labels')
  async addLabels(
    @Param() { id }: FindOneParams,
    @Body() labels: CreateTaskLabelDto[],
  ): Promise<Task> {
    const task = await this.findOneOrFail(id);
    return await this.tasksService.addLabels(task, labels);
  }

  @Delete(':id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLabels(
    @Param() { id }: FindOneParams,
    @Body() labelNames: string[],
  ): Promise<void> {
    const task = await this.findOneOrFail(id);
    await this.tasksService.removeLabels(task, labelNames);
  }

  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);

    if (task) {
      return task;
    }

    throw new NotFoundException(`Task with ID ${id} not found`);
  }
}
