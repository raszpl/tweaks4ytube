: menu

del all.css
type "..\menu\satus.css" > all.css
type "..\menu\styles\home.css" >> all.css
type "..\menu\styles\appearance.css" >> all.css
type "..\menu\styles\search.css" >> all.css
type "..\menu\styles\header.css" >> all.css
type "..\menu\styles\sub-options.css" >> all.css
type "..\menu\styles\analyzer.css" >> all.css
type "..\menu\styles\blocklist.css" >> all.css
type "..\menu\styles\fonts.css" >> all.css
type "..\menu\styles\settings.css" >> all.css
type "..\menu\styles\themes.css" >> all.css
move all.css "..\menu\all.css"

del all.js
type "..\menu\satus.js" > all.js
type "..\menu\skeleton.js" >> all.js
type "..\menu\skeleton-parts\search.js" >> all.js
type "..\menu\skeleton-parts\active-features.js" >> all.js
type "..\menu\skeleton-parts\settings.js" >> all.js
type "..\menu\skeleton-parts\general.js" >> all.js
type "..\menu\skeleton-parts\player.js" >> all.js
type "..\menu\skeleton-parts\appearance.js" >> all.js
type "..\menu\skeleton-parts\shortcuts.js" >> all.js
type "..\menu\skeleton-parts\channel.js" >> all.js
type "..\menu\skeleton-parts\playlist.js" >> all.js
type "..\menu\skeleton-parts\themes.js" >> all.js
type "..\menu\skeleton-parts\blocklist.js" >> all.js
type "..\menu\skeleton-parts\analyzer.js" >> all.js
type "..\menu\index.js" >> all.js
move all.js "..\menu\all.js"

copy index-all.html "..\menu\index.html"

: css

del all.css
type "..\js&css\extension\www.youtube.com\styles.css" > all.css
type "..\js&css\extension\www.youtube.com\general\general.css" >> all.css
type "..\js&css\extension\www.youtube.com\appearance\header\header.css" >> all.css
type "..\js&css\extension\www.youtube.com\appearance\player\player.css" >> all.css
type "..\js&css\extension\www.youtube.com\appearance\details\details.css" >> all.css
type "..\js&css\extension\www.youtube.com\appearance\sidebar\sidebar.css" >> all.css
type "..\js&css\extension\www.youtube.com\appearance\comments\comments.css" >> all.css
move all.css "..\all.css"

: extension

del all.js
type "..\js&css\extension\core.js" > all.js
type "..\js&css\extension\www.youtube.com\general\general.js" >> all.js
type "..\js&css\extension\www.youtube.com\appearance\comments\comments.js" >> all.js
type "..\js&css\extension\init.js" >> all.js
move all.js "..\extension.js"

: web

del all.js
type "..\js&css\web-accessible\core.js" > all.js
type "..\js&css\web-accessible\functions.js" >> all.js
type "..\js&css\web-accessible\www.youtube.com\appearance.js" >> all.js
type "..\js&css\web-accessible\www.youtube.com\themes.js" >> all.js
type "..\js&css\web-accessible\www.youtube.com\player.js" >> all.js
type "..\js&css\web-accessible\www.youtube.com\playlist.js" >> all.js
type "..\js&css\web-accessible\www.youtube.com\channel.js" >> all.js
type "..\js&css\web-accessible\www.youtube.com\shortcuts.js" >> all.js
type "..\js&css\web-accessible\www.youtube.com\blocklist.js" >> all.js
type "..\js&css\web-accessible\www.youtube.com\settings.js" >> all.js
type "..\js&css\web-accessible\init.js" >> all.js
move all.js "..\web-accessible.js"

copy manifest-all.json "..\manifest.json"
