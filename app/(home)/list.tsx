"use client"

import React, { Fragment, useState } from "react"
import Link from "next/link"
import { useInfiniteQuery } from "@tanstack/react-query"
import {
  DocumentData,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore"
import { Eye } from "lucide-react"
import { useBottomScrollListener } from "react-bottom-scroll-listener"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import { auth, db } from "../firebase"

const List = ({ data: initialData }: any) => {
  const getPosts = async (pageParam: number) => {
    let posts: DocumentData[] = []
    let finalQuery = query(collection(db, "posts"), orderBy("createAt", "desc"))
    if (pageParam) {
      finalQuery = query(finalQuery, startAfter(pageParam), limit(9))
    } else {
      finalQuery = query(finalQuery, limit(9))
    }

    const querySnapshot = await getDocs(finalQuery)
    querySnapshot.forEach((doc) => {
      posts.push(doc.data())
    })
    return querySnapshot
  }

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => {
      return getPosts(pageParam)
    },
    getNextPageParam: (querySnapshot: DocumentData) => {
      if (querySnapshot.docs.length < 9) {
        return null
      } else {
        return querySnapshot.docs[querySnapshot.docs.length - 1]
      }
    },
    initialPageParam: null,
  })

  useBottomScrollListener(() => {
    fetchNextPage()
  })
  return (
    <div className="grid grid-cols-3 gap-3 content-start">
      {data
        ? data?.pages.map((page, index) => (
            <Fragment key={index}>
              {page
                ? (() => {
                    let posts: any[] = []

                    page.forEach((doc) => {
                      posts.push({ ...doc.data(), postId: doc.id })
                    })
                    return posts.map((post, index) => (
                      <Link
                        href={`/posts/${post.postId}`}
                        key={`zzz${index}`}
                        className="rounded-[20px] h-[194px] shadow-[rgba(149,157,165,0.2)_0px_8px_24px] p-5 bg-slate-50 border"
                      >
                        <div className="flex justify-between">
                          <p className="text-orange-400 font-semibold">
                            {post.category}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "mb-3",
                              post.state === "ing"
                                ? "border-green-500 text-green-500"
                                : "border-gray-500 text-gray-500"
                            )}
                          >
                            {post.state === "ing" ? "모집중" : "마감"}
                          </Badge>
                        </div>
                        <p className="h-[72px]">{post.title}</p>
                        <div className="flex justify-between mt-5">
                          <p>#{post.workType}</p>
                          <p className="flex gap-1 text-sm">
                            <Eye color="#888" size={20} />
                            {post.hit ? post.hit : 0}
                          </p>
                        </div>
                      </Link>
                    ))
                  })()
                : "데이터가 없습니다."}
            </Fragment>
          ))
        : initialData?.map((post: any, index: number) => (
            <Link
              href={`/posts/${post.postId}`}
              key={`zzz${index}`}
              className="rounded-[20px] h-[194px] shadow-[rgba(149,157,165,0.1)_0px_8px_24px] p-5 bg-slate-50 border"
            >
              <div className="flex justify-between">
                <p className="text-orange-400 font-semibold">{post.category}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "mb-3",
                    post.state === "ing"
                      ? "border-green-500 text-green-500"
                      : "border-gray-500 text-gray-500"
                  )}
                >
                  {post.state === "ing" ? "모집중" : "마감"}
                </Badge>
              </div>
              <p className="h-[72px]">{post.title}</p>
              <div className="flex justify-between mt-5">
                <p>#{post.workType}</p>
                <p className="flex gap-1 text-sm">
                  <Eye color="#888" size={20} />
                  {post.hit ? post.hit : 0}
                </p>
              </div>
            </Link>
          ))}
    </div>
  )
}

export default List
