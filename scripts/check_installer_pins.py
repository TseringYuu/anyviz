#!/usr/bin/env python3
"""Offline structural guard for the installer trust anchors (not a rescan)."""
from pathlib import Path
import re
root = Path(__file__).resolve().parents[1]
sh = (root / 'install.sh').read_text()
ps = (root / 'install.ps1').read_text()
sh_commit = re.search(r'^SOURCE_COMMIT="([0-9a-f]{40})"$', sh, re.M).group(1)
ps_commit = re.search(r'^\$SourceCommit = "([0-9a-f]{40})"$', ps, re.M).group(1)
assert sh_commit == ps_commit, 'Shell and PowerShell must install the same snapshot'
assert re.search(r'^ARCHIVE_SHA256="[0-9a-f]{64}"$', sh, re.M)
assert re.search(r'^\$ArchiveSha256 = "[0-9a-f]{64}"$', ps, re.M)
assert 'refs/heads/' not in sh + ps
assert sh.index('archive SHA-256 mismatch') < sh.index('tar -xzf')
assert ps.index('archive SHA-256 mismatch') < ps.index('Expand-Archive -Path')
assert 'https://codeload.github.com/${REPOSITORY}/tar.gz/${SOURCE_COMMIT}' in sh
assert 'https://codeload.github.com/$Repository/zip/$SourceCommit' in ps
print('Installer pins agree; integrity checks precede extraction.')
