import tempfile
import unittest
from pathlib import Path

import refresh


class ConfigLoadingTests(unittest.TestCase):
    def test_load_projects_reports_actionable_setup_error(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            original_script_dir = refresh.SCRIPT_DIR
            refresh.SCRIPT_DIR = Path(tmpdir)
            try:
                with self.assertRaises(FileNotFoundError) as context:
                    refresh.load_projects()
            finally:
                refresh.SCRIPT_DIR = original_script_dir

        self.assertIn("projects.example.json", str(context.exception))
        self.assertIn("projects.json", str(context.exception))

    def test_build_data_handles_empty_projects_config(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            (root / "projects.json").write_text("[]", encoding="utf-8")
            original_script_dir = refresh.SCRIPT_DIR
            refresh.SCRIPT_DIR = root
            try:
                data = refresh.build_data()
            finally:
                refresh.SCRIPT_DIR = original_script_dir

        self.assertEqual(data["projects"], [])


class RoadmapParsingTests(unittest.TestCase):
    def test_extract_section_stops_at_next_heading(self):
        text = """# Intro

## Next Steps
- [ ] First
- [x] Done

## Other
- Ignore me
"""
        self.assertEqual(
            refresh.extract_section(text, "Next Steps").strip(),
            "- [ ] First\n- [x] Done",
        )

    def test_parse_checkboxes_counts_done_and_pending(self):
        result = refresh.parse_checkboxes("- [ ] One\n- [x] Two\n- [ ] Three")
        self.assertEqual(result["done"], 1)
        self.assertEqual(result["total"], 3)
        self.assertEqual(result["pending"], ["One", "Three"])

    def test_parse_next_steps_accepts_ordered_and_bulleted_lists(self):
        result = refresh.parse_next_steps("1. One\n- Two\n* Three")
        self.assertEqual(result, {"done": 0, "total": 3, "pending": ["One", "Two", "Three"]})

    def test_parse_phase_status_reads_phase_headings(self):
        text = "## ✅ Phase 1 — shipped\n### ⬜ Phase 2 — next\n#### ⬜ Phase 3"
        result = refresh.parse_phase_status(text)
        self.assertEqual(result["done"], 1)
        self.assertEqual(result["total"], 3)
        self.assertEqual(result["pending"], ["Phase 2", "Phase 3"])


class RoadmapLoadingTests(unittest.TestCase):
    def test_load_roadmap_reports_missing_file(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            roadmap, status, error = refresh.load_roadmap(
                tmpdir,
                {"file": "ROADMAP.md", "section": "Next Steps", "mode": "checkboxes"},
            )
        self.assertIsNone(roadmap)
        self.assertEqual(status, "missing_file")
        self.assertIn("Roadmap file not found", error)

    def test_load_roadmap_reports_missing_section(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            (root / "ROADMAP.md").write_text("# Intro\n\n## Other\n- [ ] Later\n", encoding="utf-8")
            roadmap, status, error = refresh.load_roadmap(
                tmpdir,
                {"file": "ROADMAP.md", "section": "Next Steps", "mode": "checkboxes"},
            )
        self.assertIsNone(roadmap)
        self.assertEqual(status, "missing_section")
        self.assertIn("Next Steps", error)

    def test_load_roadmap_returns_absolute_path_when_successful(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            roadmap_file = root / "ROADMAP.md"
            roadmap_file.write_text("## Next Steps\n- [ ] Ship it\n", encoding="utf-8")
            roadmap, status, error = refresh.load_roadmap(
                tmpdir,
                {"file": "ROADMAP.md", "section": "Next Steps", "mode": "checkboxes"},
            )
        self.assertEqual(status, "ok")
        self.assertIsNone(error)
        self.assertEqual(roadmap["path"], str(roadmap_file))
        self.assertEqual(roadmap["pending"], ["Ship it"])


class CollectProjectTests(unittest.TestCase):
    def test_collect_project_keeps_work_archived_and_missing_status(self):
        result = refresh.collect_project(
            {
                "id": "missing",
                "description": "Missing path",
                "tech": ["Python"],
                "path": "/definitely/not/here",
                "work": True,
                "archived": True,
            }
        )
        self.assertTrue(result["work"])
        self.assertTrue(result["archived"])
        self.assertFalse(result["exists"])
        self.assertEqual(result["status"], "missing_path")
        self.assertIn("Project path not found", result["error"])
        self.assertEqual(result["stash_count"], 0)

    def test_collect_project_marks_non_git_directories(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            result = refresh.collect_project(
                {
                    "id": "plain-dir",
                    "description": "No git",
                    "tech": ["Docs"],
                    "path": tmpdir,
                    "roadmap": {"file": "ROADMAP.md", "section": None, "mode": "checkboxes"},
                }
            )
        self.assertTrue(result["exists"])
        self.assertEqual(result["status"], "no_git")
        self.assertEqual(result["roadmap_status"], "missing_file")
        self.assertFalse(result["is_git"])


if __name__ == "__main__":
    unittest.main()
