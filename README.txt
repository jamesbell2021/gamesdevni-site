3BL - Forged in Formation website (rebuilt 1 October 2026)

Upload the whole folder as it is: index.html, screenshots/, video/.
Total about 41 MB, of which the trailer is 34 MB (1080p, starts playing
before it has fully downloaded) and the 2 Player Battle loop 4 MB.

When the Steam store page is live, open index.html, find this near the
bottom and fill in the two lines:

    var STEAM_URL = "";      e.g. "https://store.steampowered.com/app/1234560/Forged_in_Formation/"
    var STEAM_APP_ID = "";   e.g. "1234560"

Every "Wishlist on Steam" button then links to the store page, and Steam's own
wishlist widget appears in the Wishlist section. Until then the buttons read
"Coming soon to Steam".

Hosted on GitHub Pages (repo jamesbell2021/gamesdevni-site) at
https://jamesbell2021.github.io/gamesdevni-site/ - push to main and the site
updates in a minute or two. gamesdevni.site redirects here with a Cloudflare
Redirect Rule; the Raspberry Pi behind the domain is left as it was.

Adding a screenshot: put the full-size image and a 960px-wide _thumb copy in
screenshots/, then copy one of the <button class="shot"> lines in the
Screenshots section.

The 2 Player Battle loop (video/two_player_battle.mp4, 23 s, muted) and the
battle_*.jpg screenshots were captured in engine on 6 October 2026: the game
saved every frame itself (-dumpmovie, a fixed 30 fps) from a computer battle
and the staged shots Web_SniperRing and Web_KegBlast in the game repo's
Tools/reel/reel_shots.json, then cut with ffmpeg.

Sources: the screenshots are Tools/steam/screenshots in the game's repo, the
trailer is Tools/trailer/Forged_in_Formation_Steam_Trailer.mp4 (re-encoded for
the web), and the copy matches docs/STEAM_STORE_PAGE.md.

Defend the Drift's teaser (video/defend_the_drift_teaser.mp4 and its poster) is
cut by Tools/film/cut.py --web in the DefendTheDrift repo, from the shots
Tools/film/film.sh films in the engine (see that repo's docs/HANDOVER.md,
"Filming the trailer").
