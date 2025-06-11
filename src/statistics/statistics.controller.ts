import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Auth()
  @Get('main/:storeId')
  async getMainStatistics(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.statisticsService.getMainStatistics(storeId, userId);
  }

  @Auth()
  @Get('middle/:storeId')
  async getMiddleStatistics(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.statisticsService.getMiddleStatistics(storeId, userId);
  }
}
