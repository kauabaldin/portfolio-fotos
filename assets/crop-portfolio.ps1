Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $PSScriptRoot 'portfolio-contact-sheet.png'
$source = [System.Drawing.Image]::FromFile($sourcePath)
$cellWidth = [int]($source.Width / 3)
$cellHeight = [int]($source.Height / 2)

try {
  for ($index = 0; $index -lt 6; $index++) {
    $column = $index % 3
    $row = [Math]::Floor($index / 3)
    $bitmap = New-Object System.Drawing.Bitmap($cellWidth, $cellHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $destination = New-Object System.Drawing.Rectangle(0, 0, $cellWidth, $cellHeight)
      $sourceRectangle = New-Object System.Drawing.Rectangle(
        ($column * $cellWidth),
        ($row * $cellHeight),
        $cellWidth,
        $cellHeight
      )
      $graphics.DrawImage($source, $destination, $sourceRectangle, [System.Drawing.GraphicsUnit]::Pixel)
      $outputPath = Join-Path $PSScriptRoot ("portfolio-{0}.jpg" -f ($index + 1))
      $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    }
    finally {
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  }
}
finally {
  $source.Dispose()
}

Write-Output 'Seis imagens de portfólio geradas.'
