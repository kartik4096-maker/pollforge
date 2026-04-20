from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import PollAnalyticsRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analytics")
def get_analytics(data: PollAnalyticsRequest):
    total = sum(o.votes for o in data.options)
    options_stats = [
        {
            "text": o.text,
            "votes": o.votes,
            "percentage": round((o.votes / total * 100), 2) if total > 0 else 0,
        }
        for o in data.options
    ]
    winner = max(data.options, key=lambda o: o.votes) if total > 0 else None
    return {
        "poll_id": data.poll_id,
        "title": data.title,
        "total_votes": total,
        "options": options_stats,
        "winner": winner.text if winner else None,
    }

@app.get("/health")
def health():
    return {"status": "ok"}