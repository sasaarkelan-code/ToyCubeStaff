import { Module } from '@nestjs/common';
import { ManualsService } from './manuals.service';
import { ManualsController } from './manuals.controller';

@Module({
  providers: [ManualsService],
  controllers: [ManualsController],
})
export class ManualsModule {}
