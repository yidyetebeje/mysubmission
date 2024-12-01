"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

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

interface Response {
  status: number;
  result: Submission[];
}

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [verdictCounts, setVerdictCounts] = useState<{ [key: string]: number }>({});
  const [tagCounts, setTagCounts] = useState<{ [key: string]: number }>({});
  const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>({});
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const storedHandle = localStorage.getItem('codeforcesHandle');
      const storedApiKey = localStorage.getItem('codeforcesApiKey');
      const storedSecret = localStorage.getItem('codeforcesSecret');

      if (!storedHandle || !storedApiKey || !storedSecret) {
        router.push('/');
        return;
      }

      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: storedHandle,
          apiKey: storedApiKey,
          secret: storedSecret,
        }),
      });

      const data: Response = await response.json();
      setSubmissions(data.result);

      const counts: { [key: string]: number } = {};
      const tags: { [key: string]: number } = {};
      const ratings: { [key: number]: number } = {};

      data.result.forEach((submission) => {
        counts[submission.verdict] = (counts[submission.verdict] || 0) + 1;

        if (submission.verdict === 'OK') {
          submission.problem.tags.forEach((tag) => {
            tags[tag] = (tags[tag] || 0) + 1;
          });

          const rating = submission.problem.rating;
          if (rating) {
            ratings[rating] = (ratings[rating] || 0) + 1;
          }
        }
      });

      setVerdictCounts(counts);
      setTagCounts(tags);
      setRatingCounts(ratings);
    };

    fetchSubmissions();
  }, [router]);

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearchTerm = submission.problem.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? submission.problem.tags.includes(selectedTag) : true;
    const matchesRating = selectedRating ? submission.problem.rating === Number(selectedRating) : true;
    return matchesSearchTerm && matchesTag && matchesRating;
  });

  const uniqueTags = Array.from(new Set(filteredSubmissions.flatMap(submission => submission.problem.tags)));
  const uniqueRatings = Array.from(new Set(filteredSubmissions.map(submission => submission.problem.rating)));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Codeforces Submissions</h1>
     
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="flex justify-between">
          <ul>
            <li>Rating</li>
            {Object.entries(ratingCounts).map(([rating, count]) => (
              <li key={rating}>
                {rating}: {count}
              </li>
            ))}
          </ul>
          <ul>
            <li>Tag</li>
            {Object.entries(tagCounts).map(([tag, count]) => (
              <li key={tag}>
                {tag}: {count}
              </li>
            ))}
          </ul>
          <ul>
          <li>Veridict</li>
            {Object.entries(verdictCounts).map(([verdict, count]) => (
              <li key={verdict}>
                {verdict}: {count}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="submissions">
        <Input
        type="text"
        placeholder="Search by problem name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md shadow-sm w-full"
      />
      <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded-md shadow-sm w-full">
        <option value="">All Tags</option>
        {uniqueTags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
      <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded-md shadow-sm w-full">
        <option value="">All Ratings</option>
        {uniqueRatings.map(rating => (
          <option key={rating} value={rating}>{rating}</option>
        ))}
      </select>
          <ul className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <li key={submission.id} className="p-4 border border-gray-300 rounded-md shadow-sm">
                <div className="text-lg font-medium">{submission.problem.name}</div>
                <div className="text-sm text-gray-500">Status: {submission.verdict}</div>
                <div className='flex'>
                  <div>
                    <a href={`https://codeforces.com/contest/${submission.contestId}/submission/${submission.id}`} target="_blank" rel="noreferrer">
                      Contest Submission Link
                    </a>
                  </div>
                  <div>
                    <a href={`https://codeforces.com/gym/${submission.contestId}/submission/${submission.id}`} target="_blank" rel="noreferrer">
                      Gym Submission Link
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubmissionsPage;