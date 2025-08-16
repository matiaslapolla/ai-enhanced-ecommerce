"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, ImageIcon, Sparkles, Check, AlertCircle } from "lucide-react"

interface BulkProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  tags: string[]
  image?: File
  status: "pending" | "processing" | "completed" | "error"
  aiGenerated?: {
    description?: string
    tags?: string[]
    category?: string
  }
}

// Mock AI processing functions
const generateProductDescription = (name: string, category: string): string => {
  const templates = {
    Electronics: `Experience premium quality with the ${name}. This cutting-edge device combines innovative technology with sleek design, perfect for modern lifestyles.`,
    Fashion: `Discover style and comfort with the ${name}. Crafted with attention to detail, this piece elevates your wardrobe with timeless elegance.`,
    Sports: `Enhance your performance with the ${name}. Designed for athletes and fitness enthusiasts, this equipment delivers exceptional results.`,
    "Home & Garden": `Transform your living space with the ${name}. This essential item brings functionality and style to your home.`,
  }
  return templates[category as keyof typeof templates] || `Discover the amazing ${name}, perfect for your needs.`
}

const extractImageMetadata = (file: File): Promise<{ tags: string[]; category: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock OCR/metadata extraction
      const mockResults = {
        tags: ["premium", "quality", "modern"],
        category: "Electronics",
      }
      resolve(mockResults)
    }, 1000)
  })
}

export function BulkUploadTool() {
  const [products, setProducts] = useState<BulkProduct[]>([])
  const [csvData, setCsvData] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCsvData = (csv: string): BulkProduct[] => {
    const lines = csv.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())

    return lines.slice(1).map((line, index) => {
      const values = line.split(",").map((v) => v.trim())
      const product: BulkProduct = {
        id: `bulk-${index}`,
        name: values[headers.indexOf("name")] || "",
        description: values[headers.indexOf("description")] || "",
        price: Number.parseFloat(values[headers.indexOf("price")]) || 0,
        category: values[headers.indexOf("category")] || "Electronics",
        tags: values[headers.indexOf("tags")]?.split(";").map((t) => t.trim()) || [],
        status: "pending",
      }
      return product
    })
  }

  const processCsvUpload = async () => {
    if (!csvData.trim()) return

    setIsProcessing(true)
    setUploadProgress(0)

    const parsedProducts = parseCsvData(csvData)
    setProducts(parsedProducts)

    // Process each product with AI enhancement
    for (let i = 0; i < parsedProducts.length; i++) {
      const product = parsedProducts[i]

      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, status: "processing" } : p)))

      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiGenerated = {
        description: product.description || generateProductDescription(product.name, product.category),
        tags: [...product.tags, "ai-enhanced", "bulk-imported"],
        category: product.category,
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, status: "completed", aiGenerated, description: aiGenerated.description, tags: aiGenerated.tags }
            : p,
        ),
      )

      setUploadProgress(((i + 1) / parsedProducts.length) * 100)
    }

    setIsProcessing(false)
  }

  const handleImageUpload = async (productId: string, file: File) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, image: file, status: "processing" } : p)))

    try {
      const metadata = await extractImageMetadata(file)

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                status: "completed",
                aiGenerated: {
                  ...p.aiGenerated,
                  tags: [...(p.aiGenerated?.tags || p.tags), ...metadata.tags],
                  category: metadata.category,
                },
              }
            : p,
        ),
      )
    } catch (error) {
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, status: "error" } : p)))
    }
  }

  const sampleCsvData = `name,description,price,category,tags
Wireless Mouse,Ergonomic wireless mouse,29.99,Electronics,wireless;ergonomic
Blue Jeans,,49.99,Fashion,denim;casual
Yoga Block,Support block for yoga,12.99,Sports,yoga;fitness;support`

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            AI-Powered Bulk Product Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CSV Upload Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">CSV Data</label>
              <Textarea
                placeholder={`Paste your CSV data here or use this sample format:\n\n${sampleCsvData}`}
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={processCsvUpload} disabled={isProcessing || !csvData.trim()}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Process CSV
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={() => setCsvData(sampleCsvData)}>
                Load Sample Data
              </Button>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing products...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>

          {/* Products Preview */}
          {products.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Product Preview & AI Enhancement</h3>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        {product.status === "pending" && <Badge variant="secondary">Pending</Badge>}
                        {product.status === "processing" && (
                          <Badge variant="secondary">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1" />
                            Processing
                          </Badge>
                        )}
                        {product.status === "completed" && (
                          <Badge variant="default">
                            <Check className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        {product.status === "error" && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Price:</strong> ${product.price}
                        </p>
                        <p className="text-sm">
                          <strong>Category:</strong> {product.category}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Description:</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                          {product.aiGenerated?.description &&
                            product.aiGenerated.description !== product.description && (
                              <div className="p-2 bg-primary/5 rounded border-l-2 border-primary">
                                <p className="text-xs text-primary font-medium flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  AI Enhanced Description:
                                </p>
                                <p className="text-sm">{product.aiGenerated.description}</p>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium mb-1">Tags:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Product Image:</p>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(product.id, file)
                              }}
                              className="text-xs"
                            />
                            <Button size="sm" variant="outline">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
