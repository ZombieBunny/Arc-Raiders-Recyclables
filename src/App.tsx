import { useState } from "react";
import { Search, Package } from "lucide-react";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import data from "../arc_raiders_items.json";

interface Item {
  name: string;
  rarity: string;
  recycles_to: Record<string, number>;
  sell_price: number;
  category: string;
  image?: string;
}

const items: Item[] = data as any;
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case "common":
      return "bg-gray-500/10 text-gray-700 border-gray-200";
    case "uncommon":
      return "bg-green-500/10 text-green-700 border-green-200";
    case "rare":
      return "bg-blue-500/10 text-blue-700 border-blue-200";
    case "epic":
      return "bg-purple-500/10 text-purple-700 border-purple-200";
    case "legendary":
      return "bg-orange-500/10 text-orange-700 border-orange-200";
    default:
      return "bg-gray-500/10 text-gray-700 border-gray-200";
  }
};

const getRarityActiveColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case "common":
      return "bg-gray-500 text-white border-gray-500";
    case "uncommon":
      return "bg-green-500 text-white border-green-500";
    case "rare":
      return "bg-blue-500 text-white border-blue-500";
    case "epic":
      return "bg-purple-500 text-white border-purple-500";
    case "legendary":
      return "bg-orange-500 text-white border-orange-500";
    default:
      return "bg-gray-500 text-white border-gray-500";
  }
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);

  const toggleRarity = (rarity: string) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity)
        ? prev.filter((r) => r !== rarity)
        : [...prev, rarity]
    );
  };

  const filteredItems = items.filter((item) => {
    // Filter by rarity
    if (selectedRarities.length > 0 && !selectedRarities.includes(item.rarity)) {
      return false;
    }

    if (!searchQuery) return true;
    const recyclesToString =
      item && item.recycles_to
        ? Object.keys(item.recycles_to).join(",").toLowerCase()
        : "";
    return recyclesToString.includes(searchQuery.toLowerCase());
  });

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-slate-900 mb-2">Arc Raiders Item Recycler</h1>
          <p className="text-slate-600">
            Recycle smart, loot harder! Search the material you need, and we’ll show you what to break down to get it.
          </p>
        </div>

        {/* Rarity Filters */}
        <div className="mb-6">
          <span className="block text-slate-700 mb-3">
            Filter by Rarity
          </span>
          <div className="flex flex-wrap gap-2">
            {RARITIES.map((rarity) => (
              <Badge
                key={rarity}
                variant="outline"
                className={`cursor-pointer transition-all ${
                  selectedRarities.includes(rarity)
                    ? getRarityActiveColor(rarity)
                    : getRarityColor(rarity)
                }`}
                onClick={() => toggleRarity(rarity)}
              >
                {rarity}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search Field */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search for a thang"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white shadow-sm border-slate-200 focus-visible:ring-blue-500"
          />
        </div>

        {/* Results Count */}
        {(searchQuery || selectedRarities.length > 0) && (
          <div className="mb-4 text-slate-600">
            Found {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
          </div>
        )}

        {/* Item List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-900 mb-2">No items found</h3>
              <p className="text-slate-500">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Icon/Image Placeholder */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-slate-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-slate-900">{item.name}</h3>
                      <Badge
                        variant="outline"
                        className={getRarityColor(item.rarity)}
                      >
                        {item.rarity}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {/* Recycles To */}
                      <div>
                        <span className="text-slate-500 mr-2">Recycles into:</span>
                        <span className="text-slate-700">
                                  {item && item.recycles_to
                            ? Object.entries(item?.recycles_to)
                                .map(
                                  ([material, count]) =>
                                    `${material} (×${count})`
                                )
                                .join(", ")
                            : "none"}
                        </span>
                      </div>

                      {/* Additional Info */}
                      <div className="flex flex-wrap items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <span>Category:</span>
                          <span className="text-slate-700">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Sell Price:</span>
                          <span className="text-slate-700">{item.sell_price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}