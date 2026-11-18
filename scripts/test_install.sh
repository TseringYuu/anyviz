#!/bin/sh

set -eu

PROJECT_ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/anyviz-install-test.XXXXXX")"
TEST_HOME="$TEST_ROOT/home"

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT HUP INT TERM

mkdir -p \
  "$TEST_HOME/.claude/skills/anyviz" \
  "$TEST_HOME/.hermes" \
  "$TEST_HOME/.gemini" \
  "$TEST_HOME/.config/goose"
printf '%s\n' 'keep me' > "$TEST_HOME/.claude/skills/anyviz/custom.txt"

run_installer() {
  ANYVIZ_HOME="$TEST_HOME" \
  ANYVIZ_SOURCE_DIR="$PROJECT_ROOT" \
  ANYVIZ_DETECT_COMMANDS=0 \
    sh "$PROJECT_ROOT/install.sh" >/dev/null
}

assert_installed() {
  TARGET="$1"
  [ -f "$TARGET/SKILL.md" ]
  [ -f "$TARGET/guides/chart-selection.md" ]
  [ -f "$TARGET/templates/charts/bar-chart.md" ]
  [ -f "$TARGET/.anyviz-source" ]
}

run_installer

assert_installed "$TEST_HOME/.agents/skills/anyviz"
assert_installed "$TEST_HOME/.claude/skills/anyviz"
assert_installed "$TEST_HOME/.hermes/skills/anyviz"
assert_installed "$TEST_HOME/.gemini/skills/anyviz"
assert_installed "$TEST_HOME/.config/goose/skills/anyviz"
[ -f "$(find "$TEST_HOME/.claude/skills" -path '*/anyviz.backup-*/custom.txt' -print -quit)" ]

printf 'stale\n' > "$TEST_HOME/.agents/skills/anyviz/stale.txt"
run_installer

[ ! -e "$TEST_HOME/.agents/skills/anyviz/stale.txt" ]
[ -z "$(find "$TEST_HOME" -name '.anyviz-install-*' -o -name '.anyviz-backup-*')" ]

printf '%s\n' 'anyviz installer verified'

# Network path tests use a local fixture and a copied installer with its digest
# pinned to that fixture. Production has no URL or checksum override.
mkdir -p "$TEST_ROOT/payload/anyviz-fixture" "$TEST_ROOT/bin"
printf 'verified fixture\n' > "$TEST_ROOT/payload/anyviz-fixture/SKILL.md"
tar -czf "$TEST_ROOT/fixture.tar.gz" -C "$TEST_ROOT/payload" anyviz-fixture
if command -v sha256sum >/dev/null 2>&1; then
  DIGEST="$(sha256sum "$TEST_ROOT/fixture.tar.gz" | awk '{print $1}')"
else
  DIGEST="$(shasum -a 256 "$TEST_ROOT/fixture.tar.gz" | awk '{print $1}')"
fi
EXPECTED_PAYLOAD="$TEST_ROOT/payload/anyviz-fixture"
if [ "${1:-}" = "--download-pinned" ]; then
  SOURCE_COMMIT="$(sed -n 's/^SOURCE_COMMIT="\([0-9a-f]*\)"$/\1/p' "$PROJECT_ROOT/install.sh")"
  curl -fsSL --proto '=https' --proto-redir '=https' --retry 3 \
    "https://codeload.github.com/TseringYuu/anyviz/tar.gz/$SOURCE_COMMIT" -o "$TEST_ROOT/fixture.tar.gz"
  # Keep production trust anchors unchanged for the real archive test.
  cp "$PROJECT_ROOT/install.sh" "$TEST_ROOT/install.sh"
  EXPECTED_PAYLOAD="$PROJECT_ROOT"
else
  sed "s/^ARCHIVE_SHA256=.*/ARCHIVE_SHA256=\"$DIGEST\"/" "$PROJECT_ROOT/install.sh" > "$TEST_ROOT/install.sh"
fi
cat > "$TEST_ROOT/bin/curl" <<'MOCK'
#!/bin/sh
set -eu
URL_SEEN=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    https://codeload.github.com/TseringYuu/anyviz/tar.gz/*)
      REF="${1##*/}"
      [ "${#REF}" -eq 40 ] || exit 81
      case "$REF" in *[!0-9a-f]*) exit 82 ;; esac
      URL_SEEN=1 ;;
    -o) shift; OUTPUT="$1" ;;
  esac
  shift
done
[ "$URL_SEEN" -eq 1 ]
cp "$TEST_ARCHIVE" "$OUTPUT"
MOCK
chmod +x "$TEST_ROOT/bin/curl"
NETWORK_HOME="$TEST_ROOT/network-home"
PATH="$TEST_ROOT/bin:$PATH" TEST_ARCHIVE="$TEST_ROOT/fixture.tar.gz" \
  ANYVIZ_HOME="$NETWORK_HOME" ANYVIZ_SOURCE_DIR= ANYVIZ_DETECT_COMMANDS=0 \
  sh "$TEST_ROOT/install.sh" >/dev/null
cmp "$EXPECTED_PAYLOAD/SKILL.md" "$NETWORK_HOME/.agents/skills/anyviz/SKILL.md"
if [ "${1:-}" = "--download-pinned" ]; then
  cmp "$PROJECT_ROOT/assets/wordmark.svg" "$NETWORK_HOME/.agents/skills/anyviz/assets/wordmark.svg"
fi
printf 'preserve on failure\n' > "$NETWORK_HOME/.agents/skills/anyviz/sentinel"
printf 'tampered archive\n' > "$TEST_ROOT/tampered.tar.gz"
if PATH="$TEST_ROOT/bin:$PATH" TEST_ARCHIVE="$TEST_ROOT/tampered.tar.gz" \
  ANYVIZ_HOME="$NETWORK_HOME" ANYVIZ_SOURCE_DIR= ANYVIZ_DETECT_COMMANDS=0 \
  sh "$TEST_ROOT/install.sh" >"$TEST_ROOT/failure.log" 2>&1; then
  echo 'tampered archive unexpectedly accepted' >&2; exit 1
fi
grep -q 'archive SHA-256 mismatch' "$TEST_ROOT/failure.log"
grep -q 'preserve on failure' "$NETWORK_HOME/.agents/skills/anyviz/sentinel"
cmp "$EXPECTED_PAYLOAD/SKILL.md" "$NETWORK_HOME/.agents/skills/anyviz/SKILL.md"
if [ "${1:-}" = "--download-pinned" ]; then
  cmp "$PROJECT_ROOT/assets/wordmark.svg" "$NETWORK_HOME/.agents/skills/anyviz/assets/wordmark.svg"
fi
[ -z "$(find "$NETWORK_HOME" -name '.anyviz-install-*' -o -name '.anyviz-backup-*')" ]
printf '%s\n' 'verified download accepted; tampered download rejected without modifying installation'
