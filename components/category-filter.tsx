"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

const categories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Health & Beauty",
  "Toys & Games",
]

const colors = ["Red", "Blue", "Green", "Black", "White", "Gray", "Brown"]

export function CategoryFilter() {
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category])
                  } else {
                    setSelectedCategories(selectedCategories.filter((c) => c !== category))
                  }
                }}
              />
              <Label htmlFor={category} className="text-sm font-medium">
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={color}
                checked={selectedColors.includes(color)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedColors([...selectedColors, color])
                  } else {
                    setSelectedColors(selectedColors.filter((c) => c !== color))
                  }
                }}
              />
              <Label htmlFor={color} className="text-sm font-medium">
                {color}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
