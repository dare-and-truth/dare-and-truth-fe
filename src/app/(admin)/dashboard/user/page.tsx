'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/Search';
import { User } from '@/app/types';
import { Button } from '@/components/ui/button';
import { getUser } from '@/app/api/user.api';
import { toast } from 'react-toastify';
import NotFound from '@/components/NotFound';

export default function UserTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUser();
        if (users) {
          setAllUsers(users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = allUsers
    ? allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const usersOnPage = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4">
      <span className="text-lg font-bold">Manage Users</span>
      <div className="mt-6 w-full space-y-4 rounded-md border bg-white p-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placehoder="Search user name or email"
        />
        {filteredUsers.length === 0 ? (
          <NotFound message="No users found matching the search criteria." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-black">User name</th>
                    <th className="p-4 font-medium text-black">Email</th>
                    <th className="p-4 font-medium text-black">Phone</th>
                    <th className="p-4 font-medium text-black">
                      Date of birth
                    </th>
                    <th className="p-4 font-medium text-black">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {usersOnPage.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-200">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={user?.avatar}
                              alt={user.username}
                            />
                            <AvatarFallback>
                              {user.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500">{user.email}</td>
                      <td className="p-4 text-gray-500">{user?.phone}</td>
                      <td className="p-4 text-gray-500">{user?.dateOfBirth}</td>
                      <td className="p-4">
                        <Button
                          variant="default"
                          size="default"
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                            user.isActive === true
                              ? 'bg-green-50 text-green-600'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          <span
                            className={`h-3.5 w-3.5 rounded-full border-2 border-white ${
                              user.isActive === true
                                ? 'bg-green-400'
                                : 'bg-red-400'
                            }`}
                          />
                          {user.isActive === true ? 'Active' : 'Inactive'}
                        </Button>
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
              totalEntries={filteredUsers.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
