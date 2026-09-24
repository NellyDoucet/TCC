# Extrait le texte des fichiers Excel (.xlsx) et Word (.docx) d'un dossier de chapitre,
# pour preparer les exercices. Lit chaque feuille d'un seul bloc (rapide) et se limite
# aux 150 premieres lignes et 26 premieres colonnes.
# Usage : extraire-supports.ps1 -Dossier "<chemin du dossier>" -Sortie "<fichier texte>"
param(
  [Parameter(Mandatory = $true)][string]$Dossier,
  [Parameter(Mandatory = $true)][string]$Sortie
)
$lignes = New-Object System.Collections.Generic.List[string]

$xlsx = Get-ChildItem $Dossier -Recurse -Filter '*.xlsx' | Where-Object { $_.Name -notlike '~$*' } | Sort-Object FullName
if ($xlsx) {
  $xl = New-Object -ComObject Excel.Application
  $xl.Visible = $false; $xl.DisplayAlerts = $false
  try {
    foreach ($f in $xlsx) {
      $lignes.Add("############ $($f.Name)")
      $wb = $xl.Workbooks.Open($f.FullName, 0, $true)
      foreach ($ws in $wb.Worksheets) {
        $lignes.Add("=== Feuille : $($ws.Name)")
        $ur = $ws.UsedRange
        $nr = [Math]::Min($ur.Rows.Count, 150); $nc = [Math]::Min($ur.Columns.Count, 26)
        if ($nr -lt 1 -or $nc -lt 1) { continue }
        $plage = $ws.Range($ur.Cells.Item(1, 1), $ur.Cells.Item($nr, $nc))
        $textes = $plage.Value2; $formules = $plage.Formula
        for ($r = 1; $r -le $nr; $r++) {
          $cells = @()
          for ($c = 1; $c -le $nc; $c++) {
            if ($nr -eq 1 -and $nc -eq 1) { $v = $textes; $fo = $formules } else { $v = $textes[$r, $c]; $fo = $formules[$r, $c] }
            if ($null -eq $v -or "$v".Trim() -eq '') { continue }
            $adr = $plage.Cells.Item($r, $c).Address($false, $false)
            $t = "$v"
            if ("$fo".StartsWith('=')) { $t = "$t {$fo}" }
            $cells += "[$adr] $t"
          }
          if ($cells.Count) { $lignes.Add(($cells -join ' | ')) }
        }
      }
      $wb.Close($false)
    }
  } finally { $xl.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($xl) }
}

$docx = Get-ChildItem $Dossier -Recurse -Filter '*.docx' | Where-Object { $_.Name -notlike '~$*' } | Sort-Object FullName
if ($docx) {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  try {
    foreach ($f in $docx) {
      $lignes.Add("############ $($f.Name)")
      $d = $word.Documents.Open($f.FullName, $false, $true)
      $lignes.Add($d.Content.Text)
      $lignes.Add("(images dans le document : $($d.InlineShapes.Count + $d.Shapes.Count))")
      $d.Close($false)
    }
  } finally { $word.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
}

[IO.File]::WriteAllLines($Sortie, $lignes, (New-Object Text.UTF8Encoding $false))
"$($lignes.Count) lignes écrites dans $Sortie"
