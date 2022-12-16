import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
  Req,
  UseFilters,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { DeployedContractService } from './deployed-contract.service';
import { DeployedContract } from './entities/deployed-contract.entity';
import { AuthRequest } from '../user/entities/user.entity';
import { CreateDeployedContractDto } from './dto/create-deployed-contract.dto';
import { handle } from '../../helpers/response/handle';
import { CommonApiResponse } from 'src/helpers/decorators/api-response-swagger.decorator';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { DeployedContractStatus } from '../../common/enums/deployed-contract-status.enum';
import { ApiPaginatedResponse } from '../../common/pagination/api-paginated-response';
import { Role } from '../../common/enums/role.enum';

@ApiTags('deployed-contract')
@Controller('deployed-contract')
@ApiExtraModels(PaginatedDto)
export class DeployedContractController {
  private readonly logger = new Logger(DeployedContractController.name);
  constructor(
    private readonly deployedContractService: DeployedContractService,
    private configService: ConfigService,
  ) {}

  @Post()
  @Auth(Role.Customer)
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200, type: DeployedContract })
  @CommonApiResponse()
  @HttpCode(200)
  async create(
    @Req() request: AuthRequest,
    @Body() dto: CreateDeployedContractDto,
  ) {
    dto.owner = request.user._id;
    return handle(await this.deployedContractService.create(dto));
  }

  @Get()
  @Auth(Role.Customer)
  @UseFilters(new HttpExceptionFilter())
  @ApiQuery({ name: 'project_id', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'alias', required: false })
  @ApiQuery({ name: 'contract_template_id', required: false })
  @ApiQuery({ name: 'status', enum: DeployedContractStatus, required: false })
  @ApiQuery({ name: 'tags', required: false })
  @ApiPaginatedResponse(DeployedContract)
  @CommonApiResponse()
  async findAll(
    @Req() request: AuthRequest,
    @Query('project_id') project_id?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('alias') alias?: string,
    @Query('contract_template_id') contract_template_id?: string,
    @Query('status') status?: DeployedContractStatus,
    @Query('tags') tags?: string[],
  ) {
    return handle(
      await this.deployedContractService.findAll(
        request.user._id,
        offset,
        limit,
        project_id,
        alias,
        contract_template_id,
        status,
        tags,
      ),
    );
  }
}
