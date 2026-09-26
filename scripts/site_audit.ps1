# Comprehensive Site Health, Form, Link & Conversion Audit Script
$ErrorActionPreference = "SilentlyContinue"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ASSIGNMENT VENUE CENTER - COMPLETE AUDIT" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. HTML File Count & Size
$htmlFiles = Get-ChildItem -Filter *.html
Write-Host "`n[1] TOTAL HTML PAGES: $($htmlFiles.Count)" -ForegroundColor Yellow

# 2. Form Endpoints Scan
Write-Host "`n[2] FORMS & LEAD CAPTURE ENDPOINTS:" -ForegroundColor Yellow
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $formMatches = [regex]::Matches($content, '<form\b[^>]*>')
    if ($formMatches.Count -gt 0) {
        Write-Host "  File: $($file.Name)" -ForegroundColor White
        foreach ($m in $formMatches) {
            Write-Host "    $($m.Value)" -ForegroundColor Gray
        }
    }
}

# 3. Broken Internal Links Check
Write-Host "`n[3] INTERNAL LINKS INTEGRITY CHECK:" -ForegroundColor Yellow
$brokenLinks = @()
$allHtmlNames = $htmlFiles | ForEach-Object { $_.Name.ToLower() }

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $hrefMatches = [regex]::Matches($content, 'href=["'']([^"'']+)["'']')
    foreach ($m in $hrefMatches) {
        $href = $m.Groups[1].Value.Trim()
        # ignore anchors, mailto, tel, external URLs, javascript
        if ($href -notmatch '^(https?://|mailto:|tel:|javascript:|#|data:)') {
            # remove query string and anchor
            $cleanHref = $href -replace '\?.*$', '' -replace '#.*$', ''
            if ($cleanHref -and $cleanHref -ne './' -and $cleanHref -ne '/') {
                $targetFile = $cleanHref.ToLower()
                # check if file exists
                if (-not (Test-Path $targetFile)) {
                    $brokenLinks += [PSCustomObject]@{
                        SourceFile = $file.Name
                        Target = $href
                    }
                }
            }
        }
    }
}

if ($brokenLinks.Count -eq 0) {
    Write-Host "  All internal links resolved successfully! No broken links found." -ForegroundColor Green
} else {
    Write-Host "  Found $($brokenLinks.Count) potential broken links:" -ForegroundColor Red
    $brokenLinks | Format-Table -AutoSize
}

# 4. Canonical & Open Graph Tags Check
Write-Host "`n[4] SEO & SOCIAL META TAG AUDIT:" -ForegroundColor Yellow
$missingCanonical = @()
$missingOgTitle = @()

foreach ($file in $htmlFiles) {
    # Skip admin or test pages
    if ($file.Name -match 'admin|test|404') { continue }
    $content = Get-Content $file.FullName -Raw
    if ($content -notmatch '<link\s+rel=["'']canonical["'']') {
        $missingCanonical += $file.Name
    }
    if ($content -notmatch '<meta\s+property=["'']og:title["'']') {
        $missingOgTitle += $file.Name
    }
}

Write-Host "  Pages missing canonical tag: $($missingCanonical.Count)"
if ($missingCanonical.Count -gt 0) { Write-Host "    $($missingCanonical -join ', ')" -ForegroundColor DarkYellow }

Write-Host "  Pages missing og:title: $($missingOgTitle.Count)"
if ($missingOgTitle.Count -gt 0) { Write-Host "    $($missingOgTitle -join ', ')" -ForegroundColor DarkYellow }

# 5. Schema.org Structured Data
Write-Host "`n[5] STRUCTURED DATA (JSON-LD) AUDIT:" -ForegroundColor Yellow
$schemaCount = 0
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'type=["'']application/ld\+json["'']') {
        $schemaCount++
    }
}
Write-Host "  Pages with Schema.org JSON-LD: $schemaCount / $($htmlFiles.Count)" -ForegroundColor Green

# 6. Sitemaps Verification
Write-Host "`n[6] SITEMAP VERIFICATION:" -ForegroundColor Yellow
if (Test-Path "sitemap.xml") {
    $sitemapContent = Get-Content "sitemap.xml" -Raw
    $urlMatches = [regex]::Matches($sitemapContent, '<loc>([^<]+)</loc>')
    Write-Host "  sitemap.xml contains $($urlMatches.Count) URLs" -ForegroundColor Green
}

# 7. JavaScript & Asset Integrity Check
Write-Host "`n[7] ASSET INTEGRITY (CSS & JS) AUDIT:" -ForegroundColor Yellow
$missingAssets = @()
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $assetMatches = [regex]::Matches($content, '(?:src|href)=["''](assets/[^"'']+)["'']')
    foreach ($m in $assetMatches) {
        $asset = $m.Groups[1].Value -replace '\?.*$', ''
        if (-not (Test-Path $asset)) {
            $missingAssets += [PSCustomObject]@{
                Page = $file.Name
                Asset = $asset
            }
        }
    }
}

$uniqueMissing = $missingAssets | Select-Object -Unique Page, Asset
if ($uniqueMissing.Count -eq 0) {
    Write-Host "  All assets (CSS, JS, images) exist on disk!" -ForegroundColor Green
} else {
    Write-Host "  Missing assets detected: $($uniqueMissing.Count)" -ForegroundColor Red
    $uniqueMissing | Format-Table -AutoSize
}

Write-Host "`nAudit complete." -ForegroundColor Cyan
