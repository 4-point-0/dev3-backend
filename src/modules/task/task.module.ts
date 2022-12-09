import { Module } from '@nestjs/common';
import { TransactionRequestModule } from '../transaction-request/tranasction-request.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [TransactionRequestModule],
  providers: [TaskService],
  exports: [TaskService],
  controllers: [TaskController],
})
export class TasksModule {}
