import {
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { handle } from '../../helpers/response/handle';
import { imageFilter } from '../../helpers/file/image-filter';
import { JwtAuthGuard } from '../auth/common/jwt-auth.guard';
import { FileUploadDto } from '../project/dto/upload-file.dto';
import { FileService } from './file.service';
import { File } from './entities/file.entity';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file',
    type: FileUploadDto,
  })
  @ApiResponse({ status: 200, type: File })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 422, description: 'Not valid file type' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return handle(
      await this.fileService.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
      ),
    );
  }

  @Patch(':url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file',
    type: FileUploadDto,
  })
  @ApiResponse({ status: 200, type: File })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 422, description: 'Not valid file type' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async updateFile(
    @Param('url') url: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return handle(await this.fileService.putFile(url, file.buffer));
  }
}
