"use client"

import { Header } from "@/components/header"
import { RBACGuard } from "@/components/rbac-guard"
import { FraudDetectionSystem } from "@/components/fraud-detection-system"
import { InventoryTracker } from "@/components/inventory-tracker"
import { AITaggingSystem } from "@/components/ai-tagging-system"
import { BulkUploadTool } from "@/components/bulk-upload-tool"
import { DynamicPricingWidget } from "@/components/dynamic-pricing-widget"
import { PersonalizedEmailPreview } from "@/components/personalized-email-preview"
import { SalesDashboard } from "@/components/sales-dashboard"
import { SEOContentGenerator } from "@/components/seo-content-generator"
import { ImageOptimizationTool } from "@/components/image-optimization-tool"
import AICreativeGenerator from "@/components/ai-creative-generator"
import AutonomousPricingAgent from "@/components/autonomous-pricing-agent"
import ReturnRiskScoring from "@/components/return-risk-scoring"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  Tag,
  Upload,
  DollarSign,
  Mail,
  BarChart3,
  Search,
  ImageIcon,
  Shield,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <RBACGuard requiredPermission="manage_products">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
              <p className="text-muted-foreground">
                Complete seller toolkit with analytics, SEO optimization, and AI-powered tools
              </p>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-12">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Inventory</span>
                </TabsTrigger>
                <TabsTrigger value="tagging" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Tagging</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Bulk Upload</span>
                </TabsTrigger>
                <TabsTrigger value="pricing" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Pricing</span>
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">SEO</span>
                </TabsTrigger>
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Images</span>
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="creatives" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Creatives</span>
                </TabsTrigger>
                <TabsTrigger value="auto-pricing" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Auto Pricing</span>
                </TabsTrigger>
                <TabsTrigger value="risk-scoring" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="hidden sm:inline">Risk Scoring</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <SalesDashboard />
              </TabsContent>

              <TabsContent value="inventory">
                <InventoryTracker />
              </TabsContent>

              <TabsContent value="tagging">
                <AITaggingSystem />
              </TabsContent>

              <TabsContent value="upload">
                <BulkUploadTool />
              </TabsContent>

              <TabsContent value="pricing">
                <DynamicPricingWidget />
              </TabsContent>

              <TabsContent value="seo">
                <SEOContentGenerator />
              </TabsContent>

              <TabsContent value="images">
                <ImageOptimizationTool />
              </TabsContent>

              <TabsContent value="email">
                <PersonalizedEmailPreview />
              </TabsContent>

              <TabsContent value="security">
                <RBACGuard requiredPermission="fraud_detection">
                  <FraudDetectionSystem />
                </RBACGuard>
              </TabsContent>

              <TabsContent value="creatives">
                <AICreativeGenerator />
              </TabsContent>

              <TabsContent value="auto-pricing">
                <AutonomousPricingAgent />
              </TabsContent>

              <TabsContent value="risk-scoring">
                <ReturnRiskScoring />
              </TabsContent>
            </Tabs>
          </div>
        </RBACGuard>
      </main>
    </div>
  )
}
