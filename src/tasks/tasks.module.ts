import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Task } from 'src/entities/task.entitie';
import { TasksService } from './services/task.service';
import { TasksController } from './controllers/task.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule, 
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}