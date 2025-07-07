import { IsOptional, IsIn, IsString } from 'class-validator';
import { TaskStatus } from 'src/entities/task.entitie';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsString()
  search: string;
}