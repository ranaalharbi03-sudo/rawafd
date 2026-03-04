$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:3000/")
$listener.Start()
Write-Host "SERVER READY on http://localhost:3000/"
$root = "C:\Users\ranaa\.gemini\antigravity\scratch\water-delivery"
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $url = $ctx.Request.Url.LocalPath
    if ($url -eq "/") { $url = "/index.html" }
    $filePath = Join-Path $root ($url -replace "/", "\")
    if (Test-Path $filePath) {
        $ext = [System.IO.Path]::GetExtension($filePath)
        $ct = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
        $ctx.Response.ContentType = $ct
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
        $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.Close()
    Write-Host "$($ctx.Request.HttpMethod) $url $($ctx.Response.StatusCode)"
}
