#!/usr/bin/env python3
"""
AnyVis 主题一致性验证器

验证生成的图表配置是否符合 AnyVis 默认美学规范，
以及多图表之间的一致性。

用法:
    python theme_validator.py --config chart_config.json
    python theme_validator.py --config chart_config.json --multi-chart
"""

import json
import sys
import argparse
from typing import Dict, List, Any, Optional, Tuple


# 从 default.json 加载的参考规范
DEFAULT_SPEC = {
    "typography": {
        "h1": {"size_px": 16, "weight": 600, "color": "#1A1A1A"},
        "h2": {"size_px": 13, "weight": 400, "color": "#555555"},
        "h3": {"size_px": 11, "weight": 400, "color": "#333333"},
        "h4": {"size_px": 10, "weight": 400, "color": "#666666"},
        "h5": {"size_px": 10, "weight": 400, "color": "#555555"},
        "h6": {"size_px": 9, "weight": 400, "color": "#888888"},
    },
    "spacing": {
        "chart_margin": {"top": 40, "right": 30, "bottom": 50, "left": 60}
    },
    "stroke": {
        "line": {"width_px": 2.0},
        "grid": {"width_px": 0.5, "color": "#E0E0E0"},
    },
    "color": {
        "categorical_palette": [
            "#4269d0", "#3ca951", "#ff725c", "#a463f2", "#efb118",
            "#6cc5b0", "#9696a0", "#f5a623", "#ca5bb8", "#ff8ab7"
        ]
    }
}


def load_config(path: str) -> Dict:
    with open(path, 'r') as f:
        return json.load(f)


def validate_typography(config: Dict) -> List[str]:
    """验证排版参数是否符合规范"""
    issues = []
    typo = config.get("typography", {})

    for level in ["h1", "h2", "h3", "h4", "h5", "h6"]:
        level_config = typo.get(level, {})
        spec = DEFAULT_SPEC["typography"][level]

        actual_size = level_config.get("size_px")
        if actual_size is not None and actual_size != spec["size_px"]:
            issues.append(
                f"[排版] {level} 字号: 期望 {spec['size_px']}px, "
                f"实际 {actual_size}px — 如非用户指定，请统一"
            )

        actual_weight = level_config.get("weight")
        if actual_weight is not None and actual_weight != spec["weight"]:
            issues.append(
                f"[排版] {level} 字重: 期望 {spec['weight']}, "
                f"实际 {actual_weight}"
            )

    return issues


def validate_spacing(config: Dict) -> List[str]:
    """验证间距参数是否符合规范"""
    issues = []
    spacing = config.get("spacing", {})
    margin = spacing.get("chart_margin", {})
    spec = DEFAULT_SPEC["spacing"]["chart_margin"]

    for key in ["top", "right", "bottom", "left"]:
        actual = margin.get(key)
        expected = spec[key]
        if actual is not None and actual != expected:
            issues.append(
                f"[间距] chart_margin.{key}: 期望 {expected}px, "
                f"实际 {actual}px"
            )

    return issues


def validate_stroke(config: Dict) -> List[str]:
    """验证线条样式是否符合规范"""
    issues = []
    stroke = config.get("stroke", {})

    line = stroke.get("line", {})
    spec_line = DEFAULT_SPEC["stroke"]["line"]
    if "width_px" in line and line["width_px"] != spec_line["width_px"]:
        issues.append(
            f"[线条] 线宽: 期望 {spec_line['width_px']}px, "
            f"实际 {line['width_px']}px"
        )

    grid = stroke.get("grid", {})
    spec_grid = DEFAULT_SPEC["stroke"]["grid"]
    if "color" in grid and grid["color"] != spec_grid["color"]:
        issues.append(
            f"[网格] 颜色: 期望 {spec_grid['color']}, "
            f"实际 {grid['color']}"
        )
    if "width_px" in grid and grid["width_px"] != spec_grid["width_px"]:
        issues.append(
            f"[网格] 线宽: 期望 {spec_grid['width_px']}px, "
            f"实际 {grid['width_px']}px"
        )

    return issues


def validate_color_palette(config: Dict) -> List[str]:
    """验证色板是否在默认色板范围内"""
    issues = []
    palette = config.get("color", {}).get("categorical_palette", [])
    default = DEFAULT_SPEC["color"]["categorical_palette"]

    if palette and palette != default:
        # 不强制要求完全一致，但提醒检查
        issues.append(
            "[色板] 色板与默认值不同 — 请确认是否为用户定制"
        )

    return issues


def validate_multi_chart_consistency(charts: List[Dict]) -> List[str]:
    """验证多图表之间的一致性"""
    issues = []
    if len(charts) < 2:
        return issues

    # 提取每个图表的排版参数
    typographies = []
    for i, chart in enumerate(charts):
        typo = chart.get("typography", {})
        typographies.append({
            "index": i,
            "name": chart.get("name", f"Chart {i+1}"),
            "h1_size": typo.get("h1", {}).get("size_px"),
            "h1_color": typo.get("h1", {}).get("color"),
            "h4_size": typo.get("h4", {}).get("size_px"),
            "h4_color": typo.get("h4", {}).get("color"),
            "h5_size": typo.get("h5", {}).get("size_px"),
            "h6_size": typo.get("h6", {}).get("size_px"),
        })

    # 检查标题一致性
    h1_sizes = set(t["h1_size"] for t in typographies if t["h1_size"])
    if len(h1_sizes) > 1:
        issues.append(
            f"[一致性-标题] 多图表标题字号不一致: {h1_sizes}"
        )

    h1_colors = set(t["h1_color"] for t in typographies if t["h1_color"])
    if len(h1_colors) > 1:
        issues.append(
            f"[一致性-标题] 多图表标题颜色不一致: {h1_colors}"
        )

    # 检查刻度标签一致性
    h4_sizes = set(t["h4_size"] for t in typographies if t["h4_size"])
    if len(h4_sizes) > 1:
        issues.append(
            f"[一致性-刻度] 多图表刻度字号不一致: {h4_sizes}"
        )

    # 检查图例一致性
    h5_sizes = set(t["h5_size"] for t in typographies if t["h5_size"])
    if len(h5_sizes) > 1:
        issues.append(
            f"[一致性-图例] 多图表图例字号不一致: {h5_sizes}"
        )

    # 检查颜色映射一致性
    color_mappings = []
    for chart in charts:
        cm = chart.get("color_mapping", {})
        if cm:
            color_mappings.append(cm)

    if len(color_mappings) > 1:
        keys = set()
        for cm in color_mappings:
            keys.update(cm.keys())

        for key in keys:
            values = set()
            for cm in color_mappings:
                if key in cm:
                    values.add(cm[key])
            if len(values) > 1:
                issues.append(
                    f"[一致性-颜色] 实体 '{key}' 在不同图表中颜色不一致: {values}"
                )

    # 检查间距一致性
    margins = []
    for chart in charts:
        m = chart.get("spacing", {}).get("chart_margin", {})
        if m:
            margins.append(m)

    if len(margins) > 1:
        for key in ["top", "right", "bottom", "left"]:
            values = set(m.get(key) for m in margins if m.get(key) is not None)
            if len(values) > 1:
                issues.append(
                    f"[一致性-间距] margin.{key} 不一致: {values}"
                )

    return issues


def main():
    parser = argparse.ArgumentParser(
        description="AnyVis 主题一致性验证器"
    )
    parser.add_argument(
        "--config", "-c", required=True,
        help="图表配置 JSON 文件路径"
    )
    parser.add_argument(
        "--multi-chart", "-m", action="store_true",
        help="多图表模式，额外检查图表间一致性"
    )
    args = parser.parse_args()

    config = load_config(args.config)

    all_issues = []

    # 单图表验证
    if args.multi_chart:
        charts = config.get("charts", [config])
    else:
        charts = [config]

    for chart in charts:
        all_issues.extend(validate_typography(chart))
        all_issues.extend(validate_spacing(chart))
        all_issues.extend(validate_stroke(chart))
        all_issues.extend(validate_color_palette(chart))

    # 多图表一致性验证
    if args.multi_chart and len(charts) > 1:
        all_issues.extend(validate_multi_chart_consistency(charts))

    # 输出结果
    if all_issues:
        print(f"❌ 发现 {len(all_issues)} 个问题：\n")
        for issue in all_issues:
            print(f"  • {issue}")
        print(f"\n共 {len(all_issues)} 个问题需要处理。")
        sys.exit(1)
    else:
        print("✅ 所有检查通过！图表配置符合 AnyVis 默认美学规范。")
        sys.exit(0)


if __name__ == "__main__":
    main()
