
export enum Modifier {
  FEATURE = 'feature',
  BUGFIX = 'bugfix',
  REFACTOR = 'refactor',
  CHORE = 'chore',
  TEST = 'test',
  CICD = 'cicd'
}

export interface GitMetadata {
  jiraId: string;
  type: Modifier;
  branchName: string;
  commitMessage: string;
  mrTitle: string;
}

export interface IssueAnalysis {
  briefSummary: string;
  howToTest: string;
}

export interface UnifiedResponse {
  git: GitMetadata;
  analysis: IssueAnalysis;
}

export interface ParseResponse {
  jiraId: string;
  type: Modifier;
  kebabDescription: string;
  shortSummary: string;
  properTitle: string;
  briefSummary: string;
  howToTest: string;
}
