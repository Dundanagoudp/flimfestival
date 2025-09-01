"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditBlogPage() {
  const params = useParams()
  const blogId = params.id as string

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-6">
            Edit Blog
          </CardTitle>
          <CardDescription>
            Edit blog post: {blogId}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Edit functionality will be implemented here. Blog ID: {blogId}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
