import Link from "next/link"
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"

import { Button } from "@/components/ui/button"

import { db } from "../firebase"
import HeroBanner from "./hero-banner"
import List from "./list"

export default async function IndexPage() {
  const q = query(
    collection(db, "posts"),
    orderBy("createAt", "desc"),
    limit(9)
  )
  const querySnapshot = await getDocs(q)
  let posts: any[] = []

  querySnapshot.forEach((doc) => {
    posts.push({
      postId: doc.id,
      ...doc.data(),
    })
  })

  return (
    <section className="container pb-10 pt-8">
      <HeroBanner />
      <div className="mt-10">
        <div className="text-right mb-6">
          <Button variant="secondary" asChild>
            <Link href="/posts/create">글 작성하기</Link>
          </Button>
        </div>
      </div>
      <List data={posts} />
    </section>
  )
}
