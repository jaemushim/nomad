import { useState } from "react"
import Image from "next/image"
import { create } from "zustand"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useAuth } from "../context/AuthContext"

type LoginDialogStore = {
  open: boolean
  setOpen: (state: boolean) => void
}

export const useLoginDialog = create<LoginDialogStore>((set) => ({
  open: false,
  setOpen: (state) => set(() => ({ open: state })),
}))

const LoginDialog = () => {
  const { open, setOpen } = useLoginDialog()
  const { signInWithGoogle, handleKakaoAuthorize } = useAuth()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">로그인</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>NOMAD에 오신 것을 환영합니다!</DialogTitle>
          <DialogDescription className="mt-8">
            NOMAD에서 성공적인 IT 프로젝트를 경험하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2"></div>
        </div>
        <DialogFooter className="flex sm:flex-col sm:space-x-0 gap-2">
          <Button
            onClick={() => {
              signInWithGoogle()
              setOpen(false)
            }}
            variant="default"
            size="lg"
            className="w-full gap-2 bg-[#e6e6e6] text-black"
          >
            <Image src="/google.png" width={28} height={28} alt=""></Image>
            Google 로그인
          </Button>
          <Button
            onClick={handleKakaoAuthorize}
            size="lg"
            variant="default"
            className="w-full gap-2 bg-[#ffeb3b] text-black"
          >
            <Image src="/kakao.png" width={28} height={28} alt=""></Image>
            Kakao 로그인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
