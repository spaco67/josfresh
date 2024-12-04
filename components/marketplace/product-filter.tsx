import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ProductFilter({ selectedCategory, onCategoryChange }: ProductFilterProps) {
  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        <SelectItem value="vegetables">Vegetables</SelectItem>
        <SelectItem value="fruits">Fruits</SelectItem>
        <SelectItem value="grains">Grains</SelectItem>
        <SelectItem value="tubers">Tubers</SelectItem>
      </SelectContent>
    </Select>
  );
} 