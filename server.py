#!/usr/bin/env python3
"""
FRAME Camera & Lens Real-Time Crawler Server
Runs locally to bypass browser CORS and scrape live sample photos, videos, and blog reviews.
"""

import sys
import os
import json
import re
import html
import urllib.request
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn
from concurrent.futures import ThreadPoolExecutor, as_completed

PORT = 5050
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

def fetch_url(url, timeout=5, headers=None):
    req_headers = {"User-Agent": USER_AGENT}
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, headers=req_headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            content_type = resp.headers.get("Content-Type", "")
            charset = "utf-8"
            if "charset=" in content_type.lower():
                charset = content_type.lower().split("charset=")[-1].split(";")[0].strip()
            raw = resp.read()
            try:
                return raw.decode(charset, errors="replace")
            except Exception:
                return raw.decode("utf-8", errors="replace")
    except Exception as e:
        return None


OPTICAL_TERMS_DICTIONARY = [
    # Brands & Makers
    (['라이트 렌즈 랩', '라이트렌즈랩', 'lll', 'light lens lab', 'lightlenslab'], 'lightlenslab'),
    (['티티아티산', '티시아티산', 'ttartisan', 'tt artisan'], 'ttartisan'),
    (['7장인', '칠장인', '7artisans', '7 artisans'], '7artisans'),
    (['보이그랜더', '보익', 'voigtlander', 'voigtlaender'], 'voigtlander'),
    (['라이카', 'leica'], 'leica'),
    (['칼자이스', '자이스', 'zeiss', 'carl zeiss'], 'zeiss'),
    (['미놀타', 'minolta'], 'minolta'),
    (['핫셀블라드', '핫셀', 'hasselblad'], 'hasselblad'),
    (['콘탁스', 'contax'], 'contax'),
    (['롤라이', '롤라이플렉스', 'rollei', 'rolleiflex'], 'rolleiflex'),
    (['펜탁스', '아사히', 'pentax', 'asahi'], 'pentax'),
    (['캐논', 'canon'], 'canon'),
    (['니콘', 'nikon'], 'nikon'),
    (['후지필름', '후지', 'fujifilm', 'fuji'], 'fujifilm'),
    (['소니', 'sony'], 'sony'),
    (['올림푸스', '주이코', 'olympus', 'zuiko'], 'olympus'),
    (['파나소닉', '루믹스', 'lumix'], 'lumix'),
    (['시그마', 'sigma'], 'sigma'),
    (['탐론', 'tamron'], 'tamron'),
    (['삼양', '로키논', 'samyang', 'rokinon'], 'samyang'),
    (['야시카', 'yashica'], 'yashica'),

    # Lens Lineups
    (['주미크론', '즈미크론', 'summicron'], 'summicron'),
    (['주미룩스', '즈미룩스', 'summilux'], 'summilux'),
    (['녹티룩스', '녹티', 'noctilux'], 'noctilux'),
    (['주마론', '중마론', 'summaron'], 'summaron'),
    (['엘마', 'elmar'], 'elmar'),
    (['주미타', 'summitar'], 'summitar'),
    (['주마', 'summar'], 'summar'),
    (['슈퍼 타쿠마', '슈퍼타쿠마', '타쿠마', 'takumar'], 'supertakumar'),
    (['헬리오스 44', '헬리오스', 'helios'], 'helios44'),
    (['녹톤', 'nokton'], 'nokton'),
    (['울트론', 'ultron'], 'ultron'),
    (['헬리어', 'heliar'], 'heliar'),
    (['컬러스코파', '스코파', 'skopar'], 'skopar'),
    (['아포란타', '란타', 'lanthar'], 'lanthar'),
    (['로코르', 'rokkor'], 'rokkor'),
    (['플라나', 'planar'], 'planar'),
    (['비오곤', 'biogon'], 'biogon'),
    (['조나', 'sonnar'], 'sonnar'),
    (['디스타곤', 'distagon'], 'distagon'),
    (['테사', 'tessar'], 'tessar'),
    (['비오타', 'biotar'], 'biotar'),
    (['금계륵', '2470gm', '24-70 gm'], '2470gm'),

    # Generations & Variants
    (['8매', '8-element', 'eight element'], '8element'),
    (['리지드', 'rigid'], 'rigid'),
    (['침동', '침동식', 'collapsible'], 'collapsible'),
    (['복각', 'replica'], 'replica')
]

def parse_optical_tags(q):
    tags = []
    remaining = q.lower()
    for keys, tag in OPTICAL_TERMS_DICTIONARY:
        for k in keys:
            if k in remaining:
                if tag not in tags:
                    tags.append(tag)
                remaining = remaining.replace(k, ' ')
                break

    mm_match = re.search(r'(\d{2,3})\s*mm', remaining)
    if mm_match:
        tags.append(f'{mm_match.group(1)}mm')

    f_match = re.search(r'f\/?(\d(?:\.\d+)?)', remaining)
    if f_match:
        f_val = f_match.group(1).replace('.', '')
        tags.append(f'f{f_val}')

    words = re.findall(r'[a-z0-9]+', remaining)
    for w in words:
        if w not in tags and len(w) >= 3 and not w.endswith('mm'):
            tags.append(w)

    return tags


def scrape_flickr(query):
    photos = []
    tags = parse_optical_tags(query)
    
    candidates = []
    if len(tags) >= 2:
        candidates.append(f"{tags[0]},{tags[1]}")
    if tags:
        candidates.append(tags[0])
        if len(tags) > 1:
            candidates.append(tags[1])
    raw_clean = re.sub(r'[^a-zA-Z0-9]', '', query)
    if raw_clean:
        candidates.append(raw_clean)
        
    seen_urls = set()
    for cand in candidates[:3]:
        feed_url = f"https://api.flickr.com/services/feeds/photos_public.gne?tags={urllib.parse.quote(cand)}&format=json&nojsoncallback=1"
        data_str = fetch_url(feed_url, timeout=3)
        if data_str:
            try:
                data = json.loads(data_str)
                items = data.get("items", [])
                for item in items:
                    img_url = item.get("media", {}).get("m", "")
                    if not img_url or img_url in seen_urls:
                        continue
                    seen_urls.add(img_url)
                    high_url = img_url.replace("_m.", "_b.") if "_m." in img_url else img_url
                    author_raw = item.get("author", "")
                    author_match = re.search(r'"([^"]+)"', author_raw)
                    author = author_match.group(1) if author_match else "Flickr Photographer"
                    photos.append({
                        "url": high_url,
                        "thumb": img_url,
                        "title": item.get("title", f"{query} 실제 촬영 컷").strip() or f"{query} Sample",
                        "author": author,
                        "source": "Flickr",
                        "link": item.get("link", "https://www.flickr.com")
                    })
                    if len(photos) >= 8:
                        break
            except Exception:
                pass
        if len(photos) >= 6:
            break

    return photos


def scrape_lomography(query):
    photos = []
    # Lomography photos search
    clean_q = re.sub(r"[^\w\s-]", "", query).strip()
    url = f"https://www.lomography.com/search/photos?query={urllib.parse.quote(clean_q)}"
    html_doc = fetch_url(url, timeout=4)
    if html_doc:
        # Match lomography asset photos
        # pattern e.g. https://assets.lomography.com/photos/ or //assets.lomography.com/
        matches = re.findall(
            r'https?://assets\.lomography\.com/[^\s"\'<>]+\.(?:jpg|jpeg|png)',
            html_doc,
            re.IGNORECASE
        )
        seen = set()
        for img_url in matches:
            if "avatar" in img_url or "logo" in img_url or "icon" in img_url:
                continue
            if img_url not in seen:
                seen.add(img_url)
                photos.append({
                    "url": img_url,
                    "thumb": img_url,
                    "title": f"{query} Lomography Sample",
                    "author": "Lomography Community",
                    "source": "Lomography",
                    "link": url
                })
            if len(photos) >= 6:
                break
    return photos


def scrape_youtube(query):
    videos = []
    search_q = f"{query} 리뷰 review"
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(search_q)}"
    html_doc = fetch_url(url, timeout=4)
    if not html_doc:
        return videos

    # Find ytInitialData json object
    m = re.search(r"var ytInitialData = ({.*?});</script>", html_doc)
    if m:
        try:
            data = json.loads(m.group(1))
            contents = (
                data.get("contents", {})
                .get("twoColumnSearchResultsRenderer", {})
                .get("primaryContents", {})
                .get("sectionListRenderer", {})
                .get("contents", [])
            )
            for section in contents:
                item_section = section.get("itemSectionRenderer", {})
                for item in item_section.get("contents", []):
                    vr = item.get("videoRenderer")
                    if not vr:
                        continue
                    video_id = vr.get("videoId")
                    if not video_id:
                        continue
                    title = vr.get("title", {}).get("runs", [{}])[0].get("text", "")
                    channel = vr.get("ownerText", {}).get("runs", [{}])[0].get("text", "")
                    views = vr.get("viewCountText", {}).get("simpleText", "")
                    duration = vr.get("lengthText", {}).get("simpleText", "")
                    thumbs = vr.get("thumbnail", {}).get("thumbnails", [])
                    thumb_url = thumbs[-1].get("url") if thumbs else f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"

                    videos.append({
                        "videoId": video_id,
                        "title": title or f"{query} 실전 리뷰",
                        "channel": channel or "YouTube Creator",
                        "views": views or "YouTube",
                        "duration": duration or "YouTube",
                        "thumbnail": thumb_url,
                        "link": f"https://www.youtube.com/watch?v={video_id}"
                    })
                    if len(videos) >= 3:
                        break
                if len(videos) >= 3:
                    break
        except Exception:
            pass

    # Regex fallback if JSON parse failed
    if not videos:
        id_matches = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html_doc)
        seen = set()
        for vid in id_matches:
            if vid not in seen:
                seen.add(vid)
                videos.append({
                    "videoId": vid,
                    "title": f"{query} 실전 필드 촬영 & 심층 리뷰",
                    "channel": "YouTube Creator",
                    "views": "실제 영상",
                    "duration": "YouTube",
                    "thumbnail": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
                    "link": f"https://www.youtube.com/watch?v={vid}"
                })
            if len(videos) >= 3:
                break

    return videos


def scrape_naver_blogs(query):
    blogs = []
    search_q = f"{query} 사용기 리뷰"
    url = f"https://search.naver.com/search.naver?where=view&query={urllib.parse.quote(search_q)}"
    html_doc = fetch_url(url, timeout=4)
    if not html_doc:
        return blogs

    # Find blog/view article items
    # Typically <a class="name ...">author</a>, <a class="title_link ...">title</a>, <div class="dsc_link">snippet</div>
    items = re.findall(
        r'<a[^>]+class="[^"]*title_link[^"]*"[^>]+href="([^"]+)"[^>]*>(.*?)</a>',
        html_doc
    )
    
    seen = set()
    for link, raw_title in items:
        clean_title = html.unescape(re.sub(r"<[^>]+>", "", raw_title)).strip()
        if not clean_title or link in seen or "naver.me" in link:
            continue
        seen.add(link)
        
        blogs.append({
            "title": clean_title,
            "author": "네이버 블로그 리뷰어",
            "snippet": f"'{query}' 실사용 출사 후기 및 결과물 분석 포스팅입니다.",
            "link": link
        })
        if len(blogs) >= 2:
            break

    return blogs


def generate_optical_brief(query):
    """
    Generates intelligent optical specifications and photography characteristics
    for any camera/lens model dynamically.
    """
    q_lower = query.lower()
    
    # Defaults
    category = "광학 렌즈 / 카메라 바디"
    focal = "표준 초점거리"
    aperture = "F1.4 ~ F2.8"
    chars = f"'{query}' 고유의 광학 설계로 뛰어난 피사체 분리력과 자연스러운 배경 흐림을 구현합니다."
    pros = "풍부한 계조 표현력과 안정적인 중심부 해상력"
    cons = "촬영 환경에 따른 역광 플레어 제어 및 조리개 개방부 수차 확인 필요"
    recommend = "인물 포트레이트, 감성 일상 스냅, 풍경 출사"
    pro_tip = f"조리개를 1~2스탑 조였을 때(F2.8~F4) 최상의 해상력과 안정적인 콘트라스트를 얻을 수 있습니다."

    if "50mm" in q_lower or "58mm" in q_lower or "55mm" in q_lower:
        focal = "50mm 대 표준 단렌즈"
        recommend = "인물 상반신 포트레이트, 카페 감성 스냅"
    elif "35mm" in q_lower or "28mm" in q_lower:
        focal = "광각 / 준광각 단렌즈"
        recommend = "도심 스트리트 스냅, 여행 일상 기록, 풍경"
    elif "85mm" in q_lower or "135mm" in q_lower:
        focal = "망원 인물 전용 단렌즈"
        recommend = "야외 인물 전신 아웃포커싱, 무대/공연 스냅"
    elif "24-70" in q_lower or "24-105" in q_lower:
        focal = "올라운드 표준 줌렌즈"
        recommend = "상업 사진, 행사 스케치, 여행 원렌즈"

    if "타쿠마" in query or "takumar" in q_lower:
        chars = "토륨 글래스 특유의 앰버 골드 톤과 역광에서 펼쳐지는 화려한 무지개(Rainbow) 링 플레어가 특징입니다."
        pros = "M42 스크류 마운트로 현대 미러리스 이종교배 호환성 최상, 부드러운 하이라이트 번짐"
        cons = "오래된 연식으로 인한 황변(UV 탈색 필요) 및 렌즈 알 곰팡이/발삼 분리 주의"
        pro_tip = "강한 역광 태양광을 렌즈 테두리에 살짝 걸쳐 촬영하면 영화 같은 골든 플레어를 연출할 수 있습니다."
    elif "헬리오스" in query or "helios" in q_lower:
        chars = "짜이즈 비오타(Biotar) 광학계를 복각한 소비에트 명기로, 최대 개방 시 독보적인 회오리 보케(Swirly Bokeh)를 자랑합니다."
        pros = "몽환적인 배경 흐림과 개성 넘치는 인물 감성 사진 연출"
        cons = "주변부 비네팅 및 저조도 환경에서 소프트한 해상도"
        pro_tip = "배경에 나뭇잎 사이로 들어오는 햇살(빛망울)을 두고 피사체와 거리를 1.5m 내외로 두면 회오리 보케가 극대화됩니다."
    elif "라이카" in query or "leica" in q_lower:
        chars = "전통의 라이카 광학 설계로 마이크로 콘트라스트와 생생한 입체감, 독보적인 컬러 렌더링을 제공합니다."
        pros = "컴팩트한 크기 대비 극상의 선예도와 중고 시세 방어력"
        cons = "높은 가격대 및 완전 수동 조작에 따른 숙련도 필요"
        pro_tip = "최대 개방에서도 피사체의 윤곽이 또렷하므로 심도를 얕게 활용한 감성 인물 촬영에 제격입니다."

    return {
        "modelName": query,
        "category": category,
        "sensorSpec": f"추천 규격: {focal} | 개방 수치: {aperture}",
        "characteristics": chars,
        "pros": pros,
        "cons": cons,
        "recommendTo": recommend,
        "proTip": pro_tip
    }


def scrape_naver_images(query):
    photos = []
    search_q = f"{query} 작례"
    url = f"https://search.naver.com/search.naver?where=image&query={urllib.parse.quote(search_q)}"
    html_doc = fetch_url(url, timeout=4)
    if not html_doc:
        return photos

    # Naver image search HTML parser
    img_matches = re.findall(
        r'<img[^>]+(?:src|data-source)=["\'](https://search\.pstatic\.net/[^"\']+)["\'][^>]*alt=["\']([^"\']+)["\']',
        html_doc
    )
    if not img_matches:
        img_matches = re.findall(
            r'<img[^>]+alt=["\']([^"\']+)["\'][^>]+(?:src|data-source)=["\'](https://search\.pstatic\.net/[^"\']+)["\']',
            html_doc
        )
        img_matches = [(url, alt) for alt, url in img_matches]

    seen = set()
    for img_url, title in img_matches:
        if "icon" in img_url or "blank" in img_url or "static" in title.lower():
            continue
        clean_title = html.unescape(title).strip()
        if not clean_title:
            clean_title = f"{query} 네이버 실제 작례"
        if img_url not in seen:
            seen.add(img_url)
            photos.append({
                "url": img_url,
                "thumb": img_url,
                "title": clean_title,
                "author": "네이버 출사 블로그",
                "source": "Naver Image",
                "link": f"https://search.naver.com/search.naver?where=image&query={urllib.parse.quote(search_q)}"
            })
        if len(photos) >= 8:
            break

    return photos


def execute_search(query):
    """Executes multi-threaded parallel crawling across Flickr, Naver Images, Lomography, YouTube, Naver Blogs."""
    results = {
        "success": True,
        "query": query,
        "photos": [],
        "videos": [],
        "blogs": [],
        "brief": generate_optical_brief(query)
    }

    with ThreadPoolExecutor(max_workers=5) as executor:
        f_naver_img = executor.submit(scrape_naver_images, query)
        f_flickr = executor.submit(scrape_flickr, query)
        f_lomo = executor.submit(scrape_lomography, query)
        f_yt = executor.submit(scrape_youtube, query)
        f_naver = executor.submit(scrape_naver_blogs, query)

        try:
            results["photos"].extend(f_naver_img.result(timeout=6))
        except Exception as e:
            print(f"[Crawler] Naver Image error: {e}")

        try:
            results["photos"].extend(f_flickr.result(timeout=6))
        except Exception as e:
            print(f"[Crawler] Flickr error: {e}")

        try:
            results["photos"].extend(f_lomo.result(timeout=6))
        except Exception as e:
            print(f"[Crawler] Lomography error: {e}")

        try:
            results["videos"] = f_yt.result(timeout=6)
        except Exception as e:
            print(f"[Crawler] YouTube error: {e}")

        try:
            results["blogs"] = f_naver.result(timeout=6)
        except Exception as e:
            print(f"[Crawler] Naver Blog error: {e}")

    # Remove duplicate photos by URL
    unique_photos = []
    seen_urls = set()
    for p in results["photos"]:
        if p["url"] not in seen_urls:
            seen_urls.add(p["url"])
            unique_photos.append(p)
    results["photos"] = unique_photos[:10]

    return results


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True


class RealtimeCrawlerHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        # Mandatory CORS headers for seamless browser access from file:/// or localhost
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        # Health check
        if path == "/api/health" or path == "/":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            resp = {
                "status": "online",
                "service": "FRAME Camera & Lens Realtime Crawler Server",
                "version": "1.0.0",
                "endpoints": ["/api/health", "/api/search?q={query}"]
            }
            self.wfile.write(json.dumps(resp, ensure_ascii=False).encode("utf-8"))
            return

        # Realtime Sample Crawl Search Endpoint
        if path == "/api/search" or path == "/api/samples":
            query = params.get("q", [""])[0].strip() or params.get("query", [""])[0].strip()
            if not query:
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing 'q' query parameter"}).encode("utf-8"))
                return

            print(f"[Crawler] Incoming search request for: '{query}'")
            try:
                data = execute_search(query)
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))
                print(f"[Crawler] Completed '{query}': {len(data['photos'])} photos, {len(data['videos'])} videos, {len(data['blogs'])} blogs")
            except Exception as e:
                print(f"[Crawler] Exception while searching: {e}")
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        # Clean terminal logging
        sys.stderr.write(f"[Server] {self.address_string()} - {format % args}\n")


def run_server(port=PORT):
    server_address = ("", port)
    try:
        httpd = ThreadedHTTPServer(server_address, RealtimeCrawlerHandler)
        print("=" * 64)
        print("  📷 FRAME AI Real-Time Camera & Lens Crawler Server")
        print("=" * 64)
        print(f"  ● Running at: http://localhost:{port}")
        print(f"  ● Healthcheck: http://localhost:{port}/api/health")
        print(f"  ● Search API:  http://localhost:{port}/api/search?q=모델명")
        print("  ● Features:    Flickr, Lomography, YouTube, Naver Blog Scraper")
        print("=" * 64)
        print("  서버가 실행 중입니다. 브라우저에서 검색 시 실시간으로 작례를 크롤링합니다.")
        print("  (종료하려면 터미널에서 Ctrl+C를 누르세요)\n")
        httpd.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"[Server] Port {port} is in use, trying {port + 1}...")
            run_server(port + 1)
        else:
            raise e
    except KeyboardInterrupt:
        print("\n[Server] Shutting down crawler server...")
        httpd.server_close()


if __name__ == "__main__":
    port_arg = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else PORT
    run_server(port_arg)
