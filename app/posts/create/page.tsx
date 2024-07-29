"use client"

import React, { useMemo, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import "./quill.snow.css"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/context/AuthContext"

import { auth, db, storage } from "../../firebase"

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill")

    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    )
  },
  {
    ssr: false,
  }
)
const formSchema = z.object({
  category: z.string().min(1, { message: "분야를 선택하여 주세요." }),
  state: z.string(),
  workType: z.string(),
  title: z.string().min(2, { message: "제목은 최소 2글자를 입력하여주세요." }),
  content: z.string().min(1, { message: "내용을 입력하여 주세요." }),
  createAt: z.string(),
  hit: z.number(),
  author: z.string(),
})

const page = () => {
  const user = useAuth()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      state: "ing",
      workType: "재택",
      title: "",
      content: "",
      createAt: "",
      hit: 0,
      author: "",
    },
  })
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const author = user?.user?.displayName
    await addDoc(collection(db, "posts"), {
      ...values,
      createAt: serverTimestamp(),
      hit: 0,
      ...(author && { author }),
    })
    await toast({
      title: "성공적으로 작성되었습니다.",
    })
    router.push("/")
  }

  const onError = (error: any) => {
    const firstError = Object.values(error)[0] as any

    if (firstError.message) {
      toast({
        title: firstError.message,
      })
    }
  }

  const quillRef = useRef<any>(null)
  const imageHandler = () => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()
    input.addEventListener("change", async () => {
      const editor = quillRef.current.getEditor()
      const file = input.files?.[0]
      const range = editor.getSelection(true)
      try {
        const storageRef = ref(storage, `image/${Date.now()}`)
        await uploadBytes(storageRef, file as any).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            editor.insertEmbed(range.index, "image", url)
            editor.setSelection(range.index + 1)
          })
        })
      } catch (error) {
        console.log(error)
      }
    })
  }

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  )

  return (
    <div className="container mt-12 mb-28">
      <div className="max-w-screen-lg mx-auto">
        <p className="text-2xl font-semibold mb-10 pb-1.5 border-b border-b-black">
          글 작성
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-8"
          >
            <div className="flex space-x-20">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-[200px]">
                    <FormLabel>분야</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="기획">기획</SelectItem>
                        <SelectItem value="디자인">디자인</SelectItem>
                        <SelectItem value="퍼블리싱">퍼블리싱</SelectItem>
                        <SelectItem value="개발">개발</SelectItem>
                        <SelectItem value="애니메이션">애니메이션</SelectItem>
                        <SelectItem value="영상편집/제작">
                          영상편집/제작
                        </SelectItem>
                        <SelectItem value="일러스트/원화">
                          일러스트/원화
                        </SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="w-[200px]">
                    <FormLabel>진행 상태</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ing">의뢰중</SelectItem>
                        <SelectItem value="end">마감</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="workType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>근무유형</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="재택" />
                        </FormControl>
                        <FormLabel className="text-sm">재택</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="주 1~2회 상주" />
                        </FormControl>
                        <FormLabel className="text-sm">주 1~2회 상주</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="상주" />
                        </FormControl>
                        <FormLabel className="text-sm">상주</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!user?.user?.displayName && (
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>작성자</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="content"
              render={({
                field: { value, onChange },
                formState: { errors },
              }) => (
                <>
                  <ReactQuill
                    forwardedRef={quillRef}
                    modules={modules}
                    theme="snow"
                    value={value}
                    onChange={onChange}
                  />
                  {errors.content && (
                    <FormMessage className="!mt-3">
                      {errors.content.message}
                    </FormMessage>
                  )}
                </>
              )}
            />

            <Button type="submit">작성</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page
