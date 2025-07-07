import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task, TaskStatus } from 'src/entities/task.entitie';
import { User } from 'src/entities/user.entitie';
import { GetTasksFilterDto } from 'src/dto/get-tasks-filter.dto';
import { CreateTaskDto } from 'src/dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, userId: user.id } });

    if (!found) {
      throw new NotFoundException(`Tarea con ID "${id}" no encontrada`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
      userId: user.id,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Tarea con ID "${id}" no encontrada`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}