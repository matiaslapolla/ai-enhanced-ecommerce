import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"
import { ProductGrid } from "@/components/product-grid"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">All Products</h1>
        <p className="text-muted-foreground">Browse our complete product catalog</p>
      </div>

      <div className="space-y-6">
        <SearchBar />
        <CategoryFilter />
        <ProductGrid />
      </div>
    </div>
  )
}
