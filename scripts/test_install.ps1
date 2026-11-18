param([switch]$DownloadPinnedPayload)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2.0
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$TestRoot = Join-Path ([IO.Path]::GetTempPath()) ('anyviz-test-' + [Guid]::NewGuid().ToString('N'))
$oldHome = $env:ANYVIZ_HOME
$oldSource = $env:ANYVIZ_SOURCE_DIR
$oldDetect = $env:ANYVIZ_DETECT_COMMANDS
try {
    $payload = Join-Path $TestRoot 'payload/anyviz-fixture'
    New-Item -ItemType Directory -Force -Path $payload | Out-Null
    Set-Content (Join-Path $payload 'SKILL.md') 'verified fixture'
    $fixtureArchive = Join-Path $TestRoot 'fixture.zip'
    Compress-Archive -Path $payload -DestinationPath $fixtureArchive
    $digest = (Get-FileHash $fixtureArchive -Algorithm SHA256).Hash
    $installer = Get-Content (Join-Path $ProjectRoot 'install.ps1') -Raw
    $expectedPayload = $payload
    if ($DownloadPinnedPayload) {
        $commit = [regex]::Match($installer, '(?m)^\$SourceCommit = "([0-9a-f]{40})"').Groups[1].Value
        if (-not $commit) { throw 'Missing production pin' }
        Invoke-WebRequest -UseBasicParsing -Uri "https://codeload.github.com/TseringYuu/anyviz/zip/$commit" -OutFile $fixtureArchive
        # Leave the production digest unchanged; no checksum override.
        $expectedPayload = $ProjectRoot
    }
    else {
        $installer = [regex]::Replace($installer, '(?m)^\$ArchiveSha256 = ".*"\r?$', ('$ArchiveSha256 = "' + $digest + '"'))
        if (-not $installer.Contains($digest)) { throw 'Fixture digest was not pinned in test installer' }
    }
    $testInstaller = Join-Path $TestRoot 'install.ps1'
    Set-Content $testInstaller $installer
    $mockState = @{ Archive = $fixtureArchive; Tamper = $false }
    # Only the transport is mocked. Hashing, extraction and installation are real.
    Set-Item Function:Invoke-WebRequest -Value ({
        param([switch]$UseBasicParsing, [string]$Uri, [string]$OutFile)
        if ($Uri -notmatch '^https://codeload\.github\.com/TseringYuu/anyviz/zip/[0-9a-f]{40}$') {
            throw "Unexpected unpinned URL: $Uri"
        }
        if ($mockState.Tamper) { Set-Content $OutFile 'tampered archive' }
        else { Copy-Item $mockState.Archive $OutFile }
    }.GetNewClosure())
    $env:ANYVIZ_HOME = Join-Path $TestRoot 'home'
    $env:ANYVIZ_SOURCE_DIR = ''
    $env:ANYVIZ_DETECT_COMMANDS = '0'
    & $testInstaller
    $target = Join-Path $env:ANYVIZ_HOME '.agents/skills/anyviz'
    $expected = (Get-FileHash (Join-Path $expectedPayload 'SKILL.md')).Hash
    if ($DownloadPinnedPayload) {
        # Windows checkouts may use CRLF while archives preserve Git's LF.
        $expectedText = (Get-Content (Join-Path $expectedPayload 'SKILL.md') -Raw).Replace("`r`n", "`n")
        $actualText = (Get-Content (Join-Path $target 'SKILL.md') -Raw).Replace("`r`n", "`n")
        if ($actualText -cne $expectedText) { throw 'verified payload differs' }
        $expected = (Get-FileHash (Join-Path $target 'SKILL.md')).Hash
    }
    if ((Get-FileHash (Join-Path $target 'SKILL.md')).Hash -ne $expected) { throw 'verified payload missing' }
    if ($DownloadPinnedPayload) {
        $wordmark = (Get-Content (Join-Path $ProjectRoot 'assets/wordmark.svg') -Raw).Replace("`r`n", "`n")
        $installedWordmark = (Get-Content (Join-Path $target 'assets/wordmark.svg') -Raw).Replace("`r`n", "`n")
        $wordmarkHash = (Get-FileHash (Join-Path $target 'assets/wordmark.svg')).Hash
        if ($installedWordmark -cne $wordmark) { throw 'Installed wordmark differs from selected brand' }
    }
    $sentinel = Join-Path $target 'sentinel'
    Set-Content $sentinel 'preserve on failure'
    $mockState.Tamper = $true
    $rejected = $false
    try { & $testInstaller }
    catch {
        if ($_.Exception.Message -notlike '*archive SHA-256 mismatch*') { throw }
        $rejected = $true
    }
    if (-not $rejected) { throw 'tampered archive accepted' }
    if (-not (Test-Path $sentinel)) { throw 'existing installation modified' }
    if ((Get-FileHash (Join-Path $target 'SKILL.md')).Hash -ne $expected) { throw 'existing skill changed' }
    if ($DownloadPinnedPayload) {
        if ((Get-FileHash (Join-Path $target 'assets/wordmark.svg')).Hash -ne $wordmarkHash) { throw 'existing wordmark changed' }
    }
    Write-Host 'PowerShell verified download accepted; tampering rejected without modifying installation'
}
finally {
    $env:ANYVIZ_HOME = $oldHome
    $env:ANYVIZ_SOURCE_DIR = $oldSource
    $env:ANYVIZ_DETECT_COMMANDS = $oldDetect
    if (Test-Path $TestRoot) { Remove-Item $TestRoot -Recurse -Force }
}
