"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import DOMPurify from "isomorphic-dompurify"
import { ArrowLeft } from "lucide-react"
import { confirmAlert } from "react-confirm-alert"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useLoginDialog } from "@/app/(layout)/login-dialog"
import { useAuth } from "@/app/context/AuthContext"
import { auth, db } from "@/app/firebase"

const page = ({ params }: { params: { id: string } }) => {
  const { setOpen } = useLoginDialog()
  const { user } = useAuth()
  const [data, setData] = useState<any>()
  useEffect(() => {
    ;(async () => {
      const q = query(
        collection(db, "posts"),
        where(documentId(), "==", params.id)
      )
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs[0].data()
      setData(data)
    })()
  }, [])

  useEffect(() => {
    if (!data) return
    ;(async () => {
      // 조회수 올리기
      await updateDoc(doc(db, "posts", params.id), {
        hit: data.hit + 1,
      })
    })()
  }, [data])

  // 코멘트 list
  const [comments, setComments] = useState<any>([])
  const getComments = async () => {
    const q = query(
      collection(db, "posts/" + params.id + "/comments"),
      orderBy("createAt", "desc")
    )
    const querySnapshot = await getDocs(q)
    let list: any[] = []
    querySnapshot.forEach((doc) => list.push(doc.data()))
    setComments(list)
  }
  useEffect(() => {
    ;(async () => {
      getComments()
    })()
  }, [])

  // 코멘트 create
  const [comment, setComment] = useState("")
  const handleCommentSubmit = async () => {
    if (!user) setOpen(true)

    if (user) {
      await addDoc(collection(db, "posts/" + params.id + "/comments"), {
        text: comment,
        userId: user?.uid,
        createAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        userName: user?.displayName,
      })
      setComment("")
      getComments()
    }
  }

  if (!data) return

  return (
    <div className="container mb-28">
      <div className="max-w-screen-lg mx-auto">
        <Link href="/">
          <ArrowLeft size={36} className="mt-6 mb-14" />
        </Link>
        <p className="mb-8 text-3xl font-bold">{data.title}</p>
        <Separator className="mb-4" />

        <div className="ql-snow min-h-[400px]">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.content),
            }}
          ></div>
        </div>
        <Label htmlFor="comment" className="block text-2xl mb-5">
          댓글
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
          }}
          placeholder="댓글을 입력하세요."
          className="resize-none"
        />
        <div className="text-right mt-5">
          <Button onClick={handleCommentSubmit}>댓글 등록</Button>
        </div>

        <div className="flex flex-col gap-5">
          {comments?.map((comment: any) => (
            <div key={comment.userId} className="border-b pb-3">
              <p className="text-lg font-medium">{comment.userName}</p>
              <p className="text-sm text-gray-600">{comment.createAt}</p>
              <p className="mt-3">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page
