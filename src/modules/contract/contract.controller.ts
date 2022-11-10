import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { JwtAuthGuard } from '../auth/common/jwt-auth.guard';
import { ContractService } from './contract.service';
import { ApiPaginatedResponse } from '../../common/pagination/api-paginated-response';
import { handle } from '../../helpers/response/handle';
import { ContractDto } from './dto/contract.dto';
import { jwtConstants } from '../auth/common/jwt-constants';
import { Response } from 'express';

@ApiTags('contract')
@Controller('contract')
@ApiExtraModels(PaginatedDto)
export class ContractController {
  private readonly logger = new Logger(ContractController.name);
  constructor(private readonly contractService: ContractService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseFilters(new HttpExceptionFilter())
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'isAudited', required: false })
  @ApiPaginatedResponse(ContractDto)
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findAll(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
    @Query('isAudited') isAudited?: boolean,
  ) {
    return handle<PaginatedDto<ContractDto>>(
      await this.contractService.findAll(offset, limit, name, isAudited),
    );
  }

  @Post('update-contracts')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async updateContracts(
    @Req() request,
    @Res() res: Response,
    @Body() body: ContractDto[],
  ) {
    try {
      const bearer = request.headers['authorization'];
      if (!bearer) {
        throw new UnauthorizedException();
      }

      const token = bearer.split(' ')[1];
      if (token === jwtConstants.githubBearer) {
        await this.contractService.saveContracts(body);
        return res.status(HttpStatus.OK).send();
      }

      throw new UnauthorizedException();
    } catch (error) {
      this.logger.error('ContractController - updateContracts', error);
      throw new InternalServerErrorException();
    }
  }
}
