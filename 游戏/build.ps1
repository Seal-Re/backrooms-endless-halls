$src="D:\AgentWorkStation\Any\SCP\游戏\src"; $out="D:\AgentWorkStation\Any\SCP\游戏\后室-无尽回廊.html"
$order=@("engine.js","data\items.js","data\entities.js","data\orgs.js","data\endings.js","data\starts.js")
$levels=Get-ChildItem (Join-Path $src "data\levels") -Filter *.js | Sort-Object Name | ForEach-Object { "data\levels\"+$_.Name }
$tail=@("data\boot.js","ui.js")
$all=$order+$levels+$tail
$js=($all | ForEach-Object { "// ===== $_ ===== `n" + (Get-Content (Join-Path $src $_) -Raw -Encoding UTF8) }) -join "`n`n"
$css=Get-Content (Join-Path $src "style.css") -Raw -Encoding UTF8
$html=(Get-Content (Join-Path $src "index.template.html") -Raw -Encoding UTF8).Replace("/*__CSS__*/",$css).Replace("/*__JS__*/",$js)
[System.IO.File]::WriteAllText($out,$html,[System.Text.UTF8Encoding]::new($false))
"built -> $out"
