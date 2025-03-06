import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Text } from "@/components/ui/typography"

interface Activity {
  id: string
  type: string
  description: string
  date: string
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "measurement",
    description: "Updated blood pressure reading",
    date: "2 hours ago"
  },
  {
    id: "2",
    type: "goal",
    description: "Completed daily step goal",
    date: "5 hours ago"
  },
  {
    id: "3",
    type: "assessment",
    description: "Completed weekly health assessment",
    date: "1 day ago"
  }
]

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start justify-between">
              <div>
                <Text className="font-medium">{activity.description}</Text>
                <Text size="sm" className="text-subtext">{activity.type}</Text>
              </div>
              <Text size="sm" className="text-subtext">{activity.date}</Text>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 