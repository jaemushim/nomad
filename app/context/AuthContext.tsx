"use client"

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth"

import { auth } from "../firebase"

const AuthContext = createContext<{
  user: User | null
  signInWithGoogle: any
  logOut: any
  getKakaoToken: (code: string) => any
  handleKakaoAuthorize: any
}>({} as any)

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null)

  // 구글
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider).then((result) => {
      console.log("result", result)
    })
  }

  // 카카오
  const [accessToken, setAccessToken] = useState()
  const getKakaoToken = async (code: string) => {
    const result = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=authorization_code&client_secret=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET}&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API}&code=${code}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id_token) {
          return data.id_token
        }
        if (data.access_token) {
          setAccessToken(data.access_token)
          window.Kakao.Auth.setAccessToken(data.access_token)
        }
      })

    return result
  }

  const handleKakaoAuthorize = () => {
    const redirectUri = `${window.location.origin}/callback/kakao`
    window.Kakao.Auth.authorize({ redirectUri })
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { Kakao } = window
      if (!Kakao.isInitialized()) {
        Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS)
      }
    }
  }, [])

  const logOut = () => {
    signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        logOut,
        getKakaoToken,
        handleKakaoAuthorize,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
