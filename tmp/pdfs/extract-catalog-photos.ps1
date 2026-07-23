Add-Type -AssemblyName System.Drawing

function Export-Crop($sourceName, $outputName, $x, $y, $width, $height) {
  $sourcePath = Join-Path $PSScriptRoot "rendered\$sourceName"
  $outputPath = Join-Path $PSScriptRoot "..\..\assets\$outputName"
  $source = [System.Drawing.Image]::FromFile($sourcePath)
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    $graphics.DrawImage(
      $source,
      (New-Object System.Drawing.Rectangle(0, 0, $width, $height)),
      (New-Object System.Drawing.Rectangle($x, $y, $width, $height)),
      [System.Drawing.GraphicsUnit]::Pixel
    )
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  }
  finally {
    $graphics.Dispose()
    $bitmap.Dispose()
    $source.Dispose()
  }
}

Export-Crop 'pagina-01.png' 'julia-capa.jpg' 0 0 1296 1500
Export-Crop 'pagina-02.png' 'julia-sobre.jpg' 0 0 1296 1500
Export-Crop 'pagina-08.png' 'julia-final.jpg' 0 0 1296 1650

Write-Output 'Fotos do catálogo extraídas.'
