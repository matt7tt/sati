import { ReactNode } from "react"
import { Heading } from "@/components/ui/typography"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
      <div>
        <Heading size="h2">{title}</Heading>
        {description && (
          <p className="mt-1 text-sm text-subtext">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
} 