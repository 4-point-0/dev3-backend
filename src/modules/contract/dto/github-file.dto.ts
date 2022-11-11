export class GithubFileDto {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: any;
  encoding: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}
