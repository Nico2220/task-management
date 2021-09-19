import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import axios from 'axios';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  //Ajout du construtor pour pouvoir comuniquer avec la base de donne et pour injecter des repository
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  //Interaction avec le serveur sans la base de donner
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTaskWithFilter(filterDto: GetTaskFilterDTO) {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }

  getTasks(filterDto: GetTaskFilterDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  //request vers la base de donner
  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ id, user });
    if (!found) {
      throw new NotFoundException(`Task with ${id} not found `);
    }

    return found;
  }

  // getTaskById(id: string): Task {
  //   const task = this.tasks.find((task) => task.id === id);
  //   if (!task) {
  //     throw new NotFoundException(`Task with ${id} not found `);
  //   }
  //   return task;
  // }

  async createTask(createTask: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTask, user);
  }
  // createTask(createTask: CreateTaskDTO): Task {
  //   const { title, description } = createTask;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  async deleteTask(id: string, user: User): Promise<void> {
    const deletedResult = await this.taskRepository.delete({ id, user });
    console.log(deletedResult);
    if (deletedResult.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found `);
    }
  }

  // deleteTask(id: string): string {
  //   const foundTask = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== id);
  //   return `Task with id ${id} deleted`;
  // }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  // updateTask(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   if (task) task.status = status;
  //   return task;
  // }
}
