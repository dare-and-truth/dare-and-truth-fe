'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/Search';
import { User } from '@/app/types';
import { Button } from '@/components/ui/button';

const allUsers: User[] = [
  {
    id: 1,
    name: 'Talan Culhane',
    email: 'eadams@gmail.com',
    phone: '03 846 541 89',
    dateOfBirth: '10/02/2004',
    status: 'Active',
    avatar: '/placeholder.svg',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    phone: '01 234 567 89',
    dateOfBirth: '15/08/1990',
    status: 'Inactive',
    avatar: '/placeholder.svg',
  },
  {
    id: 3,
    name: 'Alice Smith',
    email: 'alice.smith@gmail.com',
    phone: '02 345 678 90',
    dateOfBirth: '22/05/1995',
    status: 'Active',
    avatar: '/placeholder.svg',
  },
  {
    id: 4,
    name: 'Robert Brown',
    email: 'robert.brown@gmail.com',
    phone: '03 456 789 01',
    dateOfBirth: '05/01/1992',
    status: 'Active',
    avatar: '/placeholder.svg',
  },
  {
    id: 5,
    name: 'Jessica Lee',
    email: 'jessica.lee@gmail.com',
    phone: '04 567 890 12',
    dateOfBirth: '12/03/1989',
    status: 'Inactive',
    avatar: '/placeholder.svg',
  },
  {
    id: 6,
    name: 'Chris Wilson',
    email: 'chris.wilson@gmail.com',
    phone: '05 678 901 23',
    dateOfBirth: '30/07/1985',
    status: 'Active',
    avatar: '/placeholder.svg',
  },
  {
    id: 7,
    name: 'James Johnson',
    email: 'james.johnson@gmail.com',
    phone: '06 789 012 34',
    dateOfBirth: '18/11/2000',
    status: 'Inactive',
    avatar: '/placeholder.svg',
  },
  {
    id: 8,
    name: 'Patricia Miller',
    email: 'patricia.miller@gmail.com',
    phone: '07 890 123 45',
    dateOfBirth: '25/06/1992',
    status: 'Active',
    avatar: '/placeholder.svg',
  },
  {
    id: 9,
    name: 'Michael Martinez',
    email: 'michael.martinez@gmail.com',
    phone: '08 901 234 56',
    dateOfBirth: '20/09/1988',
    status: 'Active',
    avatar: '/placeholder.svg',
  },
  {
    id: 10,
    name: 'Linda Davis',
    email: 'linda.davis@gmail.com',
    phone: '09 012 345 67',
    dateOfBirth: '03/04/1993',
    status: 'Inactive',
    avatar: '/placeholder.svg',
  },
];

export default function UserTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-4 font-medium text-black">Name</th>
                <th className="p-4 font-medium text-black">Email</th>
                <th className="p-4 font-medium text-black">Phone</th>
                <th className="p-4 font-medium text-black">Date of birth</th>
                <th className="p-4 font-medium text-black">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {usersOnPage.map((user) => (
                <tr key={user.id} className="hover:bg-gray-200">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4 text-gray-500">{user.phone}</td>
                  <td className="p-4 text-gray-500">{user.dateOfBirth}</td>
                  <td className="p-4">
                    <Button
                      variant="default"
                      size="default"
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                        user.status === 'Active'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      <span
                        className={`h-3.5 w-3.5 rounded-full border-2 border-white ${
                          user.status === 'Active'
                            ? 'bg-green-400'
                            : 'bg-red-400'
                        }`}
                      />
                      {user.status}
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
        />
      </div>
    </div>
  );
}
