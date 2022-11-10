export class GithubRepoDto {
  repository: Repository;
}

class Repository {
  defaultBranchRef: Branch;
}

class Branch {
  target: Target;
}

class Target {
  history: History;
}

class History {
  nodes: Node[];
}

class Node {
  tree: Tree;
}

class Tree {
  entries: Entry[];
}

class Entry {
  name: string;
  object: ObjectEntry;
}

class ObjectEntry {
  entries: Entry[];
}
