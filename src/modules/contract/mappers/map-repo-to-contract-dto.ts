import { githubRepoUrl } from '../constants';
import { ManifestInfoDto } from '../dto/manifest-info.dto';

export const mapRepoToContractDto = (
  manifestInfo: ManifestInfoDto,
  creatorName: string,
  info_markdown_url: string,
) => {
  return {
    name: manifestInfo.name,
    description: manifestInfo.description,
    tags: manifestInfo.tags,
    creator_name: creatorName,
    github_url: `${githubRepoUrl}/tree/main/${manifestInfo.path}`,
    info_markdown_url: info_markdown_url,
    is_audited: false,
  };
};
