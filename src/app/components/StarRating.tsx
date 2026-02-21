import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: number;
  showCount?: boolean;
}

export function StarRating({ rating, reviews, size = 16, showCount = true }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const fill = rating - i;
    if (fill >= 1) return "full";
    if (fill >= 0.5) return "half";
    return "empty";
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            {type === "full" && (
              <Star size={size} className="fill-amber-400 text-amber-400" />
            )}
            {type === "half" && (
              <div className="relative">
                <Star size={size} className="text-gray-300" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                  <Star size={size} className="fill-amber-400 text-amber-400" />
                </div>
              </div>
            )}
            {type === "empty" && (
              <Star size={size} className="text-gray-300" />
            )}
          </div>
        ))}
      </div>
      {showCount && reviews !== undefined && (
        <span className="text-[#6B7280]" style={{ fontSize: size * 0.75 }}>
          ({reviews.toLocaleString("pt-BR")})
        </span>
      )}
    </div>
  );
}
