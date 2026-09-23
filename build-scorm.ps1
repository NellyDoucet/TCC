# Fabrique imsmanifest.xml et le zip SCORM 1.2 d'un chapitre.
# Usage : build-scorm.ps1 -Dossier 02-principes-comptables -Titre "Comptabilité 02 - Principes comptables"
param(
  [Parameter(Mandatory = $true)][string]$Dossier,
  [Parameter(Mandatory = $true)][string]$Titre
)
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem

$src = Join-Path $PSScriptRoot $Dossier
$zip = Join-Path $PSScriptRoot "$Dossier-scorm12.zip"
$id = ("COM.ADRARFORMATION.COMPTA." + $Dossier.ToUpper()) -replace '[^A-Z0-9.]', '.'
$org = "ORG-" + ($Dossier.ToUpper() -replace '[^A-Z0-9]', '-')
$esc = [System.Security.SecurityElement]::Escape($Titre)

$fichiers = Get-ChildItem $src -Recurse -File | Where-Object { $_.Name -ne 'imsmanifest.xml' } |
  ForEach-Object { $_.FullName.Substring($src.Length + 1).Replace('\', '/') } | Sort-Object
$lignes = $fichiers | ForEach-Object { "      <file href=""$([System.Security.SecurityElement]::Escape($_))"" />" }

$manifest = @"
<?xml version="1.0" standalone="no" ?>
<manifest identifier="$id" version="1"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                      http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="$org">
    <organization identifier="$org">
      <title>$esc</title>
      <item identifier="ITEM-1" identifierref="RES-1" isvisible="true">
        <title>$esc</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormtype="sco" href="index.html">
$($lignes -join "`n")
    </resource>
  </resources>
</manifest>
"@
[IO.File]::WriteAllText((Join-Path $src 'imsmanifest.xml'), $manifest.Replace("`r`n", "`n"), (New-Object Text.UTF8Encoding $false))

# Zip avec des chemins en "/" (Compress-Archive met des "\" que certaines plateformes refusent)
if (Test-Path $zip) { Remove-Item $zip -Confirm:$false }
$archive = [IO.Compression.ZipFile]::Open($zip, 'Create')
Get-ChildItem $src -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($src.Length + 1).Replace('\', '/')
  [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $rel)
}
$archive.Dispose()
"{0} : {1} fichiers, {2:N1} Mo" -f (Split-Path $zip -Leaf), ($fichiers.Count + 1), ((Get-Item $zip).Length / 1MB)
