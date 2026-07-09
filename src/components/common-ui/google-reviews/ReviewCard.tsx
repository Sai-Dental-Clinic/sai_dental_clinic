import { Review } from "@/data/reviews/reviews"

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="min-w-[340px] max-w-[340px] bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
          {review.name[0]}
        </div>

        <div>
          <p className="font-medium text-foreground">{review.name}</p>
          <p className="text-xs text-muted-foreground">
            {review.date}
          </p>
          <p className="text-yellow-500 text-sm">
            {"★".repeat(review.rating)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-4">
        {review.text}
      </p>
    </div>
  )
}
