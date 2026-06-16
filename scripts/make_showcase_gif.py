#!/usr/bin/env python3
"""Render the Remotion showcase to MP4 and assets/showcase.gif."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import argparse
import os
import shutil
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[1]
SHOWCASE_DIR = ROOT / "showcase-remotion"
ENTRY_POINT = SHOWCASE_DIR / "src" / "index.ts"
DEFAULT_VIDEO_OUTPUT = Path("assets/showcase.mp4")
DEFAULT_GIF_OUTPUT = Path("assets/showcase.gif")


@dataclass(frozen=True)
class RenderPlan:
    composition_id: str
    entry_point: Path
    remotion_dir: Path
    video_output: Path
    gif_output: Path
    ffmpeg_bin: str
    fps: int
    width: int


def ensure_tool(binary: str) -> str:
    resolved = shutil.which(binary)
    if not resolved:
        raise FileNotFoundError(f"Required tool not found in PATH: {binary}")
    return resolved


def build_render_plan(
    *,
    composition_id: str = "Showcase",
    video_output: Path = DEFAULT_VIDEO_OUTPUT,
    gif_output: Path = DEFAULT_GIF_OUTPUT,
    ffmpeg_bin: str | None = None,
    fps: int = 12,
    width: int = 960,
) -> RenderPlan:
    return RenderPlan(
        composition_id=composition_id,
        entry_point=ENTRY_POINT,
        remotion_dir=SHOWCASE_DIR,
        video_output=video_output,
        gif_output=gif_output,
        ffmpeg_bin=ffmpeg_bin or ensure_tool("ffmpeg"),
        fps=fps,
        width=width,
    )


def run(cmd: list[str], cwd: Path | None = None) -> None:
    print(f"$ {' '.join(cmd)}")
    subprocess.run(cmd, cwd=cwd, check=True)


def render_video(plan: RenderPlan) -> Path:
    output = ROOT / plan.video_output
    output.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            "npx",
            "remotion",
            "render",
            str(plan.entry_point),
            plan.composition_id,
            str(output),
        ],
        cwd=plan.remotion_dir,
    )
    return output


def render_gif(plan: RenderPlan, source_video: Path) -> Path:
    output = ROOT / plan.gif_output
    output.parent.mkdir(parents=True, exist_ok=True)
    scale = f"{plan.width}:-1:flags=lanczos"

    with tempfile.TemporaryDirectory(prefix="anyviz-showcase-") as tmp:
        palette = Path(tmp) / "palette.png"
        run(
            [
                plan.ffmpeg_bin,
                "-y",
                "-i",
                str(source_video),
                "-vf",
                f"fps={plan.fps},scale={scale},palettegen=stats_mode=full",
                str(palette),
            ]
        )
        run(
            [
                plan.ffmpeg_bin,
                "-y",
                "-i",
                str(source_video),
                "-i",
                str(palette),
                "-lavfi",
                f"fps={plan.fps},scale={scale}[x];[x][1:v]paletteuse=dither=sierra2_4a",
                str(output),
            ]
        )
    return output


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Render anyviz showcase from Remotion to MP4 and GIF."
    )
    parser.add_argument("--composition-id", default="Showcase")
    parser.add_argument("--video-output", default=str(DEFAULT_VIDEO_OUTPUT))
    parser.add_argument("--gif-output", default=str(DEFAULT_GIF_OUTPUT))
    parser.add_argument("--fps", type=int, default=12, help="GIF frame rate.")
    parser.add_argument("--width", type=int, default=960, help="GIF output width.")
    parser.add_argument(
        "--skip-video",
        action="store_true",
        help="Reuse the existing MP4 at --video-output and only regenerate the GIF.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    os.chdir(ROOT)
    plan = build_render_plan(
        composition_id=args.composition_id,
        video_output=Path(args.video_output),
        gif_output=Path(args.gif_output),
        fps=args.fps,
        width=args.width,
    )

    if not plan.entry_point.exists():
        raise FileNotFoundError(f"Remotion entry point not found: {plan.entry_point}")

    video = ROOT / plan.video_output
    if args.skip_video:
        if not video.exists():
            raise FileNotFoundError(f"Video does not exist: {video}")
    else:
        video = render_video(plan)

    gif = render_gif(plan, video)
    print(f"Rendered showcase video: {video.relative_to(ROOT)}")
    print(f"Rendered showcase gif: {gif.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print("Interrupted", file=sys.stderr)
        raise SystemExit(130)
