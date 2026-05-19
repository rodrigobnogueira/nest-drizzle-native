import { Injectable } from '@nestjs/common';
import {
  type Project,
  type ReleaseEvent,
  ProjectsRepository,
} from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  listProjects(): Project[] {
    return this.projectsRepository.listProjects();
  }

  createProject(input: { slug: string; name: string }): Project {
    return this.projectsRepository.createProject(input);
  }

  createRelease(input: {
    projectSlug: string;
    version: string;
    notes: string;
  }): ReleaseEvent {
    return this.projectsRepository.createRelease(input);
  }

  listReleases(projectSlug: string): ReleaseEvent[] {
    return this.projectsRepository.listReleases(projectSlug);
  }
}
