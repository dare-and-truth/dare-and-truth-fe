'use client';

import { getPost } from "@/app/api/post.api";
import { Post } from "@/app/types";
import { DialogConfirm } from "@/components/DiaLogConfirmDelete";
import NotFound from "@/components/NotFound";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/Search";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function PostPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [allPost, setAllPost] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPost();
        if (post) {
          setAllPost(post);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, []);

  const filteredPost = allPost
    ? allPost.filter(
        (post) =>
          post.hashtag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const totalPages = Math.ceil(filteredPost.length / itemsPerPage);
  const postOnPage = filteredPost.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4">
      <span className="text-lg font-bold">Manage Post</span>
      <div className="mt-6 w-full space-y-4 rounded-md border bg-white p-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placehoder="Search Post name or email"
        />
        {filteredPost.length === 0 ? (
          <NotFound message="No post found matching the search criteria." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-black">Hashtag</th>
                    <th className="p-4 font-medium text-black">content</th>
                    <th className="p-4 font-medium text-black">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {postOnPage.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-200">
                      <td className="p-4 text-gray-500">{post.hashtag}</td>
                      <td className="p-4 text-gray-500">{post.content}</td>
                      <td className="p-4">
                        <DialogConfirm
                          button={
                            <Button
                              variant="default"
                              size="default"
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                                post.isActive === true
                                  ? 'bg-green-50 text-green-600'
                                  : 'bg-red-50 text-red-600'
                              }`}
                            >
                              <span
                                className={`h-3.5 w-3.5 rounded-full border-2 border-white ${
                                  post.isActive === true
                                    ? 'bg-green-400'
                                    : 'bg-red-400'
                                }`}
                              />
                              {post.isActive === true ? 'Active' : 'Inactive'}
                            </Button>
                          }
                          title="Are you sure you want to change this post's status?"
                          onConfirm={() => console.log("hanlde update post")}
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
              totalEntries={filteredPost.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
