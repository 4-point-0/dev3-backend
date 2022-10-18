import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthRequest } from 'src/user/entities/user.entity';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@ApiTags('address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Address })
  @ApiResponse({ status: 201, description: 'Address created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @HttpCode(200)
  async create(@Req() request: AuthRequest, @Body() dto: CreateAddressDto) {
    dto.owner = request.user._id;
    const result = await this.addressService.create(dto);
    if (result.data) {
      return result.data;
    }

    throw new HttpException(result.error.message, result.error.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'id', required: false })
  @ApiResponse({ status: 200, type: [Address] })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findAll(@Query('id') id?: string) {
    if (id) {
      const result = await this.addressService.findOne(id);
      if (result.data) {
        return result.data;
      }

      throw new HttpException(result.error.message, result.error.code);
    }

    const result = await this.addressService.findAll();
    if (result.data) {
      return result.data;
    }

    throw new HttpException(result.error.message, result.error.code);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Address })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async update(
    @Req() request: AuthRequest,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateAddressDto,
  ) {
    const address = await this.addressService.findOne(id);
    if (address.data) {
      if (address.data.owner.uid !== request.user.uid)
        throw new UnauthorizedException();
    } else {
      throw new HttpException(address.error.message, address.error.code);
    }

    const result = await this.addressService.update(id, updateProjectDto);

    if (result.data) {
      return result.data;
    }

    throw new HttpException(result.error.message, result.error.code);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Address })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async remove(@Req() request: AuthRequest, @Param('id') id: string) {
    const address = await this.addressService.findOne(id);
    if (address.data) {
      if (!address.data) {
        throw new NotFoundException('Address not found!');
      }

      if (address.data.owner.uid !== request.user.uid)
        throw new UnauthorizedException();
    }

    const result = await this.addressService.remove(id);

    if (result.data) {
      return result.data;
    }

    throw new HttpException(result.error.message, result.error.code);
  }
}
