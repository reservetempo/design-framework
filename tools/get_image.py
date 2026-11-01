#!/usr/bin/env python3
"""Find and download Wikimedia images for the Design framework site (index.html).

Usage:
  python tools/get_image.py search "<query>" [--wiki commons|en] [--limit N]
  python tools/get_image.py get "File:<name>" <out path> [--wiki commons|en] [--width 800]

search  prints one line per file: title | width x height | licence | MIME type.
get     saves a <width>px thumbnail (or the original if it is already narrower),
        creating folders as needed, and prints the credit as one line of JSON:
        {"by": ..., "license": ..., "source": <file page URL>, "bytes": N}
        Non-ASCII characters come out as \\uXXXX escapes (valid in the JS data files).

--wiki commons (default) uses commons.wikimedia.org; --wiki en uses en.wikipedia.org
(for non-free screenshots). Python 3 standard library only; files are only
downloaded from upload.wikimedia.org.
"""
import argparse
import html
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

APIS = {
    "commons": "https://commons.wikimedia.org/w/api.php",
    "en": "https://en.wikipedia.org/w/api.php",
}
USER_AGENT = "DesignFramework/1.0 (https://reservetempo.github.io/design-framework/; python-urllib)"
SAFE_ORIGINALS = ("image/jpeg", "image/png", "image/gif", "image/webp")


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        hint = " (too many requests: wait a minute and retry)" if e.code == 429 else ""
        sys.exit(f"error: HTTP {e.code} for {url}{hint}")
    except urllib.error.URLError as e:
        sys.exit(f"error: cannot reach {urllib.parse.urlsplit(url).netloc}: {e.reason}")


def api(wiki, **params):
    params.update(action="query", format="json", formatversion="2")
    data = json.loads(fetch(APIS[wiki] + "?" + urllib.parse.urlencode(params)))
    if "error" in data:
        sys.exit(f"error: {data['error'].get('info', data['error'])}")
    return data.get("query", {})


def meta(info, key):
    """Plain text of an extmetadata field: HTML tags stripped, whitespace collapsed."""
    value = info.get("extmetadata", {}).get(key, {}).get("value", "")
    text = html.unescape(re.sub(r"<[^>]+>", " ", str(value)))
    return re.sub(r"\s+", " ", text).strip()


def search(args):
    query = api(args.wiki, generator="search", gsrsearch=args.query, gsrnamespace=6,
                gsrlimit=max(1, min(args.limit, 50)), prop="imageinfo",
                iiprop="size|mime|extmetadata", iiextmetadatafilter="LicenseShortName")
    pages = sorted(query.get("pages", []), key=lambda p: p.get("index", 0))
    if not pages:
        print("no files found")
    for page in pages:
        info = (page.get("imageinfo") or [{}])[0]
        size = f"{info.get('width', '?')}x{info.get('height', '?')}"
        print(f"{page['title']} | {size} | {meta(info, 'LicenseShortName') or '?'} | {info.get('mime', '?')}")


def get(args):
    title = args.title if args.title.lower().startswith("file:") else "File:" + args.title
    query = api(args.wiki, titles=title, prop="imageinfo",
                iiprop="url|size|mime|extmetadata", iiurlwidth=args.width)
    page = (query.get("pages") or [{}])[0]
    if not page.get("imageinfo"):
        site = "Wikimedia Commons" if args.wiki == "commons" else "English Wikipedia"
        other = "en" if args.wiki == "commons" else "commons"
        sys.exit(f"error: {title} not found on {site} (check the exact name, or try --wiki {other})")
    info = page["imageinfo"][0]

    # Use the original when it is already narrow enough and a web format; otherwise the thumbnail.
    narrow = info.get("width", 0) <= args.width and info.get("mime") in SAFE_ORIGINALS
    url = info["url"] if narrow or "thumburl" not in info else info["thumburl"]
    # The API may hand out thumb.wikimedia.org links with tracking parameters; the same
    # path is served by upload.wikimedia.org, the only host this script downloads from.
    parts = urllib.parse.urlsplit(url)
    if parts.hostname == "thumb.wikimedia.org":
        parts = parts._replace(netloc="upload.wikimedia.org")
    url = urllib.parse.urlunsplit(parts._replace(query="", fragment=""))
    if urllib.parse.urlsplit(url).hostname != "upload.wikimedia.org":
        sys.exit(f"error: refusing to download {url} (only upload.wikimedia.org is allowed)")

    data = fetch(url)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(data)

    # Notes go to stderr so stdout stays one line of JSON.
    got = Path(urllib.parse.urlsplit(url).path).suffix.lower().replace(".jpeg", ".jpg")
    want = out.suffix.lower().replace(".jpeg", ".jpg")
    if got and got != want:
        print(f"note: the downloaded file is {got}, but {out.name} ends in {want}", file=sys.stderr)
    if len(data) > 400_000:
        print(f"note: {len(data) // 1000} KB is over ~400 KB; try a smaller --width", file=sys.stderr)
    if meta(info, "NonFree").lower() == "true":
        print("note: non-free file; credit it as \"(c) <owner>, non-free, via English Wikipedia\"",
              file=sys.stderr)

    print(json.dumps({
        "by": meta(info, "Artist") or "Unknown",
        "license": meta(info, "LicenseShortName") or "Unknown",
        "source": info.get("descriptionurl", ""),
        "bytes": len(data),
    }))


def main():
    sys.stdout.reconfigure(errors="backslashreplace")
    parser = argparse.ArgumentParser(description="Search and download Wikimedia images.")
    sub = parser.add_subparsers(dest="command", required=True)
    s = sub.add_parser("search", help="search files and list size, licence and type")
    s.add_argument("query")
    s.add_argument("--wiki", choices=APIS, default="commons")
    s.add_argument("--limit", type=int, default=10)
    g = sub.add_parser("get", help="download one file and print its credit as JSON")
    g.add_argument("title", help='e.g. "File:Example.jpg"')
    g.add_argument("out", help="output path, e.g. img/os/aqua.png")
    g.add_argument("--wiki", choices=APIS, default="commons")
    g.add_argument("--width", type=int, default=800)
    args = parser.parse_args()
    search(args) if args.command == "search" else get(args)


if __name__ == "__main__":
    main()
