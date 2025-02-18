'use client';

import { getChallenges } from '@/app/api/challenge.api';
import { Challenge } from '@/app/types';
import CreateChallengeDialog from '@/components/CreateChallengeDialog';
import { DialogConfirm } from '@/components/DiaLogConfirmDelete';
import NotFound from '@/components/NotFound';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/Search';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function ChallengePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [allChallenge, setAllChallenge] = useState<Challenge[]>([]);
  const [refreshChallenge, setRefreshChallenge] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const challenge = await getChallenges();
        if (challenge) {
          setAllChallenge(challenge);
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
      }
    };

    fetchChallenge();
  }, [refreshChallenge]);

  const filteredChallenge = allChallenge
    ? allChallenge.filter(
        (challenge) =>
          challenge.hashtag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const totalPages = Math.ceil(filteredChallenge.length / itemsPerPage);
  const challengeOnPage = filteredChallenge.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4">
      <div className="flex flex-row items-center justify-between">
        <span className="text-lg font-bold">Manage Challenge</span>
        <CreateChallengeDialog setRefreshChallenge={setRefreshChallenge} />
      </div>
      <div className="mt-6 w-full space-y-4 rounded-md border bg-white p-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placehoder="Search by content or hashtag"
        />
        {filteredChallenge.length === 0 ? (
          <NotFound message="No challenge found matching the search criteria." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-black">Hashtag</th>
                    <th className="p-4 font-medium text-black">content</th>
                    <th className="p-4 font-medium text-black">Start Date</th>
                    <th className="p-4 font-medium text-black">End Date</th>
                    <th className="p-4 font-medium text-black">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {challengeOnPage.map((challenge) => (
                    <tr key={challenge.id} className="hover:bg-gray-200">
                      <td className="p-4 text-gray-500">{challenge.hashtag}</td>
                      <td className="p-4 text-gray-500">{challenge.content}</td>
                      <td className="p-4 text-gray-500">
                        {challenge.startDate}
                      </td>
                      <td className="p-4 text-gray-500">{challenge.endDate}</td>
                      <td className="p-4">
                        <DialogConfirm
                          button={
                            <Button
                              variant="default"
                              size="default"
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                                challenge.isActive === true
                                  ? 'bg-green-50 text-green-600'
                                  : 'bg-red-50 text-red-600'
                              }`}
                            >
                              <span
                                className={`h-3.5 w-3.5 rounded-full border-2 border-white ${
                                  challenge.isActive === true
                                    ? 'bg-green-400'
                                    : 'bg-red-400'
                                }`}
                              />
                              {challenge.isActive === true
                                ? 'Active'
                                : 'Inactive'}
                            </Button>
                          }
                          title="Are you sure you want to change this challenge's status?"
                          onConfirm={() =>
                            console.log('hanlde update challenge')
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              totalEntries={filteredChallenge.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
