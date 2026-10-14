#!/usr/bin/env python3
"""Copies the sorted portfolio folders into assets/images/<slug>/, writes
gallery-data.js and regenerates the front-page grid markup in index.html.

Usage: python3 tools/build-gallery.py [case-key ...]   (no keys = rebuild everything)
Webp files are used first; a small resized jpg of the matching original
(if one exists) is written next to each as a fallback."""
import hashlib, json, os, re, shutil, subprocess, sys
from PIL import Image

MAX_SIDE = 2400  # longest side kept in the site copies

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.expanduser('~/Library/Mobile Documents/com~apple~CloudDocs/Portfolio_2026')
ONLY = set(sys.argv[1:])  # optional: rebuild just these case keys (e.g. domina)
OUT = os.path.join(REPO, 'assets', 'images')

CREDITS = json.load(open(os.path.join(REPO, 'tools', 'makeup-credits.json')))


def credits(key):
    return [{'h': 'credits', 'lines': CREDITS[key]}]


# (key, category, folder(s), hover title, panel title, details)
CASES = [
    ('domina', 'makeup', ['Makeup/Domina/Webp'], 'Domina Journal', 'Domina Journal', credits('domina')),
    ('elle2023', 'makeup', ['Makeup/ELLE 2023/Webp'], 'Elle Sverige', 'Elle Sverige', credits('elle2023')),
    ('elleceen', 'makeup', ['Makeup/ELLE_CEEN/Webp'], 'Elle Sverige', 'Elle Sverige', credits('elleceen')),
    ('metalhead', 'makeup', ['Makeup/Metalhead/Webp'], 'Metalhead Mag', 'Metalhead Mag', credits('metalhead')),
    ('mhmarion', 'makeup', ['Makeup/MH Marion/Webp'], 'Personal Project', 'Personal Project', credits('mhmarion')),
    ('tovelo', 'makeup', ['Makeup/Tove Lo Milles/Webp'], 'Le Mile / Tove Lo', 'Le Mile / Tove Lo', credits('tovelo')),
    ('voguecs', 'makeup', ['Makeup/VOGUE_CS/Webp'], 'Vogue', 'Vogue', credits('voguecs')),
    ('wrpd', 'makeup', ['Makeup/WRPD/Webp'], 'WRPD Mag', 'WRPD Mag', credits('wrpd')),

    ('alien', 'digital',
     ['Digital/Alien/Webp'],
     'Alien — School project', 'Alien 3D Nails & Editorial — Hyper Island', [
        {'h': 'brief', 't': 'Build an alien world and create its artifacts.'},
        {'h': 'concept', 't': 'Two parallel worlds collide and become obsessed with each other’s beauty. Aliens try to look human, and humans try to look alien. I 3D sculpted the aliens’ natural nails and a wearable press-on set for humans inspired by them, then created a photoshoot with fashion magazine covers from both worlds.'},
        {'h': 'my role', 't': 'Art director, 3D designer, photographer, stylist, makeup artist, hair stylist, editor'},
        {'h': 'team credits', 'lines': ['Model — Cornelia Borgfelt Liner']},
        {'h': 'special thanks', 'lines': ['Isabella Vercelli', 'Gustav Viklund', 'Maria Kling, Hyper Island']},
        {'h': 'deliverables', 't': '3D alien nails, 3D press-on nail set, photoshoot, magazine covers'}]),
    ('acte', 'digital', ['Digital/Acté Atelier/Webp'],
     'Acté Atelier — Brand identity', 'Acté Atelier Brand Identity Proposal — Hyper Island client project', [
        {'h': 'brief', 't': 'Create a visual identity for Acté Atelier, a lingerie brand designed around women’s hormonal health.'},
        {'h': 'concept', 't': 'The logo combines three shapes: the uterus, a pair of panties and the letter A. Repeated as a pattern, the mark turned into something that resembles lace, connecting the brand’s focus on hormonal health with the craft of lingerie.'},
        {'h': 'my role', 't': 'Art director, graphic designer'},
        {'h': 'deliverables', 't': 'Logo, pattern, color palette, mockups'}]),
    ('haglofs', 'digital', ['Digital/Haglöfs/Webp'],
     'Haglöfs — AI exploration', 'Haglöfs AI Visual Exploration — Hyper Island client project', [
        {'h': 'brief', 't': 'Explore how Haglöfs can integrate AI into their existing e-commerce photography to make it feel more premium, and create a roadmap for doing it at scale.'},
        {'h': 'concept', 't': 'We created a visual direction and experimented with training LoRA models on Haglöfs’ existing images, to keep a consistent visual style across stills and video at a large scale. The result was a proposal and research base for Haglöfs to take the work forward in-house.'},
        {'h': 'my role', 't': 'Team lead, AI and LoRA researcher, AI stills (LoRA training and generation)'},
        {'h': 'team credits', 'lines': [
            'Team lead & creative director — Sofya Salnikova',
            'AI stills (LoRA training & generation) — Gustav Viklund',
            'AI video & researcher — Joon Kye',
            'UX/UI designer & researcher — Maryam Maralani',
            'UX/UI designer & researcher — Hailey Pack',
            'Researcher — My Ronsten']},
        {'h': 'special thanks', 'lines': ['Bettina Schwalm, Hyper Island', 'Otis Ingelstam, Hyper Island', 'Harald Broström, Haglöfs']},
        {'h': 'deliverables', 't': 'Visual direction, AI roadmap, LoRA training experiments, generated stills and video'},
        {'t': 'Made with Out of Office, a 7-person creative studio founded at Hyper Island.'}]),
    ('l8', 'digital', ['Digital/L8Hasselblad/Webp'],
     'L8 Hasselblad — Rebrand', 'L8 Hasselblad Rebrand Proposal — Hyper Island client project', [
        {'h': 'brief', 't': 'Rebrand L8 Hasselblad, a jewelry brand by designer Lotta Hasselblad, with a new brand book and visual direction.'},
        {'h': 'concept', 't': 'L8 Hasselblad is known for its playful creativity and bold use of color. Lotta wanted to be seen as more premium, since her collection ranges from affordable pieces to high-end jewelry. We kept the colorful, expressive energy but refined it into a cleaner, more premium identity.'},
        {'h': 'my role', 't': 'Team lead, PR and affiliate strategist, photographer sourcing, e-commerce and social media guidelines, assisting graphic designer and art director'},
        {'h': 'team credits', 'lines': [
            'Design lead — Gustav Viklund', 'Art director — Malwina Kleparska', 'Coordinator — Ying Chen',
            'Web designer — Ryan Sundin', 'Researcher — Evelina Benislavska']},
        {'h': 'special thanks', 'lines': ['Lotta Hasselblad, L8 Hasselblad', 'Caroline Lönnquist, L8 Hasselblad', 'Mattias Mattisson, Hyper Island']},
        {'h': 'deliverables', 'lines': [
            'Identity: logo, wordmark, brand colors, illustrations',
            'Guidelines: brand book, social media, e-commerce',
            'Design: website, mockups, physical store concept',
            'Strategy: PR affiliates, photographer suggestions']}]),
    ('mamika', 'digital', ['Digital/Mamika Suzuki/Webp'],
     'Mamika Suzuki — Brand identity', 'Mamika Suzuki Brand Identity — Client project', [
        {'h': 'brief', 't': 'Create a visual identity for Mamika Suzuki, a handmade silver jewelry brand.'},
        {'h': 'concept', 't': 'The logo combines an M and an S, based on Mamika’s own drawing and shaped like melted silver, reflecting her handmade process. The client wanted purple, so I chose a deep shade to give the brand a mysterious feel, paired with off-white for a softer contrast than pure white.'},
        {'h': 'my role', 't': 'Art director, graphic designer'},
        {'h': 'deliverables', 't': 'Logo, wordmark, brand colors, photography direction, mockups'}]),
    ('mamikashoot', 'digital', ['Digital/Mamika Photoshoot/Webp'],
     'Mamika Suzuki — Photography', 'Mamika Suzuki E-commerce Photography — Client project', [
        {'h': 'brief', 't': 'Create product photography for Mamika Suzuki’s online store, following the new brand direction.'},
        {'h': 'concept', 't': 'To make the brand feel mysterious, the photos are dark with a completely black background, leaving space for the hand and the silver jewelry to stand out. The contrast lets the silver catch the light, which highlights the handmade details.'},
        {'h': 'my role', 't': 'Art director, photographer'},
        {'h': 'deliverables', 't': 'E-commerce product images'}]),
]

# Digital titles and details come from the Work Text Digital doc.
DIGITAL_TEXT = json.load(open(os.path.join(REPO, 'tools', 'digital-text.json')))
CASES = [(k, c, f, DIGITAL_TEXT[k]['hover'], DIGITAL_TEXT[k]['title'], DIGITAL_TEXT[k]['details']) if k in DIGITAL_TEXT else (k, c, f, h, t, d) for k, c, f, h, t, d in CASES]

# Logo-style thumbnails are contained on a light tile instead of cropped.
CONTAIN = {'acte', 'mamika'}
PAIR_PORTRAITS = {'metalhead'}  # keep portraits paired, landscapes alone
POSITION = {'alien': '42% 50%'}  # per-key object-position overrides, e.g. {'domina': '50% 20%'}
# key: (video file, name in assets, webp that is the video's poster and gets replaced by it)
VIDEOS = {'alien': ('Digital/Alien/Digital_3DAlien_1.mp4', 'alien-loop.mp4', 'Digital_Alien_7webp.webp')}


def natkey(name):
    return (0 if name.startswith('Asset') else 1,
            [int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)', name)])


def dims(path):
    o = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path],
                       capture_output=True, text=True).stdout.split()
    return int(o[o.index('pixelWidth:') + 1]), int(o[o.index('pixelHeight:') + 1])


def find_original(folder, name):
    parent = os.path.dirname(folder)
    stem = re.sub(r'\.(webp|jpg|jpeg|png)$', '', name, flags=re.I)
    stem = re.sub(r'\.(webp|jpg|jpeg|png)$', '', stem, flags=re.I)
    norm = lambda x: re.sub(r'\d+', lambda m: str(int(m.group())), x)
    for f in os.listdir(parent):
        base, ext = os.path.splitext(f)
        if norm(base) == norm(stem) and ext.lower() in ('.jpg', '.jpeg', '.png'):
            return os.path.join(parent, f)
    return None


def tag(repo_path):
    h = hashlib.md5(open(os.path.join(REPO, repo_path), 'rb').read()).hexdigest()[:8]
    return f'{repo_path}?v={h}'


def esc(s):
    return s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')


data, order = {}, []
existing = {}
if ONLY:
    existing = json.loads(re.sub(r'^window.GALLERIES = |;\s*$', '', open(os.path.join(REPO, 'gallery-data.js')).read()))
for key, cat, folders, hover, title, details in CASES:
    if ONLY and key not in ONLY:
        data[key] = existing[key]
        order.append(key)
        continue
    dest = os.path.join(OUT, key)
    for root, _, files in os.walk(dest):
        for f in files:
            os.remove(os.path.join(root, f))
    os.makedirs(os.path.join(dest, 'fb'), exist_ok=True)
    imgs = []
    names = []
    n = 0
    for folder in folders:
        fdir = os.path.join(SRC, folder)
        for name in sorted((f for f in os.listdir(fdir) if not f.startswith('.')), key=natkey):
            n += 1
            ext = os.path.splitext(name)[1].lower()
            out = f'{n:02d}{ext}'
            shutil.copy(os.path.join(fdir, name), os.path.join(dest, out))
            path = os.path.join(dest, out)
            if ext == '.webp':
                im = Image.open(path)
                if max(im.size) > MAX_SIDE:
                    im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
                    im.save(path, 'WEBP', quality=82, method=6)
            w, h = dims(path)
            item = {'src': tag(f'assets/images/{key}/{out}'), 'w': w, 'h': h}
            orig = find_original(fdir, name)
            if orig:
                fb = f'{n:02d}.jpg'
                subprocess.run(['sips', '-Z', '1400', '-s', 'format', 'jpeg', '-s', 'formatOptions', '60',
                                orig, '--out', os.path.join(dest, 'fb', fb)], capture_output=True)
                if os.path.exists(os.path.join(dest, 'fb', fb)):
                    item['fb'] = tag(f'assets/images/{key}/fb/{fb}')
            imgs.append(item)
            names.append(name)
    if not os.listdir(os.path.join(dest, 'fb')):
        os.rmdir(os.path.join(dest, 'fb'))
    main, rest = imgs[0], imgs[1:]
    if key in VIDEOS:
        vsrc, vname, poster = VIDEOS[key]
        shutil.copy(os.path.join(SRC, vsrc), os.path.join(dest, vname))
        vurl = tag(f'assets/images/{key}/{vname}')
        for it, nm in zip(imgs, names):
            if nm == poster:
                it['video'] = vurl
        main, rest = imgs[0], imgs[1:]
    data[key] = {'key': key, 'category': cat, 'hover': hover, 'title': title,
                 'thumb': imgs[0], 'main': main, 'items': rest, 'details': details,
                 **({'pairPortraits': True} if key in PAIR_PORTRAITS else {})}
    order.append(key)
    print(f'{key}: {len(imgs)} images')

with open(os.path.join(REPO, 'gallery-data.js'), 'w') as f:
    f.write('window.GALLERIES = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')

# ---- front-page grid ----
def col(cat, cid, extra):
    rows = []
    for i, key in enumerate([k for k in order if data[k]['category'] == cat], 1):
        d = data[key]
        t = d['thumb']
        cls = 'item item--logo' if key in CONTAIN else 'item'
        pos = POSITION.get(key, '50% 35%')
        fb = f' onerror="this.onerror=null;this.src=\'{t["fb"]}\'"' if 'fb' in t else ''
        eager = 'decoding="async"' if i == 1 else 'loading="lazy" decoding="async"'
        rows.append(
            f'        <div class="{cls}" id="{cat}-{i}" tabindex="0" data-category="{cat}" '
            f'data-title="{esc(d["hover"])}" data-gallery="{key}">\n'
            f'          <img src="{t["src"]}" alt="{esc(d["hover"])}" style="object-position:{pos}" '
            f'width="{t["w"]}" height="{t["h"]}" {eager}{fb}>\n'
            f'          <div class="item__dim" aria-hidden="true"></div><div class="item__title" aria-hidden="true">{esc(d["hover"])}</div>\n'
            f'        </div>')
    return (f'      <div class="col {cid}" id="{"col-up" if cat == "makeup" else "col-down"}" data-category="{cat}">\n'
            + '\n'.join(rows) + '\n      </div>\n')

html_path = os.path.join(REPO, 'index.html')
html = open(html_path).read()
a = html.index('      <div class="col col--up"')
b = html.index('    </div>\n\n    <a class="goup goup--page"')
html = html[:a] + col('makeup', 'col--up', '') + '\n' + col('digital', 'col--down', '') + html[b:]
open(html_path, 'w').write(html)
print('done')
