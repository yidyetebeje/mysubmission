interface Problem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  points: number;
  rating: number;
  tags: string[];
}

interface Member {
  handle: string;
}

interface Author {
  contestId: number;
  members: Member[];
  participantType: string;
  ghost: boolean;
  startTimeSeconds: number;
}

interface Submission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: Problem;
  author: Author;
  programmingLanguage: string;
  verdict: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

export interface Response {
  status: number;
  result: Submission[];
}