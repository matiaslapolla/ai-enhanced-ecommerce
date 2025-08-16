import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const deals = [
  {
    title: "Flash Sale - Electronics",
    discount: "Up to 50% off",
    description: "Limited time offer on selected electronics",
    timeLeft: "2 days left",
    color: "bg-red-500",
  },
  {
    title: "Summer Collection",
    discount: "30% off",
    description: "All summer clothing and accessories",
    timeLeft: "1 week left",
    color: "bg-orange-500",
  },
  {
    title: "Home Essentials",
    discount: "25% off",
    description: "Kitchen and home improvement items",
    timeLeft: "3 days left",
    color: "bg-green-500",
  },
]

export default function DealsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Special Deals</h1>
        <p className="text-muted-foreground">Don't miss out on these limited-time offers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{deal.title}</CardTitle>
                <div className={`px-2 py-1 rounded text-white text-sm ${deal.color}`}>{deal.discount}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{deal.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{deal.timeLeft}</Badge>
                <Button size="sm">Shop Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
