import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
  Req,
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
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { ApiPaginatedResponse } from '../../common/pagination/api-paginated-response';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { handle } from '../../helpers/response/handle';
import { JwtAuthGuard } from '../auth/common/jwt-auth.guard';
import { jwtConstants } from '../auth/common/jwt-constants';
import { AuthRequest } from '../user/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentDto } from './dto/payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { Project } from '../project/entities/project.entity';

@ApiTags('payment')
@Controller('payment')
@ApiExtraModels(PaginatedDto)
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200, type: Payment })
  @ApiResponse({ status: 201, description: 'Payment created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @HttpCode(200)
  async create(@Req() request: AuthRequest, @Body() dto: CreatePaymentDto) {
    dto.owner = request.user._id;
    return handle(await this.paymentService.create(dto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'uid', required: false })
  @ApiQuery({ name: 'receiver', required: false })
  @ApiQuery({ name: 'receiver_fungible', required: false })
  @ApiQuery({ name: 'status', enum: PaymentStatus, required: false })
  @ApiPaginatedResponse(Payment)
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findAll(
    @Req() request: AuthRequest,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('uid') uid?: string,
    @Query('receiver') receiver?: string,
    @Query('receiver_fungible') receiver_fungible?: string,
    @Query('status') status?: PaymentStatus,
  ) {
    return handle(
      await this.paymentService.findAll(
        request.user._id,
        offset,
        limit,
        uid,
        receiver,
        receiver_fungible,
        status,
      ),
    );
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200, type: PaymentDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findById(@Param('id') id: string) {
    return handle<PaymentDto>(await this.paymentService.findOne(id));
  }

  @Get('uid/:uid')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200, type: PaymentDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findByUid(@Param('uid') uid: string) {
    return handle<PaymentDto>(await this.paymentService.findByUid(uid));
  }

  @Post('ft-transfer-pagoda')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200, type: PaymentDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async pagodaEvent(@Req() request) {
    try {
      const bearer = request.headers['authorization'];
      if (!bearer) return new UnauthorizedException();

      const token = bearer.split(' ')[1];

      if (token === jwtConstants.pagodaBearer) {
        return handle(
          await this.paymentService.updatePagoda(request.body as any),
        );
      }

      return new UnauthorizedException();
    } catch (error) {
      this.logger.error('PaymentController - pagodaEvent', error);
      return new InternalServerErrorException();
    }
  }
}
