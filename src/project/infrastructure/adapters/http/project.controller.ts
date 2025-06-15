import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateProjectDto } from 'src/project/application/dto/create-project.dto';
import { ProjectResponseDto } from 'src/project/application/dto/project-response.dto';
import { UpdateProjectDto } from 'src/project/application/dto/update-project.dto';
import { IProjectUseCases } from 'src/project/application/ports/project-usecases.interface';
import { INJECTION_TOKENS } from 'src/project/injection-tokens';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(
    @Inject(INJECTION_TOKENS.PROJECT_USE_CASES)
    private readonly projectUseCases: IProjectUseCases,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<void> {
    await this.projectUseCases.createProject(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: 200,
    description: 'List of all projects',
    type: [ProjectResponseDto],
  })
  async getAllProjects(): Promise<ProjectResponseDto[]> {
    return this.projectUseCases.getAllProjects();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({
    status: 200,
    description: 'Project found',
    type: ProjectResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async getProject(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectUseCases.getProject(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 204, description: 'Project updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<void> {
    await this.projectUseCases.updateProject(id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async deleteProject(@Param('id') id: string): Promise<void> {
    await this.projectUseCases.deleteProject(id);
  }
}
