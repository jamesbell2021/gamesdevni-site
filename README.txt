3BL - Forged in Formation website (rebuilt 1 October 2026)

Upload the whole folder as it is: index.html, screenshots/, video/.
Total about 63 MB, of which the trailer is 28 MB (1080p, starts playing
before it has fully downloaded), Defend the Drift's teaser 22 MB and the
2 Player Battle loop 2 MB.

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

The 2 Player Battle loop (video/two_player_battle.mp4, 23.6 s, muted) and the
battle_*.jpg screenshots were re-taken on 7 October 2026 with the faceted cast,
from the game repo's takes: a computer battle on the River
(Tools/trailer/takes/stills/battle_river.mp4, Tools/trailer/stills_shots.json),
the commander's ring and fall (gameplay/commander_down.mp4) and the keg chain
(renders/Keg_Chain.mp4), cut with ffmpeg.

Sources: the trailer is the October cut, Tools/trailer/Forged_in_Formation_Trailer.mp4
in the game's repo (recorded in the game by Tools/trailer/record_trailer.sh,
cut by assemble.py, re-encoded for the web at 2.4 Mbit/s), re-shot on
7 October 2026 with the faceted cast, the rounded world, the men's crouch and
the ground's stone edges. Every Forged in Formation screenshot was re-taken the
same day: frames from the trailer's takes (Tools/trailer/gameplay, renders,
takes) and from Tools/trailer/stills_shots.json's own takes, and the level
views from Tools/steam/photos (Tools/steam/photos.sh, Saved/Photos/level_shots.json).
The poster is the recruits on the beach. The copy matches docs/STEAM_STORE_PAGE.md.

Defend the Drift's teaser (video/defend_the_drift_teaser.mp4 and its poster) is
cut by Tools/film/cut.py --web in the DefendTheDrift repo, from the shots
Tools/film/film.sh films in the engine (see that repo's docs/HANDOVER.md,
"Filming the trailer").
