import { GithubRepoDto, RepoResponseDto } from './dto/github-repo.dto';

const jsonDate = new Date().toJSON();
const owner = '4-point-0';
const repoName = 'dev3-contracts';
const variables = { owner: owner, name: repoName, until: jsonDate };

export const manifestFileName = 'manifest.json';
export const infoFileName = 'info.md';
export const githubGraphQlApi = 'https://api.github.com/graphql';
export const githubApi = `https://api.github.com/repos/${owner}/${repoName}/contents`;
export const githubRepoUrl = `https://github.com/${owner}/${repoName}/tree/main/`;

const query = `
query GetRepo($owner:String!,$name: String!,$until: GitTimestamp){
  repository(owner:$owner,name: $name) {
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 1 until:$until) {
            nodes {
              tree {
                entries {
                  name
                  object {
                    ... on Tree {
                      entries {
                        name
                        object{
                          ...on Tree{
                            entries{
                              name
                              object{
                                ...on Tree{
                                  entries{
                                    name
                                  }                                  
                                }
                              }
                            }   
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const fetchRepo = async (token: string): Promise<GithubRepoDto> => {
  const response = await fetch(githubGraphQlApi, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  const { data }: RepoResponseDto = result;
  return data;
};

export const fetchApi = async <T>(token: string, url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data as T;
};
