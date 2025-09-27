const express = require("express");
const fetch = require("node-fetch");
const app = express();

const PORT = process.env.PORT || 3000;

// Helper function to get a random game
async function getRandomGame() {
    try {
        // Fetch a list of games (here we use the "popular games" endpoint)
        const response = await fetch("https://games.roblox.com/v1/games/list?sortOrder=Asc&limit=50");
        const data = await response.json();

        if (!data.data || data.data.length === 0) return null;

        // Pick a random game from the returned list
        const game = data.data[Math.floor(Math.random() * data.data.length)];

        // Construct result
        return {
            placeId: game.rootPlaceId,
            name: game.name,
            description: game.description,
            creatorName: game.creator?.name || "Unknown",
            thumbnailUrl: `https://www.roblox.com/Thumbs/Place?width=420&height=420&format=png&placeId=${game.rootPlaceId}`
        };
    } catch (err) {
        console.error(err);
        return null;
    }
}

app.get("/randomGame", async (req, res) => {
    const game = await getRandomGame();
    if (!game) return res.status(500).json({ error: "Could not fetch a game." });
    res.json(game);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
