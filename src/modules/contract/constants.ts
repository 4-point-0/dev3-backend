import { GithubRepoDto } from './dto/github-repo.dto';

const jsonDate = new Date().toJSON();
const owner = '4-point-0';
const repoName = 'dev3-contracts';

export const manifestFileName = 'manifest.json';
export const infoFileName = 'info.md';
export const githubGraphQlApi = 'https://api.github.com/graphql';
export const githubApi = `https://api.github.com/repos/${owner}/${repoName}/contents`;
export const githubRepoUrl = `https://github.com/${owner}/${repoName}/tree/main/`;

const repoQuery = `
query{
  repository(owner: "${owner}", name: "${repoName}") {
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 1 until: "${jsonDate}") {
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

export const fetchRepo = async (token: string) => {
  const response = await fetch(githubGraphQlApi, {
    method: 'POST',
    body: JSON.stringify({ repoQuery }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { data } = await response.json();
  return data as GithubRepoDto;
};

export const fetchApi = async (token: string, url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};
