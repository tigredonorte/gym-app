/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
// import { logger } from '../logger';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue() private readonly queue: Queue,
  ) {}

  async addJob(jobName: string, data: any) {
    const result = await this.queue.add(jobName, data);
    return result;
  }

  async processJob(jobName: string, callback: (job: any) => Promise<void>) {
    this.queue.process(jobName, callback);
  }
}
