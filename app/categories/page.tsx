import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
  { name: "Electronics", count: 45, color: "bg-blue-500" },
  { name: "Clothing", count: 32, color: "bg-green-500" },
  { name: "Home & Garden", count: 28, color: "bg-purple-500" },
  { name: "Sports", count: 19, color: "bg-orange-500" },
  { name: "Books", count: 15, color: "bg-red-500" },
  { name: "Beauty", count: 12, color: "bg-pink-500" },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Categories</h1>
        <p className="text-muted-foreground">Shop by category to find exactly what you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <div className={`w-4 h-4 rounded-full ${category.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{category.count} products</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
