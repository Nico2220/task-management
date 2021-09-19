import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUSer } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDTO } from './dto/updatr-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(private tasksService: TasksService) {}

  //Interaction avec le serveur sans la base de donner
  @Get()
  getTasks(
    @Query() filterDto: GetTaskFilterDTO,
    @GetUSer() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `username is ${user.username}, filters:${JSON.stringify(filterDto)}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  //request vers la base de donnees
  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUSer() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }
  // @Get('/:id')
  // getTaskById(@Param('id') id: string) {
  //   return this.tasksService.getTaskById(id);
  // }

  //request vers la base de donnees
  @Post()
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUSer() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `user ${user.username}, data: ${JSON.stringify(createTaskDTO)}`,
    );
    return this.tasksService.createTask(createTaskDTO, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUSer() user: User) {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDTO,
    @GetUSer() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTask(id, status, user);
  }
}
