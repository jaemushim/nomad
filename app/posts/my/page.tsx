"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { CircleEllipsisIcon, Eye } from "lucide-react"
import { confirmAlert } from "react-confirm-alert"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/context/AuthContext"
import { db } from "@/app/firebase"

const page = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<any[]>([])

  const getPosts = async () => {
    const q = query(
      collection(db, "posts"),
      orderBy("createAt", "desc"),
      where("author", "==", user?.displayName)
    )

    const querySnapshot = await getDocs(q)
    let posts: any[] = []

    querySnapshot.forEach((doc) => {
      posts.push({
        ...doc.data(),
        postId: doc.id,
      })
    })
    setPosts(posts)
  }
  useEffect(() => {
    if (!user) return
    getPosts()
  }, [user])

  return (
    <div className="container mt-12 mb-28">
      <p className="text-2xl font-semibold border-b pb-1.5 mb-8">작성 목록</p>
      <div className="grid grid-cols-3 gap-3 content-start">
        {posts.map((post, index) => (
          <div
            key={`posts${index}`}
            className="rounded-[20px] h-[194px] shadow-[rgba(149,157,165,0.2)_0px_8px_24px] p-5 bg-slate-50 border"
          >
            <div className="flex justify-between">
              <p className="text-orange-400 font-semibold">{post.category}</p>
              <div className="flex">
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-500 mb-3"
                >
                  {post.state === "ing" ? "모집중" : "마감"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="pr-0 pt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-ellipsis-vertical"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-20">
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href={`/posts/update/${post.postId}`}>수정</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button
                          onClick={() => {
                            confirmAlert({
                              title: "삭제",
                              message: "정말 삭제하시겠습니까?",
                              buttons: [
                                {
                                  label: "취소",
                                },
                                {
                                  label: "확인",
                                  onClick: async () => {
                                    await deleteDoc(
                                      doc(db, "posts", post.postId)
                                    )
                                    getPosts()
                                  },
                                },
                              ],
                            })
                          }}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start !text-red-500"
                        >
                          삭제
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="h-[72px]">{post.title}</p>
            <div className="flex justify-between mt-5">
              <p>#{post.workType}</p>
              <p className="flex gap-1 text-sm">
                <Eye color="#888" size={20} />
                {post.hit ? post.hit : 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page
