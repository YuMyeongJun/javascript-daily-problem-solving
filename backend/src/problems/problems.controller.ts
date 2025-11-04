import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { SubmitSolutionDto } from './dto/submit-solution.dto';
import { Problem } from './problems.service';

@Controller('api/problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get('today')
  getTodayProblem() {
    return this.problemsService.getTodayProblem();
  }

  @Get(':date')
  getProblemByDate(@Param('date') date: string): Problem | null {
    return this.problemsService.getProblemByDate(date);
  }

  @Post(':date/submit')
  submitSolution(
    @Param('date') date: string,
    @Body() submitSolutionDto: SubmitSolutionDto,
  ) {
    return this.problemsService.submitSolution(date, submitSolutionDto.code);
  }

  @Get('history')
  getHistory() {
    return this.problemsService.getHistory();
  }
}

