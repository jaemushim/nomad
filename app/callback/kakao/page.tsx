"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { faker } from "@faker-js/faker"
import {
  OAuthProvider,
  signInWithCredential,
  updateProfile,
} from "firebase/auth"

import { useAuth } from "@/app/context/AuthContext"
import { auth } from "@/app/firebase"

const kakao = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined }
}) => {
  const { getKakaoToken } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!searchParams?.code) return
    ;(async () => {
      const idToken = await getKakaoToken(searchParams?.code || "")
      const provider = new OAuthProvider("oidc.kakao")
      const credential = provider.credential({
        idToken: idToken,
      })

      signInWithCredential(auth, credential)
        .then((result) => {
          const credential = OAuthProvider.credentialFromResult(result)
          router.push("/")
        })
        .catch((error) => {
          // Handle error.
          console.log(error)
        })
    })()
  }, [])
  return null
}

export default kakao
