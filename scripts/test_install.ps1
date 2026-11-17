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
    $installer = [regex]::Replace($installer, '(?m)^\$ArchiveSha256 = ".*"$', ('$ArchiveSha256 = "' + $digest + '"'))
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
    $expected = (Get-FileHash (Join-Path $payload 'SKILL.md')).Hash
    if ((Get-FileHash (Join-Path $target 'SKILL.md')).Hash -ne $expected) { throw 'verified payload missing' }
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
    Write-Host 'PowerShell verified download accepted; tampering rejected without modifying installation'
}
finally {
    $env:ANYVIZ_HOME = $oldHome
    $env:ANYVIZ_SOURCE_DIR = $oldSource
    $env:ANYVIZ_DETECT_COMMANDS = $oldDetect
    if (Test-Path $TestRoot) { Remove-Item $TestRoot -Recurse -Force }
}
