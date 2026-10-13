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
battle_*.jpg screenshots were re-taken on 11 October 2026, from the game repo's
takes: a computer battle on the River (Tools/trailer/takes/stills/battle_river.mp4,
Tools/trailer/stills_shots.json), the commander's ring and fall
(gameplay/commander_down.mp4) and the keg chain (renders/Keg_Chain.mp4), cut
with ffmpeg.

Sources: the trailer is the cut of 11 October 2026,
Tools/trailer/Forged_in_Formation_Trailer.mp4 in the game's repo (recorded in
the game by Tools/trailer/record_trailer.sh, cut by assemble.py from edit.json,
re-encoded for the web at 2.4 Mbit/s): quicker than the 7 October one - a cold
open on a keg going up, the squad cheering the gun into battery, water
splashing round wading feet, and a montage a beat a cut into the name. Every
Forged in Formation screenshot was re-taken the same evening, same names, from
the trailer's takes and Tools/trailer/stills_shots.json's own, and the level
views from Tools/steam/photos (Tools/steam/photos.sh); one is new,
the_squad_cheers. The poster is the squad cheering. The copy matches
docs/STEAM_STORE_PAGE.md.

Defend the Drift's teaser (video/defend_the_drift_teaser.mp4 and its poster) is
cut by Tools/film/cut.py --web in the DefendTheDrift repo, from the shots
Tools/film/film.sh films in the engine (see that repo's docs/HANDOVER.md,
"Filming the trailer").

Victory By None (on itch.io since 12 October 2026, Windows and Android,
https://gamesdevnisite.itch.io/victory-by-none) has its own section, #vbn,
after Cyber Vikings. Its trailer (video/victory_by_none_trailer.mp4,
poster video/victory_by_none_poster.jpg) and the four vbn_*.jpg screenshots were
made on 12 October 2026 from the game itself: the Godot project films a scripted
pass and play war with Movie Maker (tools_trailer/trailer.gd) and
tools_trailer/assemble.py cuts it with the title cards and the game's music.
The section links to the itch.io page and embeds itch.io's buy widget
(Distribute tab on itch.io, project 5144407, coloured to match the section).
The widget is 552px wide, so on screens under 600px a plain "Get Victory By
None on itch.io" button shows in its place.

Angry Old Men (on itch.io since 12 October 2026, Windows and Android,
https://gamesdevnisite.itch.io/angry-old-men) has its own section, #aom, after
Victory By None. Its trailer (video/angry_old_men_trailer.mp4, poster
video/angry_old_men_poster.jpg) and the four aom_*.jpg screenshots come from the
game itself: tools_shots/trailer.gd films a scripted game with Movie Maker and
tools_shots/assemble.py cuts it. The section embeds itch.io's buy widget
(project 5145474); on screens under 600px a "Get Angry Old Men on itch.io"
button shows in its place.

Neon Mega Tank (coming soon, Android) has its own section, #nmt, after Pultz.
Its trailer (video/neon_mega_tank_trailer.mp4, poster
video/neon_mega_tank_poster.jpg) and the nmt_*.jpg screenshots were filmed in
the game on 13 October 2026: the Godot project's tools/trailer/record.sh films
each shot with Movie Maker (tools/trailer/director.gd) and
tools/trailer/assemble.py cuts them with neon title cards and the game's own
chiptune (repo jamesbell2021/Animation-, folder neon-mega-tank). When it goes
on sale, swap the section's "Coming soon" pill for a link like the other
games' and add the store's widget.

The game can be played in Japanese (a LANGUAGE button on its title menu), so
the Neon Mega Tank section ends with a "日本語でも遊べる / Also in Japanese"
sub-gallery of four nmt_ja_*.jpg screenshots (title menu, a wave banner, the
boss fight and game over), taken on 13 October 2026 with the game switched to
Japanese and its phone controls on.
