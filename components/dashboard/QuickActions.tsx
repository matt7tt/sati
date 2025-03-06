import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Activity, 
  Calendar, 
  ClipboardList, 
  LineChart 
} from "lucide-react"

const actions = [
  {
    icon: Activity,
    label: "Log Vitals",
    href: "/log/vitals"
  },
  {
    icon: Calendar,
    label: "Schedule Check-in",
    href: "/schedule"
  },
  {
    icon: ClipboardList,
    label: "Health Assessment",
    href: "/assessment"
  },
  {
    icon: LineChart,
    label: "View Reports",
    href: "/reports"
  }
]

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              asChild
            >
              <a href={action.href}>
                <action.icon className="h-6 w-6" />
                {action.label}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 