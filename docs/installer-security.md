# Installer and example integrity

## Trust boundary

Review `install.sh` or `install.ps1` before execution. Each installer embeds a
reviewed full Git commit ID and a SHA-256 digest for its platform's archive.
Downloaded bytes must match **before extraction or writes to skill directories**.
Failure stops installation; there is no fallback to `main` or checksum bypass.
GitHub archive-byte changes also fail closed, even if file contents are unchanged.

The digest is a trust anchor in the reviewed script, not a publisher signature.
It does not protect someone who runs a compromised installer without reviewing
it. For a reproducible bootstrap, download the installer itself using a full
commit ID in the raw GitHub URL rather than `main`.

Re-running a saved installer installs the same pinned payload, not the latest
branch. Review a newly published installer to obtain an updated payload. The
installer commit can intentionally follow its payload commit: this avoids a
self-referential archive checksum.

`ANYVIZ_SOURCE_DIR` is an explicit local-development path. It copies that local
source without archive verification. Use only a directory you have reviewed;
this option does not establish trust in an arbitrary downloaded directory.

## Updating the payload pins

1. Review and test the payload changes, then push that commit.
2. Obtain its full 40-character ID with `git rev-parse HEAD`.
3. Download `https://codeload.github.com/TseringYuu/anyviz/tar.gz/COMMIT` and
   `https://codeload.github.com/TseringYuu/anyviz/zip/COMMIT` over HTTPS. Inspect
   their contents against the reviewed commit; do not hash an unreviewed branch.
4. Compute SHA-256 with `shasum -a 256` (or `sha256sum` / `Get-FileHash`). Update
   `SOURCE_COMMIT` / `ARCHIVE_SHA256` in `install.sh` and `SourceCommit` /
   `ArchiveSha256` in `install.ps1` together. Never download a checksum from the
   same mutable URL at installation time.
5. Run `npm run validate` and the PowerShell test on Windows:
   `pwsh -File scripts/test_install.ps1`. Exercise actual downloaded archives
   in a temporary `ANYVIZ_HOME` with `ANYVIZ_DETECT_COMMANDS=0`. Do not use a real
   agent home for testing. Commit the installer pin changes separately.

The shell and Windows tests cover successful verified installation, tampered
archive rejection, and preserving an existing installation on failure. The
local-source shell test also covers update and backup behavior.

## Dashboard CDN dependency

The four dashboards pin ECharts 5.5.1 and use SHA-384 Subresource Integrity plus
`crossorigin="anonymous"`. The hash was verified against `dist/echarts.min.js`
in the npm package for that exact version. A changed CDN response is blocked
by the browser; there is no insecure fallback. CDN availability is still needed.

When changing ECharts, review the new version, compare the CDN bytes against
the published package, update the URL and SRI value together in all four HTML
files and the showcase contract, and test rendering in a browser. SRI checks
bytes, not whether a library version is free of vulnerabilities.
