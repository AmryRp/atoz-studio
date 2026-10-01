param([ValidateSet('dev','build','preview','check','test','install')][string]$Task = 'dev')
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$localBun = Join-Path $PSScriptRoot '.tools/node_modules/bun/bin/bun.exe'
$installedBun = Get-Command bun -ErrorAction SilentlyContinue
if ($installedBun) { $bunExe = $installedBun.Source }
elseif (Test-Path -LiteralPath $localBun) { $bunExe = $localBun }
else { throw 'Bun is not installed. Install it from https://bun.sh and reopen PowerShell.' }
$env:Path = (Split-Path -Parent $bunExe) + [IO.Path]::PathSeparator + $env:Path
if ($Task -eq 'install') { & $bunExe install --frozen-lockfile }
else {
  if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules/svelte'))) {
    & $bunExe install --frozen-lockfile
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
  & $bunExe run $Task
}
exit $LASTEXITCODE
