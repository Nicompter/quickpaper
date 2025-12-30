# Quickpaper Paper Server Installer for Windows
# PowerShell 5.1+ required
# Works with: irm https://quickpaper.nicompter.de/install | iex
#             .\start.ps1 [options]

# Wrap everything in a function to support both direct execution and iex piping
& {
param(
    [string]$Dir = "$env:USERPROFILE\paper-server",
    [string]$MCVersion = "",
    [string]$MinRam = "2G",
    [string]$MaxRam = "4G",
    [int]$Port = 25565,
    [string]$Op = "",
    [switch]$AutoUpdate,
    [switch]$Dashboard,
    [switch]$AcceptEula,
    [switch]$Yes,
    [switch]$NonInteractive,
    [string]$Lang = "",
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$VERSION = "0.1.0"

# Allow server /install to pre-set LANG_OVERRIDE
$LANG_OVERRIDE = if ($env:LANG_OVERRIDE) { $env:LANG_OVERRIDE } else { $Lang }

# Colors
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Cyan = "Cyan"
    Magenta = "Magenta"
    White = "White"
    Gray = "Gray"
}

function Write-Color {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Color -NoNewline
}

function Write-ColorLine {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

function Show-Usage {
    @"
Quickpaper Paper Server Installer (Windows)

Usage:
    irm https://quickpaper.nicompter.de/install | iex
    .\start.ps1 [options]

Options:
    -Dir PATH            Install directory (default: ~/paper-server)
    -MCVersion VERSION   Minecraft version (default: latest)
    -MinRam SIZE         JVM -Xms (default: 2G)
    -MaxRam SIZE         JVM -Xmx (default: 4G)
    -Port PORT           server-port (default: 25565)
    -Op PLAYER           Make this player an operator
    -AutoUpdate          Enable auto-update on server start
    -Dashboard           Install TheDashboard web panel plugin (1.21+ only)
    -AcceptEula          Accept Minecraft EULA (required in non-interactive mode)
    -Yes                 Auto-install missing dependencies (no prompts)
    -NonInteractive      Never prompt; use defaults and fail if required input missing
    -Lang de|en          Force language for installer output
    -Help                Show help
"@
}

function Get-SystemLanguage {
    if ($LANG_OVERRIDE) {
        return $LANG_OVERRIDE.ToLower()
    }
    
    $culture = [System.Globalization.CultureInfo]::CurrentCulture.Name
    if ($culture -like "de*") {
        return "de"
    }
    return "en"
}

$Script:CurrentLang = "en"

function T {
    param([string]$Key)
    
    $translations = @{
        "de:deps_check" = "→ Prüfe Abhängigkeiten..."
        "en:deps_check" = "→ Checking dependencies..."
        "de:prompt_dir" = "Wo soll der Server installiert werden? (Standard: $Dir): "
        "en:prompt_dir" = "Where should the server be installed? (default: $Dir): "
        "de:prompt_version" = "Welche Minecraft-Version? (Standard: {0}): "
        "en:prompt_version" = "Minecraft version? (default: {0}): "
        "de:fetch_build" = "→ Lade Build-Informationen..."
        "en:fetch_build" = "→ Fetching build info..."
        "de:download" = "→ Lade Paper herunter..."
        "en:download" = "→ Downloading Paper..."
        "de:prompt_minram" = "Minimaler RAM (Standard: 2G): "
        "en:prompt_minram" = "Minimum RAM (default: 2G): "
        "de:prompt_maxram" = "Maximaler RAM (Standard: 4G): "
        "en:prompt_maxram" = "Maximum RAM (default: 4G): "
        "de:prompt_port" = "Server-Port (Standard: 25565): "
        "en:prompt_port" = "Server port (default: 25565): "
        "de:prompt_eula" = "Minecraft EULA akzeptieren? (y/n): "
        "en:prompt_eula" = "Accept Minecraft EULA? (y/n): "
        "de:prompt_autoupdate" = "Auto-Update aktivieren? (y/n): "
        "en:prompt_autoupdate" = "Enable auto-update? (y/n): "
        "de:prompt_op" = "Dein Minecraft-Name (wird Operator, leer lassen zum Überspringen): "
        "en:prompt_op" = "Your Minecraft name (will be made operator, leave empty to skip): "
        "de:op_set" = "✓ {0} wird beim ersten Start automatisch OP."
        "en:op_set" = "✓ {0} will be made OP on first start."
        "de:eula_required" = "Du musst die EULA akzeptieren, um den Server zu starten."
        "en:eula_required" = "You must accept the EULA to run the server."
        "de:done" = "✓ Installation abgeschlossen!"
        "en:done" = "✓ Installation complete!"
        "de:no_java" = "Java wurde nicht gefunden. Bitte installiere Java 17+ von https://adoptium.net"
        "en:no_java" = "Java not found. Please install Java 17+ from https://adoptium.net"
        "de:installing_java" = "→ Installiere Java (Adoptium)..."
        "en:installing_java" = "→ Installing Java (Adoptium)..."
        "de:java_install_prompt" = "Java nicht gefunden. Automatisch installieren? (y/n): "
        "en:java_install_prompt" = "Java not found. Install automatically? (y/n): "
        "de:version_not_found" = "✗ Minecraft-Version '{0}' wurde nicht gefunden."
        "en:version_not_found" = "✗ Minecraft version '{0}' was not found."
        "de:available_versions" = "  Verfügbare Versionen: {0}"
        "en:available_versions" = "  Available versions: {0}"
        "de:fetch_versions" = "→ Lade verfügbare Versionen..."
        "en:fetch_versions" = "→ Fetching available versions..."
        "de:autoupdate_version_warning" = "! Hinweis: Du hast Version {0} gewählt, aber Auto-Update ist aktiviert."
        "en:autoupdate_version_warning" = "! Note: You selected version {0}, but auto-update is enabled."
        "de:autoupdate_version_warning2" = "  Der Server wird beim Start automatisch auf die neueste Version aktualisiert."
        "en:autoupdate_version_warning2" = "  The server will automatically update to the latest version on startup."
        "de:summary_dir" = "Server-Verzeichnis:"
        "en:summary_dir" = "Server directory:"
        "de:summary_start" = "Server starten:"
        "en:summary_start" = "Start server:"
        "de:summary_port" = "Port:"
        "en:summary_port" = "Port:"
        "de:summary_ram" = "RAM:"
        "en:summary_ram" = "RAM:"
        "de:summary_minecraft" = "Minecraft:"
        "en:summary_minecraft" = "Minecraft:"
        "de:summary_op" = "Operator:"
        "en:summary_op" = "Operator:"
        "de:summary_autoupdate" = "Auto-Update: aktiviert (aktualisiert zur neuesten Paper-Version)"
        "en:summary_autoupdate" = "Auto-Update: enabled (updates to latest Paper version)"
        "de:prompt_dashboard" = "TheDashboard Web-Panel installieren? (empfohlen) (y/n): "
        "en:prompt_dashboard" = "Install TheDashboard web panel? (recommended) (y/n): "
        "de:dashboard_info" = "→ TheDashboard: Verwalte deinen Server im Browser (Port 4646)"
        "en:dashboard_info" = "→ TheDashboard: Manage your server via browser (port 4646)"
        "de:dashboard_download" = "→ Lade TheDashboard Plugin herunter..."
        "en:dashboard_download" = "→ Downloading TheDashboard plugin..."
        "de:dashboard_installed" = "✓ TheDashboard installiert! Öffne http://<server-ip>:4646/ nach dem Start."
        "en:dashboard_installed" = "✓ TheDashboard installed! Open http://<server-ip>:4646/ after starting."
        "de:summary_dashboard" = "Dashboard: http://<server-ip>:4646/"
        "en:summary_dashboard" = "Dashboard: http://<server-ip>:4646/"
    }
    
    $lookupKey = "${Script:CurrentLang}:$Key"
    if ($translations.ContainsKey($lookupKey)) {
        return $translations[$lookupKey]
    }
    return $Key
}

function Show-Banner {
    Write-ColorLine @"

   ____        _      _                                   
  / __ \      (_)    | |                                  
 | |  | |_   _ _  ___| | ___ __   __ _ _ __   ___ _ __    
 | |  | | | | | |/ __| |/ / '_ \ / _`` | '_ \ / _ \ '__|   
 | |__| | |_| | | (__|   <| |_) | (_| | |_) |  __/ |      
  \___\_\__,_|_|\___|_|\_\ .__/ \__,_| .__/ \___|_|      
                          | |         | |                  
                          |_|         |_|                  

"@ "Magenta"
    Write-ColorLine "Minecraft Paper Server Installer" "Gray"
    Write-Host ""
}

function Test-JavaInstalled {
    try {
        $null = & java -version 2>&1
        return $true
    } catch {
        return $false
    }
}

function Install-Java {
    Write-ColorLine (T "installing_java") "Cyan"
    
    # Check if winget is available
    $wingetAvailable = $false
    try {
        $null = Get-Command winget -ErrorAction Stop
        $wingetAvailable = $true
    } catch {}
    
    if ($wingetAvailable) {
        Write-Host "  Using winget to install Adoptium JDK 21..."
        try {
            winget install --id EclipseAdoptium.Temurin.21.JDK --silent --accept-package-agreements --accept-source-agreements
            # Refresh PATH
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            return $true
        } catch {
            Write-ColorLine "  winget installation failed, trying manual download..." "Yellow"
        }
    }
    
    # Manual download fallback
    $arch = if ([Environment]::Is64BitOperatingSystem) { "x64" } else { "x86" }
    $msiUrl = "https://api.adoptium.net/v3/installer/latest/21/ga/windows/$arch/jdk/hotspot/normal/eclipse"
    $msiPath = "$env:TEMP\adoptium-jdk21.msi"
    
    Write-Host "  Downloading Adoptium JDK 21..."
    try {
        Invoke-WebRequest -Uri $msiUrl -OutFile $msiPath -UseBasicParsing
        Write-Host "  Installing..."
        Start-Process msiexec.exe -ArgumentList "/i", $msiPath, "/quiet", "/norestart" -Wait
        Remove-Item $msiPath -Force -ErrorAction SilentlyContinue
        
        # Refresh PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        return $true
    } catch {
        Write-ColorLine "  Failed to install Java automatically." "Red"
        Write-ColorLine (T "no_java") "Yellow"
        return $false
    }
}

function Ensure-Dependencies {
    Write-ColorLine (T "deps_check") "Cyan"
    
    if (Test-JavaInstalled) {
        return $true
    }
    
    if ($Yes) {
        return Install-Java
    }
    
    if ($NonInteractive) {
        Write-ColorLine (T "no_java") "Red"
        exit 1
    }
    
    Write-Host (T "java_install_prompt") -NoNewline
    $answer = Read-Host
    if ($answer -match "^[Yy]") {
        return Install-Java
    } else {
        Write-ColorLine (T "no_java") "Red"
        exit 1
    }
}

function Get-LatestVersion {
    try {
        $response = Invoke-RestMethod -Uri "https://api.papermc.io/v2/projects/paper" -UseBasicParsing
        $versions = $response.versions | Where-Object { $_ -match "^\d+\.\d+(\.\d+)?$" }
        return $versions[-1]
    } catch {
        throw "Could not fetch Paper versions from API"
    }
}

function Get-AllVersions {
    try {
        $response = Invoke-RestMethod -Uri "https://api.papermc.io/v2/projects/paper" -UseBasicParsing
        $versions = $response.versions | Where-Object { $_ -match "^\d+\.\d+(\.\d+)?$" }
        [array]::Reverse($versions)
        return $versions -join " "
    } catch {
        return ""
    }
}

function Get-LatestBuildForVersion {
    param([string]$Version)
    try {
        $response = Invoke-RestMethod -Uri "https://api.papermc.io/v2/projects/paper/versions/$Version" -UseBasicParsing
        return $response.builds[-1]
    } catch {
        return $null
    }
}

function Download-Paper {
    param(
        [string]$Version,
        [string]$Build
    )
    $url = "https://api.papermc.io/v2/projects/paper/versions/$Version/builds/$Build/downloads/paper-$Version-$Build.jar"
    Invoke-WebRequest -Uri $url -OutFile "paperclip.jar" -UseBasicParsing
}

# Check if version is 1.21.x (compatible with TheDashboard)
function Test-Version121 {
    param([string]$Version)
    return $Version -match "^1\.21(\.[0-9]+)?$"
}

# Download TheDashboard plugin from Modrinth
function Download-Dashboard {
    Write-ColorLine (T "dashboard_download") "Cyan"
    
    if (-not (Test-Path "plugins")) {
        New-Item -ItemType Directory -Path "plugins" -Force | Out-Null
    }
    
    try {
        $headers = @{ "User-Agent" = "quickpaper/1.0" }
        $response = Invoke-RestMethod -Uri "https://api.modrinth.com/v2/project/thedashboard/version" -Headers $headers -UseBasicParsing
        
        # Get the first (latest) version's primary file
        $latestVersion = $response[0]
        $primaryFile = $latestVersion.files | Where-Object { $_.primary -eq $true } | Select-Object -First 1
        
        if (-not $primaryFile) {
            $primaryFile = $latestVersion.files[0]
        }
        
        $downloadUrl = $primaryFile.url
        $filename = $primaryFile.filename
        
        Invoke-WebRequest -Uri $downloadUrl -OutFile "plugins\$filename" -Headers $headers -UseBasicParsing
        
        Write-ColorLine (T "dashboard_installed") "Green"
        return $true
    } catch {
        Write-ColorLine "Could not download TheDashboard." "Yellow"
        return $false
    }
}

function Prompt-Input {
    param(
        [string]$MessageKey,
        [string]$Default,
        [string]$FormatArg = ""
    )
    
    if ($NonInteractive) {
        return $Default
    }
    
    $message = T $MessageKey
    if ($FormatArg) {
        $message = $message -f $FormatArg
    }
    Write-Host $message -NoNewline
    $input = Read-Host
    if ([string]::IsNullOrWhiteSpace($input)) {
        return $Default
    }
    return $input
}

function Prompt-YesNo {
    param(
        [string]$MessageKey,
        [string]$Default = "n"
    )
    
    if ($NonInteractive) {
        return $Default -eq "y"
    }
    
    Write-Host (T $MessageKey) -NoNewline
    $answer = Read-Host
    if ([string]::IsNullOrWhiteSpace($answer)) {
        $answer = $Default
    }
    return $answer -match "^[Yy]"
}

function Main {
    if ($Help) {
        Show-Usage
        return
    }
    
    $Script:CurrentLang = Get-SystemLanguage
    
    Show-Banner
    
    if (-not (Ensure-Dependencies)) {
        return
    }
    
    # Prompt for directory if not in non-interactive mode
    if (-not $NonInteractive -and $Dir -eq "$env:USERPROFILE\paper-server") {
        $Dir = Prompt-Input "prompt_dir" $Dir
    }
    
    # Create directory
    if (-not (Test-Path $Dir)) {
        New-Item -ItemType Directory -Path $Dir -Force | Out-Null
    }
    Set-Location $Dir
    
    # Fetch versions
    Write-ColorLine (T "fetch_versions") "Cyan"
    $latestVersion = Get-LatestVersion
    
    # Get Minecraft version
    if ([string]::IsNullOrEmpty($MCVersion)) {
        if ($NonInteractive) {
            $MCVersion = $latestVersion
        } else {
            $MCVersion = Prompt-Input "prompt_version" $latestVersion $latestVersion
        }
    }
    
    # Fetch build
    Write-ColorLine (T "fetch_build") "Cyan"
    $build = Get-LatestBuildForVersion $MCVersion
    
    if (-not $build) {
        $availableVersions = Get-AllVersions
        Write-ColorLine ((T "version_not_found") -f $MCVersion) "Red"
        Write-ColorLine ((T "available_versions") -f $availableVersions) "White"
        throw "Please choose a valid Minecraft version."
    }
    
    # Download Paper
    Write-ColorLine (T "download") "Cyan"
    Download-Paper -Version $MCVersion -Build $build
    
    # Interactive prompts
    if (-not $NonInteractive) {
        $MinRam = Prompt-Input "prompt_minram" $MinRam
        $MaxRam = Prompt-Input "prompt_maxram" $MaxRam
        $Port = [int](Prompt-Input "prompt_port" $Port)
        
        if ([string]::IsNullOrEmpty($Op)) {
            $Op = Prompt-Input "prompt_op" ""
        }
        
        if (-not $AutoUpdate) {
            $AutoUpdate = Prompt-YesNo "prompt_autoupdate" "y"
        }
        
        # Ask about TheDashboard for 1.21.x versions
        if (-not $Dashboard -and (Test-Version121 $MCVersion)) {
            Write-Host ""
            Write-ColorLine (T "dashboard_info") "Cyan"
            $Dashboard = Prompt-YesNo "prompt_dashboard" "y"
        }
    }
    
    # Install TheDashboard if requested and version is compatible
    if ($Dashboard) {
        if (Test-Version121 $MCVersion) {
            Download-Dashboard | Out-Null
        } else {
            Write-ColorLine "! TheDashboard requires Minecraft 1.21.x, skipping." "Yellow"
            $Dashboard = $false
        }
    }
    
    # Server properties
    $serverProps = @"
server-port=$Port
motd=A Minecraft Server created by Quickpaper
"@
    Set-Content -Path "server.properties" -Value $serverProps
    
    # OP player
    if (-not [string]::IsNullOrEmpty($Op)) {
        Set-Content -Path "ops.txt" -Value $Op
        Write-ColorLine ((T "op_set") -f $Op) "Green"
    }
    
    # EULA
    if ($AcceptEula) {
        Set-Content -Path "eula.txt" -Value "eula=true"
    } else {
        if ($NonInteractive) {
            Write-ColorLine (T "eula_required") "Red"
            throw "Re-run with -AcceptEula"
        }
        if (Prompt-YesNo "prompt_eula" "n") {
            Set-Content -Path "eula.txt" -Value "eula=true"
        } else {
            Write-ColorLine (T "eula_required") "Yellow"
            return
        }
    }
    
    # Save version info
    Set-Content -Path ".paper-version" -Value $MCVersion
    Set-Content -Path ".paper-build" -Value $build
    
    # Generate start script
    if ($AutoUpdate) {
        $startScript = @'
# Paper Server Start Script with Auto-Update
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

Set-Location $PSScriptRoot

function Check-Update {
    Write-Host "→ Checking for Paper updates..." -ForegroundColor Cyan
    
    $currentVersion = if (Test-Path ".paper-version") { Get-Content ".paper-version" } else { "" }
    $currentBuild = if (Test-Path ".paper-build") { Get-Content ".paper-build" } else { "" }
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.papermc.io/v2/projects/paper" -UseBasicParsing
        $latestVersion = ($response.versions | Where-Object { $_ -match "^\d+\.\d+(\.\d+)?$" })[-1]
        
        $buildResponse = Invoke-RestMethod -Uri "https://api.papermc.io/v2/projects/paper/versions/$latestVersion" -UseBasicParsing
        $latestBuild = $buildResponse.builds[-1]
        
        if ($latestVersion -ne $currentVersion -or $latestBuild -ne $currentBuild) {
            if ($latestVersion -ne $currentVersion) {
                Write-Host "  ✓ New Paper version available: $currentVersion → $latestVersion" -ForegroundColor Green
            } else {
                Write-Host "  ✓ New build available: $currentVersion build $currentBuild → $latestBuild" -ForegroundColor Green
            }
            Write-Host "  → Downloading Paper $latestVersion (build $latestBuild)..."
            
            $url = "https://api.papermc.io/v2/projects/paper/versions/$latestVersion/builds/$latestBuild/downloads/paper-$latestVersion-$latestBuild.jar"
            Invoke-WebRequest -Uri $url -OutFile "paperclip.jar.new" -UseBasicParsing
            Move-Item "paperclip.jar.new" "paperclip.jar" -Force
            Set-Content -Path ".paper-version" -Value $latestVersion
            Set-Content -Path ".paper-build" -Value $latestBuild
            Write-Host "  ✓ Update complete!" -ForegroundColor Green
        } else {
            Write-Host "  ✓ Already on latest version ($currentVersion build $currentBuild)" -ForegroundColor Green
        }
    } catch {
        Write-Host "  Could not check for updates." -ForegroundColor Yellow
    }
    Write-Host ""
}

Check-Update
'@
        $startScript += "`njava -Xms$MinRam -Xmx$MaxRam -jar paperclip.jar nogui"
    } else {
        $startScript = @"
# Paper Server Start Script
Set-Location `$PSScriptRoot
java -Xms$MinRam -Xmx$MaxRam -jar paperclip.jar nogui
"@
    }
    Set-Content -Path "start.ps1" -Value $startScript
    
    # Also create a batch file for easy double-click starting
    $batchScript = @"
@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File start.ps1
pause
"@
    Set-Content -Path "start.bat" -Value $batchScript
    
    $absPath = (Get-Location).Path
    
    # Warning for auto-update with specific version
    if ($AutoUpdate -and $MCVersion -ne $latestVersion) {
        Write-Host ""
        Write-ColorLine ((T "autoupdate_version_warning") -f $MCVersion) "Yellow"
        Write-ColorLine (T "autoupdate_version_warning2") "Yellow"
    }
    
    Write-Host ""
    Write-Host "============================================"
    Write-ColorLine (T "done") "Green"
    Write-Host "$(T 'summary_dir') $absPath"
    Write-Host "$(T 'summary_start') start.bat"
    Write-Host "$(T 'summary_port') $Port"
    Write-Host "$(T 'summary_ram') $MinRam - $MaxRam"
    Write-Host "$(T 'summary_minecraft') $MCVersion (build $build)"
    if (-not [string]::IsNullOrEmpty($Op)) {
        Write-Host "$(T 'summary_op') $Op"
    }
    if ($AutoUpdate) {
        Write-ColorLine (T "summary_autoupdate") "White"
    }
    if ($Dashboard -and (Test-Version121 $MCVersion)) {
        Write-ColorLine (T "summary_dashboard") "White"
    }
    Write-Host "============================================"
}

Main
} @args
