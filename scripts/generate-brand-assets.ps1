# Run from Windows PowerShell: .\scripts\generate-brand-assets.ps1
# Original metallic compass-and-sun artwork. Browser rendering keeps SVG and PNG assets identical.
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

$svg = @'
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <radialGradient id="night" cx="35%" cy="18%" r="90%"><stop stop-color="#30383b"/><stop offset=".5" stop-color="#161d20"/><stop offset="1" stop-color="#0c0a09"/></radialGradient>
    <radialGradient id="face" cx="38%" cy="24%" r="85%"><stop stop-color="#344851"/><stop offset=".58" stop-color="#172730"/><stop offset="1" stop-color="#080f15"/></radialGradient>
    <linearGradient id="metal" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fff7d9"/><stop offset=".17" stop-color="#a0abb0"/><stop offset=".3" stop-color="#e9e9df"/><stop offset=".48" stop-color="#596970"/><stop offset=".68" stop-color="#c2cace"/><stop offset=".84" stop-color="#5a686e"/><stop offset="1" stop-color="#dfe3dd"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2=".85" y2="1"><stop stop-color="#fff0bd"/><stop offset=".2" stop-color="#e7bd65"/><stop offset=".46" stop-color="#846032"/><stop offset=".6" stop-color="#f0ce86"/><stop offset=".83" stop-color="#9e7035"/><stop offset="1" stop-color="#ead09b"/></linearGradient>
    <linearGradient id="light" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset=".4" stop-color="#edf0e9"/><stop offset=".67" stop-color="#c1cbcf"/><stop offset="1" stop-color="#84949b"/></linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2=".75"><stop stop-color="#82959d"/><stop offset=".4" stop-color="#384e5a"/><stop offset=".75" stop-color="#899ba4"/><stop offset="1" stop-color="#283d49"/></linearGradient>
    <linearGradient id="needle" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#946430"/><stop offset=".52" stop-color="#ecc67b"/><stop offset=".8" stop-color="#fff4c8"/><stop offset="1" stop-color="#fffcee"/></linearGradient>
    <radialGradient id="sun" cx="32%" cy="25%" r="75%"><stop stop-color="#fffce0"/><stop offset=".25" stop-color="#ffe4a0"/><stop offset=".56" stop-color="#e6b651"/><stop offset=".85" stop-color="#98602c"/><stop offset="1" stop-color="#533b26"/></radialGradient>
    <radialGradient id="jewel" cx="32%" cy="24%" r="75%"><stop stop-color="#d1edfc"/><stop offset=".25" stop-color="#779dab"/><stop offset=".55" stop-color="#244e66"/><stop offset="1" stop-color="#071725"/></radialGradient>
    <filter id="lift" x="-35%" y="-35%" width="180%" height="190%"><feDropShadow dx="1" dy="5" stdDeviation="3" flood-color="#000" flood-opacity=".65"/></filter>
  </defs>
  <rect width="256" height="256" rx="58" fill="url(#night)"/>
  <rect x="1" y="1" width="254" height="254" rx="57" fill="none" stroke="#b5c4cb" stroke-opacity=".09"/>
  <!-- Beveled case and recessed dial give depth without photographic texture. -->
  <g filter="url(#lift)">
    <circle cx="121" cy="139" r="89" fill="#0a1014"/>
    <circle cx="121" cy="136" r="89" fill="url(#gold)"/>
    <circle cx="121" cy="136" r="86" fill="url(#metal)"/>
    <circle cx="121" cy="136" r="81" fill="#0b141a" stroke="#060b0f" stroke-width="1.5"/>
    <circle cx="121" cy="136" r="78" fill="url(#face)" stroke="url(#gold)" stroke-width="1.5"/>
  </g>
  <g fill="none">
    <circle cx="121" cy="136" r="72" stroke="#bfced2" stroke-opacity=".38" stroke-width="3" stroke-dasharray="1 8.425"/>
    <circle cx="121" cy="136" r="63" stroke="#c1a371" stroke-opacity=".36" stroke-width=".7"/>
    <path d="M121 65v9m0 124v9m-71-71h9m124 0h9" stroke="url(#gold)" stroke-width="2"/>
  </g>
  <!-- Subtle engraved landscapes echo the reference, rather than four separate clip-art arcs. -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" opacity=".62">
    <path d="m70 108 14-20 9 11 10-15 9 20m-35-5 7-11 6 8m-23 21 6-12 6 12m-6-9v15" stroke="#99b7a2"/>
    <path d="M148 89q15-8 29 6m-32 2q15-10 34 4" stroke="#d6b876"/>
    <path d="M62 161q9-13 16-4 4 8-5 9 4-7-2-8-9 4 1 12 8 6 18 1m-23 5q11 8 21 2m2 8 9 9m-9 0 9-9m-4-2v13" stroke="#a8c9d7"/>
    <path d="M149 184v-12l24-8v13m-24-5 24-8m-18 17v-7q2-4 4-1v6m6-2v-7q2-4 4-1v6m7-24v15m0-9-5-4m5 0 4-4m-13 1q-2-6 4-7 5-5 8 1 7 0 5 6-4 5-8 1-5 4-9-1Z" stroke="#d0a184"/>
  </g>
  <g filter="url(#lift)" stroke-linejoin="round">
    <path d="m78 94 43 25 43-25-25 42 25 43-43-25-43 25 25-43Z" fill="url(#gold)" stroke="#ddc18b" stroke-width=".6"/>
    <path d="m121 60 12 64 64 12-64 12-12 64-12-64-64-12 64-12Z" fill="url(#light)" stroke="#0c1a22" stroke-width="1.5"/>
    <path d="m121 60 12 64-12 12Zm76 76-64 12-12-12Zm-76 76-12-64 12-12Zm-76-76 64-12 12 12Z" fill="url(#shade)"/>
    <path d="m181 76-45 75-75 45 45-75Z" fill="url(#light)" stroke="#13242c" stroke-width="1.8"/>
    <path d="m181 76-45 75-15-15Z" fill="url(#needle)"/>
    <path d="m181 76-60 60-15-15Z" fill="#fff1c0"/>
    <path d="m61 196 60-60 15 15Z" fill="url(#shade)"/>
    <path d="m121 63 0 61m15 12 57 0m-72 14v57m-71-71h56" fill="none" stroke="#e1edf0" stroke-opacity=".55" stroke-width=".65"/>
    <circle cx="121" cy="136" r="15" fill="url(#gold)" stroke="#171919" stroke-width="1"/>
    <circle cx="121" cy="136" r="11" fill="url(#jewel)" stroke="#f3dda4" stroke-width="1"/>
    <path d="m121 126 7 6-3 10-10-2-3-8Z" fill="#b3dced" fill-opacity=".16" stroke="#c2e8f8" stroke-opacity=".25" stroke-width=".6"/>
    <circle cx="118" cy="132" r="2.2" fill="#e6f5ff" fill-opacity=".88"/>
  </g>
  <!-- The northeast sun preserves the original website's amber signature. -->
  <g filter="url(#lift)" transform="translate(4 -8)">
    <circle cx="194" cy="56" r="31" fill="#161d20"/>
    <g fill="url(#gold)">
      <path d="m194 14 3 13h-6Zm42 42-13 3v-6Zm-42 42-3-13h6Zm-42-42 13-3v6Zm12-30 12 7-4 4Zm60 0-7 12-5-5Zm0 60-12-7 5-5Zm-60 0 7-12 5 5Z"/>
    </g>
    <circle cx="194" cy="56" r="25" fill="url(#gold)"/>
    <circle cx="194" cy="56" r="22.5" fill="url(#sun)" stroke="#f9de91" stroke-width=".6"/>
    <path d="M177 51a18 18 0 0 1 21-12" fill="none" stroke="#fff8d4" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
  </g>
</svg>
'@

# At favicon size, retain the original amber sun, compass ring and two-facet diagonal needle.
$favicon = @'
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="mini-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0b4"/><stop offset=".45" stop-color="#e7bc63"/><stop offset="1" stop-color="#aa763c"/></linearGradient>
    <radialGradient id="mini-sun" cx="32%" cy="24%" r="80%"><stop stop-color="#fff1b3"/><stop offset=".65" stop-color="#f0bd54"/><stop offset="1" stop-color="#b47731"/></radialGradient>
  </defs>
  <rect width="64" height="64" rx="15" fill="#111719"/>
  <circle cx="30" cy="34" r="22" fill="#16252d" stroke="url(#mini-metal)" stroke-width="3"/>
  <path d="M30 14v5m0 30v5M10 34h5m30 0h5" fill="none" stroke="#b9c6c9" stroke-width="2"/>
  <path d="m44 20-10 18-18 10 10-18Z" fill="#f0f3e9"/>
  <path d="m44 20-10 18-4-4Z" fill="url(#mini-metal)"/>
  <path d="m16 48 14-14 4 4Z" fill="#809aa6"/>
  <circle cx="49" cy="13" r="10" fill="#111719"/>
  <circle cx="49" cy="13" r="6.5" fill="url(#mini-sun)"/>
  <path d="M49 3V1m10 12h2m-5-7 2-2" fill="none" stroke="#ecc576" stroke-width="2" stroke-linecap="round"/>
</svg>
'@

# External SVG image media queries follow the rendered image width, including the 24px navbar.
$compactGeometry = ([xml]$favicon).DocumentElement.InnerXml
$svg = $svg.Replace('</defs>', '</defs><style>.compact{display:none}@media(max-width:48px){.landscape{display:none}.compact{display:inline}}</style><g class="landscape">')
$svg = $svg.Replace('</svg>', "</g><g class=`"compact`" transform=`"scale(4)`">$compactGeometry</g></svg>")

foreach ($asset in @(@{ Name = 'brand-mark.svg'; Svg = $svg }, @{ Name = 'favicon.svg'; Svg = $favicon })) {
  $null = [xml]$asset.Svg
  [System.IO.File]::WriteAllText((Join-Path $public $asset.Name), $asset.Svg + "`n", $encoding)
  Write-Output "$($asset.Name) valid XML"
}

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
*{box-sizing:border-box}body{margin:0;background:#0c0a09;color:#f3ecda;font-family:'Segoe UI',sans-serif}
.master{position:absolute;left:0;top:0;width:1024px;height:1024px}.favicon{position:absolute;left:1024px;top:0;width:128px;height:128px}
.social{position:absolute;left:0;top:1024px;width:1200px;height:630px;overflow:hidden;background:radial-gradient(ellipse at 85% 45%,#28333b 0,#151919 43%,#0c0a09 76%)}
.orbit{position:absolute;left:710px;top:63px;width:510px;height:510px;border:1px solid #bda27530;border-radius:50%}.orbit.inner{inset:104px auto auto 751px;width:428px;height:428px}
.eyebrow{position:absolute;left:80px;top:75px;font-size:17px;letter-spacing:4px;color:#d7b877}.eyebrow:before{content:'';display:inline-block;width:40px;height:2px;background:#d7b877;vertical-align:middle;margin-right:20px}
.title{position:absolute;left:76px;top:175px;margin:0;font-size:104px;line-height:1.1;letter-spacing:-5px;font-weight:600}.title span{display:block;font-size:43px;letter-spacing:-1px;font-weight:300;margin-bottom:8px}
.tagline{position:absolute;left:80px;top:370px;margin:0;color:#cecdbf;font-size:29px;font-weight:300}.footer{position:absolute;left:80px;bottom:65px;color:#a6b0a4;font-size:17px;letter-spacing:.4px}
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
