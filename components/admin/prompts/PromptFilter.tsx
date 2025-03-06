import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PromptFilterProps {
  onFilterChange: (filters: any) => void
}

export default function PromptFilter({ onFilterChange }: PromptFilterProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search prompts..."
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>
      <div className="w-48">
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(value) => onFilterChange({ category: value })}>
          <SelectTrigger id="category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
            <SelectItem value="nutrition">Nutrition</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 