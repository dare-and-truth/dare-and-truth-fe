'use client';
import { deleteBadge, getBadge } from '@/app/api/badge.api';
import { Badge } from '@/app/types';
import { DialogConfirm } from '@/components/DiaLogConfirmDelete';
import { UpdateBadge } from '@/components/ModalUpdateBadge';
import { CreateBadge } from '@/components/ModelCreateBadge';
import NotFound from '@/components/NotFound';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/Search';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiTwotoneInfoCircle,
} from 'react-icons/ai';

export default function BadgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [allBadge, setAllBadges] = useState<Badge[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [badge,setBadge]=useState<Badge>({
      id: '',
      title:'',
      image: '',
      description:'',
      points: 0,
      badgeCriteria:1,
      startDay: new Date(),
      endDay: new Date(),
      isActive: true,
    });
    const [refreshBadge, setRefreshBadge] = useState<boolean>(false);
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await getBadge();
        if (data) {
          setAllBadges(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchBadges();
  }, [refreshBadge]);
  const filteredBadges = allBadge.filter((badge) =>
    badge.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredBadges.length / itemsPerPage);
  const badgeOnPage = filteredBadges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDeleteBadge = async (badgeId:string) =>{
    try {
      await deleteBadge (badgeId);
      setRefreshBadge(true);
    } catch (error) {
      console.error('Error deleting badge:', error);
    }
  }

  
  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4">
      <div className="flex justify-between">
        <span className="text-lg font-bold">Manage Badges</span>
        <CreateBadge setRefreshBadge={setRefreshBadge} />
      </div>

      <div className="mt-6 w-full space-y-4 rounded-md border bg-white p-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placehoder="Search title"
        />
        {allBadge.length === 0 ? (
          <NotFound message="No badges available." />
        ) : filteredBadges.length === 0 ? (
          <NotFound message="No users found matching the search criteria." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-black">Title</th>
                    <th className="p-4 font-medium text-black">Description</th>
                    <th className="p-4 font-medium text-black">Start date</th>
                    <th className="p-4 font-medium text-black">End date</th>
                    <th className="p-4 text-center font-medium text-black">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {badgeOnPage.map((badge) => (
                    <tr key={badge.id} className="hover:bg-gray-200">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={badge?.image} alt={badge.title} />
                            <AvatarFallback>
                              {badge.title.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{badge.title}</span>
                        </div>
                      </td>
                      <td className="max-w-xs overflow-hidden truncate whitespace-nowrap p-4 text-gray-500">
                        {badge.description}
                      </td>
                      <td className="p-4 text-gray-500">
                        {' '}
                        {badge?.startDay
                          ? new Date(badge.startDay).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="p-4 text-gray-500">
                        {badge?.endDay
                          ? new Date(badge.endDay).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center space-x-3">
                          <Button
                            variant="icon"
                            size="default"
                            onClick={() => (setOpen(true), setBadge(badge))}
                          >
                            <AiOutlineEdit className="bg-none text-blue-500 hover:text-blue-700" />
                          </Button>
                          <DialogConfirm
                            button={
                              <Button variant="icon" size="default">
                                <AiOutlineDelete className="text-red-500 hover:text-red-700" />
                              </Button>
                            }
                            title="Are you want to delete ?"
                            onConfirm={() => handleDeleteBadge(badge.id)}
                          />
                          <Button variant="icon" size="default">
                            <AiTwotoneInfoCircle className="text-gray-800 hover:text-gray-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <UpdateBadge
              open={open}
              setOpen={setOpen}
              badge={badge}
              setRefreshBadge={setRefreshBadge}
            />
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              totalEntries={filteredBadges.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
