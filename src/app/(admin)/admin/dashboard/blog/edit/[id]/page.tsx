"use client"

import { useParams } from "next/navigation"
import { EditBlogForm } from "@/components/admin/blogs/module/editblogs"

export default function EditBlogPage() {
  const params = useParams()
  const blogId = params.id as string

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <EditBlogForm blogId={blogId} />
    </div>
  )
}
