#!/usr/bin/env python3
"""anyvis Logo 多概念变体批量生成"""
import os
os.environ['no_proxy'] = 'api.apiyi.com,apiyi.com'

import requests, base64, time
from datetime import date

API_KEY = "sk-sF92L3srClHS1Hiq972f4c3bC9154fD298D02b20Ad4c0160"
API_URL = "https://api.apiyi.com/v1/images/generations"
OUTPUT_DIR = "/Volumes/A/aiworkspace/apps/anyvis/design/logo"
LOGO_SIZE = "2880x2880"  # 1:1 Square
TODAY = date.today().strftime("%m%d")

variants = {
    # ========== 概念 1：数据棱镜 ==========
    "v1_数据棱镜": """极简科技Logo设计。中央一个几何棱镜/透镜形状，左侧是散乱的小圆点（原始数据），经过棱镜后右侧变成有序的柱状图和折线——象征数据经过anyvis转化为清晰洞察。配色：棱镜用渐变蓝#4269d0到紫#a463f2，左侧散点用微妙的灰色，右侧图表元素用蓝绿珊瑚三色#4269d0 #3ca951 #ff725c。白色或极浅灰背景。无文字。矢量扁平风格，干净锐利边缘。留白充足。适合app icon和favicon。""",

    # ========== 概念 2：洞察之眼 ==========
    "v2_洞察之眼": """极简科技Logo。抽象的眼睛形状——外轮廓是流畅的弧线，瞳孔由三个同心圆环构成，分别带有微小的柱状图刻度、折线节点和散点标记，象征"看见数据"。虹膜使用蓝到紫的渐变#4269d0→#a463f2，瞳孔为一个亮珊瑚色圆点#ff725c。白色背景。整体圆形构图，大量留白。线条干净精确，现代科技感。无文字。""",

    # ========== 概念 3：数据之波 ==========
    "v3_数据之波": """极简科技Logo。从左侧的噪声/散点（灰色小圆点散布），经过一条平滑的正弦波形线，过渡到右侧整齐的柱状图——象征从混乱数据到清晰可视化的转变。波形线使用品牌蓝色#4269d0渐变到紫色#a463f2。柱状图三根柱子分别用蓝#4269d0、绿#3ca951、珊瑚#ff725c。白色背景。线条粗细2-3px，干净利落。水平构图，无文字。现代极简风格。""",

    # ========== 概念 4：AV图形标 ==========
    "v4_AV图形标": """极简Logo设计。抽象的字母组合——上方"V"字形由两根交汇的上升折线构成（数据趋势向上的感觉），下方"A"字形由数据点和短线暗示。整个图形是一个连贯的图表元素组成。使用品牌蓝色#4269d0为主色，折线端点和节点用珊瑚色#ff725c和绿色#3ca951点缀。白色背景。无衬线几何风格，线条粗细统一，大量留白。高度抽象但可辨识为图表元素构成的字母。无文字。""",

    # ========== 概念 5：数据星环 ==========
    "v5_数据星环": """极简科技Logo。一个完美的圆形轨道，轨道上分布着不同大小的数据点（圆点），其中3个较大的节点分别用蓝色#4269d0、绿色#3ca951、珊瑚色#ff725c标记。轨道中心是一个小型紫色星形或菱形#a463f2——象征anyvis是连接多种数据源和输出格式的中心枢纽。轨道线使用细线灰色#CCCCCC。白色背景。整体圆形构图，对称中有不对称。现代科技感，适合品牌标识。无文字。""",
}

HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
session = requests.Session()
session.trust_env = False

total = len(variants)
ok = fail = 0
os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"=== anyvis Logo 批量生成 ({total}张) ===")
print(f"输出: {OUTPUT_DIR}")
print(f"预计耗时: {total*90}-{total*150}秒\n")

for i, (name, prompt) in enumerate(variants.items(), 1):
    path = os.path.join(OUTPUT_DIR, f"anyvis_logo_{name}_{TODAY}.png")
    if os.path.exists(path) and os.path.getsize(path) > 500_000:
        print(f"[{i}/{total}] {name} — 已存在，跳过")
        ok += 1
        continue

    print(f"[{i}/{total}] {name} — 生成中...", flush=True)
    payload = {
        "model": "gpt-image-2-vip",
        "prompt": prompt,
        "n": 1,
        "size": LOGO_SIZE,
        "response_format": "b64_json"
    }

    try:
        resp = session.post(API_URL, headers=HEADERS, json=payload, timeout=300)
        if resp.status_code == 200:
            data = resp.json()
            b64 = data["data"][0]["b64_json"]
            if b64.startswith("data:"):
                b64 = b64.split(",", 1)[1]
            with open(path, "wb") as f:
                f.write(base64.b64decode(b64))
            size_mb = os.path.getsize(path) / 1024 / 1024
            elapsed = resp.elapsed.total_seconds()
            print(f"  ✓ 完成 ({elapsed:.0f}s, {size_mb:.1f}MB)", flush=True)
            ok += 1
        else:
            print(f"  ✗ HTTP {resp.status_code}: {resp.text[:200]}", flush=True)
            fail += 1
    except Exception as e:
        print(f"  ✗ 异常: {e}", flush=True)
        fail += 1

    if i < total:
        wait = 15
        print(f"  ⏳ 等待 {wait}s...", flush=True)
        time.sleep(wait)

cost = ok * 0.03
print(f"\n{'='*50}")
print(f"完成: 成功 {ok}/{total}, 失败 {fail}")
print(f"成本: ${cost:.2f}")
print(f"输出目录: {OUTPUT_DIR}")
