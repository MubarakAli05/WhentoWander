# Run from Windows PowerShell: .\scripts\generate-brand-assets.ps1
# Original pastel compass-and-sun artwork. Browser rendering keeps SVG and PNG assets identical.
param([string]$BrowserPath)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$public = Join-Path $root 'public'
$encoding = New-Object System.Text.UTF8Encoding($false)

# Edge or Chrome is the only renderer dependency; no separately drawn raster approximation.
if (-not $BrowserPath) {
  $BrowserPath = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe"
  ) | Where-Object { Test-Path $_ } | Select-Object -First 1
}
if (-not $BrowserPath -or -not (Test-Path $BrowserPath)) {
  throw 'Install Microsoft Edge / Google Chrome, or pass -BrowserPath to its executable.'
}

# One original, flat compass-and-sun silhouette stays readable even at 24px.
$favicon = @'
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="15" fill="#E9C8C2"/>
  <circle cx="30" cy="35" r="21" fill="#F6F1E8" stroke="#2D261B" stroke-width="2.5"/>
  <path d="M13 35a17 17 0 0 0 17 17" fill="none" stroke="#BED0BF" stroke-width="5" stroke-linecap="round"/>
  <path d="M30 52a17 17 0 0 0 17-17" fill="none" stroke="#C5CEDF" stroke-width="5" stroke-linecap="round"/>
  <path d="m44 21-9 19-19 9 9-19Z" fill="#2D261B" stroke="#2D261B" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="m16 49 14-14 5 5Z" fill="#CBBED6"/>
  <circle cx="30" cy="35" r="2.5" fill="#F6F1E8"/>
  <circle cx="48" cy="15" r="12" fill="#E9C8C2"/>
  <path d="M48 3v2m0 20v2M36 15h2m20 0h2M39.5 6.5l1.5 1.5m14 14 1.5 1.5m0-17L55 8" fill="none" stroke="#2D261B" stroke-width="2" stroke-linecap="round"/>
  <circle cx="48" cy="15" r="7" fill="#D8C08A" stroke="#2D261B" stroke-width="1.5"/>
</svg>
'@
$svg = $favicon.Replace('width="64" height="64" viewBox=', 'width="256" height="256" viewBox=')
foreach ($asset in @(@{ Name = 'brand-mark.svg'; Svg = $svg }, @{ Name = 'favicon.svg'; Svg = $favicon })) {
  $null = [xml]$asset.Svg
  [System.IO.File]::WriteAllText((Join-Path $public $asset.Name), $asset.Svg + "`n", $encoding)
  Write-Output "$($asset.Name) valid XML"
}

# Keep install surfaces in sync whenever the artwork is regenerated.
$manifestPath = Join-Path $public 'site.webmanifest'
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$manifest.theme_color = '#F6F1E8'
$manifest.background_color = '#F6F1E8'
[System.IO.File]::WriteAllText($manifestPath, ($manifest | ConvertTo-Json -Depth 5).Replace("`r`n", "`n") + "`n", $encoding)

function ConvertTo-ImageUri([string]$art) {
  return 'data:image/svg+xml;base64,' + [Convert]::ToBase64String($encoding.GetBytes($art))
}

$markUri = ConvertTo-ImageUri $svg
$faviconUri = ConvertTo-ImageUri $favicon
# Use a private project-local render directory, never the shared browser profile.
$work = Join-Path $root ('.brand-render-' + [Guid]::NewGuid().ToString('N'))
$null = New-Item -ItemType Directory -Path $work
$sheet = Join-Path $work 'sheet.png'
$browser = $null
try {
  $html = @"
<!doctype html><html lang="en"><meta charset="utf-8"><title>Brand asset renderer</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#F6F1E8;color:#2D261B;font-family:'Segoe UI',sans-serif}
.master{position:absolute;left:0;top:0;width:1024px;height:1024px}.favicon{position:absolute;left:1024px;top:0;width:128px;height:128px}
.social{position:absolute;left:0;top:1024px;width:1200px;height:630px;overflow:hidden;background:#F6F1E8}
.orbit{position:absolute;left:710px;top:63px;width:510px;height:510px;border:2px solid #BED0BF;border-radius:50%;background:#C5CEDF}.orbit.inner{inset:104px auto auto 751px;width:428px;height:428px;border-color:#CBBED6;background:#F6F1E8}
.eyebrow{position:absolute;left:80px;top:75px;font-size:17px;letter-spacing:4px;color:#2D261B}.eyebrow:before{content:'';display:inline-block;width:40px;height:3px;background:#D8C08A;vertical-align:middle;margin-right:20px}
.title{position:absolute;left:76px;top:175px;margin:0;font-size:104px;line-height:1.1;letter-spacing:-5px;font-weight:600}.title span{display:block;font-size:43px;letter-spacing:-1px;font-weight:300;margin-bottom:8px}
.tagline{position:absolute;left:80px;top:370px;margin:0;color:#2D261B;font-size:29px;font-weight:300}.footer{position:absolute;left:80px;bottom:65px;color:#2D261B;font-size:17px;letter-spacing:.4px}
.social img{position:absolute;left:785px;top:137px;width:360px;height:360px}
</style><img class="master" src="$markUri" alt=""><img class="favicon" src="$faviconUri" alt="">
<section class="social"><div class="orbit"></div><div class="orbit inner"></div><div class="eyebrow">TRAVEL, IN SEASON</div><h1 class="title"><span>When to</span>Wander</h1><p class="tagline">Find the best time to go</p><p class="footer">Every place has a moment. Find yours.</p><img src="$markUri" alt=""></section></html>
"@
  $htmlPath = Join-Path $work 'render.html'
  [System.IO.File]::WriteAllText($htmlPath, $html, $encoding)
  $arguments = @('--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--disable-extensions', '--disable-background-networking', '--disable-component-update', '--virtual-time-budget=1500', '--window-size=1200,1800', "--user-data-dir=`"$(Join-Path $work 'profile')`"", "--screenshot=`"$sheet`"", "`"$([Uri]::new($htmlPath).AbsoluteUri)`"")
  $browser = Start-Process -FilePath $BrowserPath -ArgumentList $arguments -PassThru -RedirectStandardError (Join-Path $work 'browser.log')
  $null = $browser.Handle
  if (-not $browser.WaitForExit(60000)) {
    Stop-Process -Id $browser.Id -Force -ErrorAction SilentlyContinue
    throw 'Browser asset rendering timed out.'
  }
  if ($browser.ExitCode -ne 0 -or -not (Test-Path $sheet)) {
    throw "Browser asset rendering failed: $(Get-Content (Join-Path $work 'browser.log') -Raw)"
  }
  $source = [System.Drawing.Bitmap]::new($sheet)
  try {
    foreach ($asset in @(
      @{ Name = 'favicon-32.png'; Width = 32; Height = 32; X = 1024; Y = 0; SourceWidth = 128; SourceHeight = 128 },
      @{ Name = 'apple-touch-icon.png'; Width = 180; Height = 180; X = 0; Y = 0; SourceWidth = 1024; SourceHeight = 1024 },
      @{ Name = 'icon-192.png'; Width = 192; Height = 192; X = 0; Y = 0; SourceWidth = 1024; SourceHeight = 1024 },
      @{ Name = 'icon-512.png'; Width = 512; Height = 512; X = 0; Y = 0; SourceWidth = 1024; SourceHeight = 1024 },
      @{ Name = 'social-preview.png'; Width = 1200; Height = 630; X = 0; Y = 1024; SourceWidth = 1200; SourceHeight = 630 }
    )) {
      $output = [System.Drawing.Bitmap]::new($asset.Width, $asset.Height)
      $g = [System.Drawing.Graphics]::FromImage($output)
      try {
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($source, [System.Drawing.Rectangle]::new(0, 0, $asset.Width, $asset.Height), $asset.X, $asset.Y, $asset.SourceWidth, $asset.SourceHeight, [System.Drawing.GraphicsUnit]::Pixel)
        $output.Save((Join-Path $public $asset.Name), [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Output "$($asset.Name) $($asset.Width)x$($asset.Height)"
      } finally {
        $g.Dispose(); $output.Dispose()
      }
    }
  } finally {
    $source.Dispose()
  }
} finally {
  if ($browser -and -not $browser.HasExited) { Stop-Process -Id $browser.Id -Force -ErrorAction SilentlyContinue }
  Remove-Item $work -Recurse -Force
}
