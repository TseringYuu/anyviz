import importlib.util
from pathlib import Path
import sys
import unittest


spec = importlib.util.spec_from_file_location(
    "make_showcase_gif",
    Path(__file__).resolve().parents[1] / "scripts" / "make_showcase_gif.py",
)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)


class ShowcaseGifScriptConfigTest(unittest.TestCase):
    def test_default_outputs_live_under_assets(self):
        cfg = module.build_render_plan(ffmpeg_bin="/usr/bin/ffmpeg")
        self.assertEqual(cfg.composition_id, "Showcase")
        self.assertEqual(cfg.video_output, Path("assets/showcase.mp4"))
        self.assertEqual(cfg.gif_output, Path("assets/showcase.gif"))
        self.assertEqual(cfg.fps, 12)
        self.assertEqual(cfg.width, 960)
        self.assertIn("showcase-remotion", str(cfg.entry_point))


if __name__ == "__main__":
    unittest.main()
