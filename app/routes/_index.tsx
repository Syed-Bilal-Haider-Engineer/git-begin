// app/routes/index.tsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Octokit } from "@octokit/rest";

type Issue = {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  repository_url: string;
};

export async function loader() {
  const octokit = new Octokit();
  const response = await octokit.search.issuesAndPullRequests({
    q: "is:issue is:open label:good-first-issue sort:created-desc",
    per_page: 20,
  });

  const issues = response.data.items.map((item: any) => ({
    id: item.id,
    title: item.title,
    html_url: item.html_url,
    created_at: item.created_at,
    repository_url: item.repository_url,
  }));

  return json({ issues });
}

export default function Index() {
  const { issues } = useLoaderData<{ issues: Issue[] }>();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {issues.map((issue) => (
          <li key={issue.id}>
            <a href={issue.html_url} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {issue.title}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Good First Issue
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {new URL(issue.repository_url).pathname.slice(1)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Created on{" "}
                      {new Date(issue.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}