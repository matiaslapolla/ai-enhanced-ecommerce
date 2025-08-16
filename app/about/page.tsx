import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">About EcoShop</h1>
        <p className="text-muted-foreground text-lg">Your AI-powered e-commerce destination</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              EcoShop is revolutionizing online shopping with AI-native features that make discovering and purchasing
              products smarter, faster, and more personalized than ever before.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="secondary">Semantic Search</Badge>
            <Badge variant="secondary">Smart Recommendations</Badge>
            <Badge variant="secondary">Conversational Assistant</Badge>
            <Badge variant="secondary">Dynamic Pricing</Badge>
            <Badge variant="secondary">Fraud Detection</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Advanced seller tools including inventory management, AI-powered tagging, bulk upload capabilities, and
              comprehensive analytics dashboard.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security & Trust</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Enterprise-level security with role-based access control, fraud detection, and multi-currency support for
              a safe shopping experience.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
