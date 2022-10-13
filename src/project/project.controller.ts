import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthRequest } from 'src/user/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 200, type: Project })
  create(
    @Req() request: AuthRequest,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    createProjectDto.owner = request.user._id;
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'slug', required: false })
  @ApiResponse({ status: 200, type: [Project] })
  findAll(@Query('id') id?: string, @Query('slug') slug?: string) {
    if (id) {
      return this.projectService.findOne(id);
    }

    if (slug) {
      return this.projectService.findBySlug(slug);
    }

    return this.projectService.findAll();
  }

  @Get(':slug')
  @ApiResponse({ status: 200, type: Project })
  findOne(@Param('slug') slug: string) {
    return this.projectService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({ status: 200, type: Project })
  async update(
    @Req() request: AuthRequest,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const venue = await this.projectService.findOne(id);
    if (
      venue.owner.uid !== request.user.uid &&
      !request.user.roles.includes('admin')
    )
      throw new UnauthorizedException();
    return this.projectService.update(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({ status: 200, type: Project })
  async remove(@Req() request: AuthRequest, @Param('id') id: string) {
    const venue = await this.projectService.findOne(id);
    if (
      venue.owner.uid !== request.user.uid &&
      !request.user.roles.includes('admin')
    )
      throw new UnauthorizedException();

    return this.projectService.remove(id);
  }
}
