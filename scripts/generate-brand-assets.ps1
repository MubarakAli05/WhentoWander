# Run from Windows PowerShell: .\scripts\generate-brand-assets.ps1
# Original artwork; SVG and raster marks share the same 64-unit geometry.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$public = Join-Path (Split-Path $PSScriptRoot -Parent) 'public'

$svg = @'
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#1c1917"/>
  <circle cx="32" cy="32" r="20" fill="none" stroke="#fbbf24" stroke-width="3"/>
  <path d="M12 32h4m16 16v4m16-20h4m-20-20v4" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
  <path d="m41 23-7 11-11 7 7-11Z" fill="#fff7ed"/>
  <path d="m41 23-7 11-4-4Z" fill="#fbbf24"/>
  <circle cx="47" cy="17" r="9" fill="#1c1917"/>
  <circle cx="47" cy="17" r="5" fill="#fbbf24"/>
  <path d="M47 7V5m10 12h2m-5-7 1.5-1.5" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
</svg>
'@
$encoding = New-Object System.Text.UTF8Encoding($false)
foreach ($name in @('brand-mark.svg', 'favicon.svg')) {
  [System.IO.File]::WriteAllText((Join-Path $public $name), $svg + "`n", $encoding)
}

function New-Brush([string]$hex) {
  return [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function Draw-Mark($g, [single]$x, [single]$y, [single]$size) {
  $state = $g.Save()
  $dark = New-Brush '#1c1917'
  $amber = New-Brush '#fbbf24'
  $cream = New-Brush '#fff7ed'
  $ring = [System.Drawing.Pen]::new($amber, 3)
  $ticks = [System.Drawing.Pen]::new($amber, 2)
  $ticks.StartCap = $ticks.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $tile = [System.Drawing.Drawing2D.GraphicsPath]::new()
  try {
    $g.TranslateTransform($x, $y)
    $g.ScaleTransform($size / 64, $size / 64)
    $tile.AddArc(0, 0, 32, 32, 180, 90)
    $tile.AddArc(32, 0, 32, 32, 270, 90)
    $tile.AddArc(32, 32, 32, 32, 0, 90)
    $tile.AddArc(0, 32, 32, 32, 90, 90)
    $tile.CloseFigure()
    $g.FillPath($dark, $tile)
    $g.DrawEllipse($ring, 12, 12, 40, 40)
    $g.DrawLine($ticks, 12, 32, 16, 32)
    $g.DrawLine($ticks, 32, 48, 32, 52)
    $g.DrawLine($ticks, 48, 32, 52, 32)
    $g.DrawLine($ticks, 32, 12, 32, 16)
    $g.FillPolygon($cream, [System.Drawing.PointF[]]@(
      [System.Drawing.PointF]::new(41, 23), [System.Drawing.PointF]::new(34, 34),
      [System.Drawing.PointF]::new(23, 41), [System.Drawing.PointF]::new(30, 30)
    ))
    $g.FillPolygon($amber, [System.Drawing.PointF[]]@(
      [System.Drawing.PointF]::new(41, 23), [System.Drawing.PointF]::new(34, 34),
      [System.Drawing.PointF]::new(30, 30)
    ))
    $g.FillEllipse($dark, 38, 8, 18, 18)
    $g.FillEllipse($amber, 42, 12, 10, 10)
    $g.DrawLine($ticks, 47, 7, 47, 5)
    $g.DrawLine($ticks, 57, 17, 59, 17)
    $g.DrawLine($ticks, [single]54, [single]10, [single]55.5, [single]8.5)
  } finally {
    $g.Restore($state)
    $tile.Dispose(); $ring.Dispose(); $ticks.Dispose()
    $dark.Dispose(); $amber.Dispose(); $cream.Dispose()
  }
}

function Save-Art([string]$name, [int]$width, [int]$height, [scriptblock]$draw) {
  $scale = 3
  $canvas = [System.Drawing.Bitmap]::new($width * $scale, $height * $scale)
  $g = [System.Drawing.Graphics]::FromImage($canvas)
  $output = [System.Drawing.Bitmap]::new($width, $height)
  $resizer = [System.Drawing.Graphics]::FromImage($output)
  try {
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.ScaleTransform($scale, $scale)
    & $draw $g
    $resizer.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $resizer.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $resizer.DrawImage($canvas, [System.Drawing.Rectangle]::new(0, 0, $width, $height))
    $output.Save((Join-Path $public $name), [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "$name ${width}x${height}"
  } finally {
    $resizer.Dispose(); $output.Dispose(); $g.Dispose(); $canvas.Dispose()
  }
}

foreach ($asset in @(
  @{ Name = 'favicon-32.png'; Size = 32 },
  @{ Name = 'apple-touch-icon.png'; Size = 180 },
  @{ Name = 'icon-192.png'; Size = 192 },
  @{ Name = 'icon-512.png'; Size = 512 }
)) {
  $size = $asset.Size
  Save-Art $asset.Name $size $size {
    param($g)
    $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#1c1917'))
    Draw-Mark $g 0 0 $size
  }
}

Save-Art 'social-preview.png' 1200 630 {
  param($g)
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#1c1917'))
  $amber = New-Brush '#fbbf24'
  $cream = New-Brush '#fff7ed'
  $muted = New-Brush '#d6d3d1'
  $orbit = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#44382a'), 1.5)
  $rule = [System.Drawing.Pen]::new($amber, 3)
  $small = [System.Drawing.Font]::new('Segoe UI', 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $intro = [System.Drawing.Font]::new('Segoe UI', 42, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $title = [System.Drawing.Font]::new('Segoe UI', 100, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $tagline = [System.Drawing.Font]::new('Segoe UI', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  try {
    $g.DrawEllipse($orbit, 694, 52, 526, 526)
    $g.DrawEllipse($orbit, 738, 96, 438, 438)
    $g.DrawLine($rule, 80, 85, 128, 85)
    $g.DrawString('TRAVEL, IN SEASON', $small, $amber, [single]145, [single]70)
    $g.DrawString('When to', $intro, $cream, [single]76, [single]165)
    $g.DrawString('Wander', $title, $cream, [single]70, [single]209)
    $g.DrawString('Find the best time to go', $tagline, $muted, [single]78, [single]365)
    $g.DrawString('Every place has a moment. Find yours.', $small, $muted, [single]80, [single]530)
    Draw-Mark $g 777 135 360
  } finally {
    $amber.Dispose(); $cream.Dispose(); $muted.Dispose(); $orbit.Dispose(); $rule.Dispose()
    $small.Dispose(); $intro.Dispose(); $title.Dispose(); $tagline.Dispose()
  }
}
