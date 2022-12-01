import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { JwtAuthGuard } from '../auth/common/jwt-auth.guard';
import { TransactionRequestService } from './transaction-request.service';
import { TransactionRequest } from './entities/transaction-request.entity';
import { handle } from '../../helpers/response/handle';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { ApiPaginatedResponse } from '../../common/pagination/api-paginated-response';
import { TransactionRequestStatus } from '../../common/enums/transaction-request.enum';
import { AuthRequest } from '../user/entities/user.entity';
import { UpdateTransactionRequestDto } from './dto/update-transaction-request.dto';
import { TransactionRequestDto } from './dto/transaction-request.dto';

@ApiTags('transaction-request')
@Controller('transaction-request')
@ApiExtraModels(PaginatedDto)
export class TransactionRequestController {
  constructor(
    private readonly transactionRequestService: TransactionRequestService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200, type: TransactionRequest })
  @ApiResponse({ status: 201, description: 'Payment created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @HttpCode(200)
  async create(
    @Req() request: AuthRequest,
    @Body() dto: CreateTransactionRequestDto,
  ) {
    dto.owner = request.user._id;
    return handle(await this.transactionRequestService.create(dto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @ApiQuery({ name: 'project_id', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'contractId', required: false })
  @ApiQuery({ name: 'method', required: false })
  @ApiQuery({ name: 'status', enum: TransactionRequestStatus, required: false })
  @ApiPaginatedResponse(TransactionRequest)
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findAll(
    @Req() request: AuthRequest,
    @Query('project_id') project_id?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('contractId') contractId?: string,
    @Query('method') method?: string,
    @Query('status') status?: TransactionRequestStatus,
  ) {
    return handle(
      await this.transactionRequestService.findAll(
        request.user._id,
        offset,
        limit,
        project_id,
        contractId,
        method,
        status,
      ),
    );
  }

  @Get('uuid/:uuid')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200, type: TransactionRequestDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findByUuid(@Param('uuid') uuid: string) {
    return handle<TransactionRequestDto>(
      await this.transactionRequestService.findByUuid(uuid),
    );
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200, type: TransactionRequest })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findOne(@Req() request: AuthRequest, @Param('id') id: string) {
    return handle<TransactionRequest>(
      await this.transactionRequestService.findOne(
        id,
        request.user._id.toString(),
      ),
    );
  }

  @Patch(':uuid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200, type: TransactionRequestDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateTransactionRequestDto: UpdateTransactionRequestDto,
  ) {
    return handle(
      await this.transactionRequestService.update(
        uuid,
        updateTransactionRequestDto,
      ),
    );
  }
}
