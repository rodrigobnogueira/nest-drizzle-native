import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  listProjects() {
    return this.projectsService.listProjects();
  }

  @Post()
  createProject(@Body() body: { slug: string; name: string }) {
    return this.projectsService.createProject(body);
  }

  @Get(':slug/releases')
  listReleases(@Param('slug') slug: string) {
    return this.projectsService.listReleases(slug);
  }

  @Post(':slug/releases')
  createRelease(
    @Param('slug') slug: string,
    @Body() body: { version: string; notes: string },
  ) {
    return this.projectsService.createRelease({
      projectSlug: slug,
      version: body.version,
      notes: body.notes,
    });
  }
}
