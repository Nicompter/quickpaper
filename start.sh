#!/usr/bin/env bash
set -euo pipefail

VERSION="0.1.0"

# Allow server /install to pre-set LANG_OVERRIDE=de|en before the script body.
LANG_OVERRIDE="${LANG_OVERRIDE:-}"
NON_INTERACTIVE=${NON_INTERACTIVE:-0}
AUTO_YES=${AUTO_YES:-0}
ACCEPT_EULA=${ACCEPT_EULA:-0}

SERVER_DIR_DEFAULT="$HOME/paper-server"
SERVER_DIR="$SERVER_DIR_DEFAULT"
MC_VERSION=""
MIN_RAM="2G"
MAX_RAM="4G"
SERVER_PORT="25565"
OP_PLAYER=""
AUTO_UPDATE=${AUTO_UPDATE:-0}
INSTALL_DASHBOARD=${INSTALL_DASHBOARD:-0}

# Detect operating system
detect_os() {
    local os=""
    case "$(uname -s)" in
        Linux*)     os="linux";;
        Darwin*)    os="macos";;
        FreeBSD*)   os="freebsd";;
        CYGWIN*)    os="windows";;
        MINGW*)     os="windows";;
        MSYS*)      os="windows";;
        *)          os="unknown";;
    esac
    echo "$os"
}

OS_TYPE="$(detect_os)"

usage() {
    cat <<'USAGE'
Quickpaper Paper Server Installer

Usage:
    curl -fsSL https://quickpaper.nicompter.de/install | bash
    curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- [options]

Options:
    --dir PATH            Install directory (default: ~/paper-server)
    --version VERSION     Minecraft version (default: latest)
    --min-ram SIZE        JVM -Xms (default: 2G)
    --max-ram SIZE        JVM -Xmx (default: 4G)
    --port PORT           server-port (default: 25565)
    --op PLAYER           Make this player an operator
    --auto-update         Enable auto-update on server start
    --dashboard           Install TheDashboard web panel plugin (1.21+ only)
    --accept-eula         Accept Minecraft EULA (required in non-interactive mode)
    --yes                 Auto-install missing dependencies (no prompts)
    --non-interactive     Never prompt; use defaults and fail if required input missing
    --lang de|en          Force language for installer output
    -h, --help            Show help
USAGE
}

die() {
    echo "${RED:-}ERROR:${RESET:-} $*" >&2
    exit 1
}

have() { command -v "$1" >/dev/null 2>&1; }

detect_lang() {
    if [ -n "$LANG_OVERRIDE" ]; then
        echo "$LANG_OVERRIDE"
        return
    fi

    local v="${LC_ALL:-${LANG:-}}"
    v="${v,,}"
    if [[ "$v" == de* ]]; then
        echo "de"
    else
        echo "en"
    fi
}

_LANG="en"

TTY_IN=""
HAS_TTY=0

setup_tty() {
    # When running via `curl ... | bash`, stdin is not a TTY.
    # To allow interactive prompts, read from /dev/tty when available.
    if [ -r /dev/tty ] && [ -w /dev/tty ]; then
        TTY_IN="/dev/tty"
        HAS_TTY=1
    else
        TTY_IN="/dev/null"
        HAS_TTY=0
    fi
}

setup_colors() {
    if [ "$HAS_TTY" -eq 1 ] && command -v tput >/dev/null 2>&1; then
        if [ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]; then
            BOLD="$(tput bold)"
            DIM="$(tput dim)"
            RESET="$(tput sgr0)"
            RED="$(tput setaf 1)"
            GREEN="$(tput setaf 2)"
            YELLOW="$(tput setaf 3)"
            BLUE="$(tput setaf 4)"
            MAGENTA="$(tput setaf 5)"
            CYAN="$(tput setaf 6)"
        fi
    fi
}

banner() {
    cat <<EOF
${MAGENTA:-}${BOLD:-}   ____        _      _                                   ${RESET:-}
${MAGENTA:-}${BOLD:-}  / __ \      (_)    | |                                  ${RESET:-}
${MAGENTA:-}${BOLD:-} | |  | |_   _ _  ___| | ___ __   __ _ _ __   ___ _ __    ${RESET:-}
${MAGENTA:-}${BOLD:-} | |  | | | | | |/ __| |/ / '_ \ / _\` | '_ \ / _ \ '__|   ${RESET:-}
${MAGENTA:-}${BOLD:-} | |__| | |_| | | (__|   <| |_) | (_| | |_) |  __/ |      ${RESET:-}
${MAGENTA:-}${BOLD:-}  \___\_\\__,_|_|\___|_|\_\ .__/ \__,_| .__/ \___|_|      ${RESET:-}
${MAGENTA:-}${BOLD:-}                          | |         | |                  ${RESET:-}
${MAGENTA:-}${BOLD:-}                          |_|         |_|                  ${RESET:-}

${DIM:-}Minecraft Paper Server Installer${RESET:-}
EOF
}

t() {
    local key="$1"
    case "${_LANG}:${key}" in
        de:header) banner ;;
        en:header) banner ;;
        de:deps_check) echo "${CYAN:-}→${RESET:-} Prüfe Abhängigkeiten..." ;;
        en:deps_check) echo "${CYAN:-}→${RESET:-} Checking dependencies..." ;;
        de:prompt_dir) echo -n "Wo soll der Server installiert werden? (Standard: ${SERVER_DIR_DEFAULT}): " ;;
        en:prompt_dir) echo -n "Where should the server be installed? (default: ${SERVER_DIR_DEFAULT}): " ;;
        de:prompt_version) echo -n "Welche Minecraft-Version? (Standard: ${LATEST_VERSION:-latest}): " ;;
        en:prompt_version) echo -n "Minecraft version? (default: ${LATEST_VERSION:-latest}): " ;;
        de:fetch_build) echo "${CYAN:-}→${RESET:-} Lade Build-Informationen..." ;;
        en:fetch_build) echo "${CYAN:-}→${RESET:-} Fetching build info..." ;;
        de:download) echo "${CYAN:-}→${RESET:-} Lade Paper herunter..." ;;
        en:download) echo "${CYAN:-}→${RESET:-} Downloading Paper..." ;;
        de:prompt_minram) echo -n "Minimaler RAM (Standard: 2G): " ;;
        en:prompt_minram) echo -n "Minimum RAM (default: 2G): " ;;
        de:prompt_maxram) echo -n "Maximaler RAM (Standard: 4G): " ;;
        en:prompt_maxram) echo -n "Maximum RAM (default: 4G): " ;;
        de:prompt_port) echo -n "Server-Port (Standard: 25565): " ;;
        en:prompt_port) echo -n "Server port (default: 25565): " ;;
        de:prompt_eula) echo -n "Minecraft EULA akzeptieren? (y/n): " ;;
        en:prompt_eula) echo -n "Accept Minecraft EULA? (y/n): " ;;
        de:prompt_autoupdate) echo -n "Auto-Update aktivieren? (Aktualisiert immer zur neuesten Paper-Version) (y/n): " ;;
        en:prompt_autoupdate) echo -n "Enable auto-update? (Always updates to latest Paper version) (y/n): " ;;
        de:prompt_op) echo -n "Dein Minecraft-Name (wird Operator, leer lassen zum Überspringen): " ;;
        en:prompt_op) echo -n "Your Minecraft name (will be made operator, leave empty to skip): " ;;
        de:op_set) echo "${GREEN:-}✓${RESET:-} ${OP_PLAYER} wird beim ersten Start automatisch OP." ;;
        en:op_set) echo "${GREEN:-}✓${RESET:-} ${OP_PLAYER} will be made OP on first start." ;;
        de:summary_op) echo "${BOLD:-}Operator:${RESET:-}" ;;
        en:summary_op) echo "${BOLD:-}Operator:${RESET:-}" ;;
        de:eula_required) echo "Du musst die EULA akzeptieren, um den Server zu starten." ;;
        en:eula_required) echo "You must accept the EULA to run the server." ;;
        de:done) echo "${GREEN:-}✓${RESET:-} Installation abgeschlossen!" ;;
        en:done) echo "${GREEN:-}✓${RESET:-} Installation complete!" ;;
        de:no_tty) echo "${YELLOW:-}!${RESET:-} Keine interaktive Konsole gefunden. Nutze --non-interactive und setze alle Optionen." ;;
        en:no_tty) echo "${YELLOW:-}!${RESET:-} No interactive terminal detected. Use --non-interactive and provide all options." ;;
        de:version_not_found) echo "${RED:-}✗${RESET:-} Minecraft-Version '${MC_VERSION}' wurde nicht gefunden." ;;
        en:version_not_found) echo "${RED:-}✗${RESET:-} Minecraft version '${MC_VERSION}' was not found." ;;
        de:available_versions) echo "  Verfügbare Versionen: ${AVAILABLE_VERSIONS:-}" ;;
        en:available_versions) echo "  Available versions: ${AVAILABLE_VERSIONS:-}" ;;
        de:fetch_versions) echo "${CYAN:-}→${RESET:-} Lade verfügbare Versionen..." ;;
        en:fetch_versions) echo "${CYAN:-}→${RESET:-} Fetching available versions..." ;;
        de:autoupdate_version_warning) echo "${YELLOW:-}!${RESET:-} Hinweis: Du hast Version ${MC_VERSION} gewählt, aber Auto-Update ist aktiviert." ;;
        en:autoupdate_version_warning) echo "${YELLOW:-}!${RESET:-} Note: You selected version ${MC_VERSION}, but auto-update is enabled." ;;
        de:autoupdate_version_warning2) echo "  Der Server wird beim Start automatisch auf die neueste Version aktualisiert." ;;
        en:autoupdate_version_warning2) echo "  The server will automatically update to the latest version on startup." ;;
        de:summary_dir) echo "${BOLD:-}Server-Verzeichnis:${RESET:-}" ;;
        en:summary_dir) echo "${BOLD:-}Server directory:${RESET:-}" ;;
        de:summary_start) echo "${BOLD:-}Server starten:${RESET:-}" ;;
        en:summary_start) echo "${BOLD:-}Start server:${RESET:-}" ;;
        de:summary_port) echo "${BOLD:-}Port:${RESET:-}" ;;
        en:summary_port) echo "${BOLD:-}Port:${RESET:-}" ;;
        de:summary_ram) echo "${BOLD:-}RAM:${RESET:-}" ;;
        en:summary_ram) echo "${BOLD:-}RAM:${RESET:-}" ;;
        de:summary_minecraft) echo "${BOLD:-}Minecraft:${RESET:-}" ;;
        en:summary_minecraft) echo "${BOLD:-}Minecraft:${RESET:-}" ;;
        de:summary_autoupdate) echo "${BOLD:-}Auto-Update:${RESET:-} aktiviert (aktualisiert zur neuesten Paper-Version)" ;;
        en:summary_autoupdate) echo "${BOLD:-}Auto-Update:${RESET:-} enabled (updates to latest Paper version)" ;;
        de:prompt_dashboard) echo -n "TheDashboard Web-Panel installieren? ${GREEN:-}(empfohlen)${RESET:-} (y/n): " ;;
        en:prompt_dashboard) echo -n "Install TheDashboard web panel? ${GREEN:-}(recommended)${RESET:-} (y/n): " ;;
        de:dashboard_info) echo "${CYAN:-}→${RESET:-} TheDashboard: Verwalte deinen Server im Browser (Port 4646)" ;;
        en:dashboard_info) echo "${CYAN:-}→${RESET:-} TheDashboard: Manage your server via browser (port 4646)" ;;
        de:dashboard_download) echo "${CYAN:-}→${RESET:-} Lade TheDashboard Plugin herunter..." ;;
        en:dashboard_download) echo "${CYAN:-}→${RESET:-} Downloading TheDashboard plugin..." ;;
        de:dashboard_installed) echo "${GREEN:-}✓${RESET:-} TheDashboard installiert! Öffne http://<server-ip>:4646/ nach dem Start." ;;
        en:dashboard_installed) echo "${GREEN:-}✓${RESET:-} TheDashboard installed! Open http://<server-ip>:4646/ after starting." ;;
        de:summary_dashboard) echo "${BOLD:-}Dashboard:${RESET:-} http://<server-ip>:4646/" ;;
        en:summary_dashboard) echo "${BOLD:-}Dashboard:${RESET:-} http://<server-ip>:4646/" ;;
        de:summary_tmux) echo "${BOLD:-}tmux Session:${RESET:-} minecraft" ;;
        en:summary_tmux) echo "${BOLD:-}tmux session:${RESET:-} minecraft" ;;
        de:tmux_info) echo "${CYAN:-}→${RESET:-} Der Server läuft in einer tmux-Session." ;;
        en:tmux_info) echo "${CYAN:-}→${RESET:-} Server runs in a tmux session." ;;
        de:tmux_usage) echo "  ${DIM:-}tmux attach -t minecraft${RESET:-} - Zur Konsole verbinden" ;;
        en:tmux_usage) echo "  ${DIM:-}tmux attach -t minecraft${RESET:-} - Attach to console" ;;
        de:tmux_detach) echo "  ${DIM:-}Strg+B, dann D${RESET:-} - Konsole verlassen (Server läuft weiter)" ;;
        en:tmux_detach) echo "  ${DIM:-}Ctrl+B, then D${RESET:-} - Detach (server keeps running)" ;;
        de:tmux_running) echo "${YELLOW:-}!${RESET:-} tmux-Session 'minecraft' läuft bereits." ;;
        en:tmux_running) echo "${YELLOW:-}!${RESET:-} tmux session 'minecraft' is already running." ;;
        de:tmux_attach_hint) echo "  Nutze ${BOLD:-}tmux attach -t minecraft${RESET:-} um zu verbinden." ;;
        en:tmux_attach_hint) echo "  Use ${BOLD:-}tmux attach -t minecraft${RESET:-} to attach." ;;
        *) echo "$key" ;;
    esac
}

prompt() {
    local var_name="$1"
    local message_key="$2"
    local default_value="$3"

    if [ "$NON_INTERACTIVE" -eq 1 ]; then
        printf -v "$var_name" "%s" "$default_value"
        return
    fi

    t "$message_key"
    local input=""
    # Read from TTY so prompts work with `curl | bash`.
    IFS= read -r input < "$TTY_IN" || true
    if [ -z "$input" ]; then
        input="$default_value"
    fi
    printf -v "$var_name" "%s" "$input"
}

prompt_yn() {
    local message_key="$1"
    local default_answer="$2" # y or n
    local out_var="$3"

    if [ "$NON_INTERACTIVE" -eq 1 ]; then
        printf -v "$out_var" "%s" "$default_answer"
        return
    fi

    t "$message_key"
    local input=""
    IFS= read -r input < "$TTY_IN" || true
    input="${input:-$default_answer}"
    input="${input,,}"
    printf -v "$out_var" "%s" "$input"
}

install_deps_linux() {
    local packages=("curl" "ca-certificates" "tmux")
    local java_pkg=""

    # Java 21 is recommended for modern Paper versions.
    if have apt-get; then
        java_pkg="openjdk-21-jre-headless"
        sudo apt-get update -y
        sudo apt-get install -y "${packages[@]}" "$java_pkg"
    elif have dnf; then
        java_pkg="java-21-openjdk"
        sudo dnf install -y "${packages[@]}" "$java_pkg"
    elif have pacman; then
        java_pkg="jre-openjdk"
        sudo pacman -Sy --noconfirm "${packages[@]}" "$java_pkg"
    elif have apk; then
        # Alpine packages differ; use openjdk21-jre when available.
        java_pkg="openjdk21-jre"
        sudo apk add --no-cache "${packages[@]}" "$java_pkg" || sudo apk add --no-cache "${packages[@]}" "openjdk17-jre"
    elif have zypper; then
        # openSUSE
        java_pkg="java-21-openjdk"
        sudo zypper install -y curl ca-certificates tmux "$java_pkg"
    elif have emerge; then
        # Gentoo
        sudo emerge --ask=n dev-java/openjdk:21 net-misc/curl app-misc/tmux
    else
        die "Unsupported package manager. Please install Java (17+), curl, tmux and CA certificates manually."
    fi
}

install_deps_macos() {
    # Check for Homebrew
    if ! have brew; then
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        # Add brew to PATH for this session
        if [ -f "/opt/homebrew/bin/brew" ]; then
            eval "$(/opt/homebrew/bin/brew shellenv)"
        elif [ -f "/usr/local/bin/brew" ]; then
            eval "$(/usr/local/bin/brew shellenv)"
        fi
    fi
    
    brew install openjdk@21 tmux
    
    # Create symlink for system Java wrappers to find this JDK
    if [ -d "/opt/homebrew/opt/openjdk@21" ]; then
        sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk 2>/dev/null || true
    elif [ -d "/usr/local/opt/openjdk@21" ]; then
        sudo ln -sfn /usr/local/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk 2>/dev/null || true
    fi
}

install_deps_freebsd() {
    sudo pkg install -y openjdk21 curl ca_root_nss tmux
}

install_deps() {
    case "$OS_TYPE" in
        linux)   install_deps_linux ;;
        macos)   install_deps_macos ;;
        freebsd) install_deps_freebsd ;;
        *)       die "Automatic dependency installation not supported on $OS_TYPE. Please install Java 17+ and curl manually." ;;
    esac
}

ensure_deps() {
    t deps_check

    local missing=0
    local missing_list=""

    if ! have curl; then
        missing=1
        missing_list="curl"
    fi
    if ! have java; then
        missing=1
        missing_list="${missing_list:+$missing_list, }java"
    fi
    if ! have tmux; then
        missing=1
        missing_list="${missing_list:+$missing_list, }tmux"
    fi

    if [ "$missing" -eq 0 ]; then
        return
    fi

    if [ "$AUTO_YES" -eq 1 ]; then
        install_deps
        return
    fi

    if [ "$NON_INTERACTIVE" -eq 1 ]; then
        die "Missing dependencies ($missing_list). Re-run with --yes or install them manually."
    fi

    if [ "$(id -u)" -ne 0 ] && ! have sudo; then
        die "Missing dependencies and sudo is not available. Install $missing_list manually."
    fi

    local answer=""
    if [ "$_LANG" = "de" ]; then
        echo -n "Fehlende Abhängigkeiten gefunden ($missing_list). Automatisch installieren? (y/n): "
    else
        echo -n "Missing dependencies ($missing_list). Install automatically? (y/n): "
    fi
    IFS= read -r answer < "$TTY_IN" || true
    if [[ "$answer" =~ ^[Yy]$ ]]; then
        install_deps
    else
        die "Required dependencies missing."
    fi
}

latest_version() {
    curl -fsSL "https://api.papermc.io/v2/projects/paper" \
        | sed -n 's/.*"versions":\[\([^]]*\)\].*/\1/p' \
        | tr -d '"' \
        | tr ',' '\n' \
        | grep -E '^[0-9]+\.[0-9]+(\.[0-9]+)?$' \
        | tail -n 1
}

get_all_versions() {
    # Get all stable versions (no pre-releases, RCs, etc.)
    curl -fsSL "https://api.papermc.io/v2/projects/paper" \
        | sed -n 's/.*"versions":\[\([^]]*\)\].*/\1/p' \
        | tr -d '"' \
        | tr ',' '\n' \
        | grep -E '^[0-9]+\.[0-9]+(\.[0-9]+)?$' \
        | tac \
        | tr '\n' ' ' \
        | sed 's/ *$//'
}

latest_build_for_version() {
    local version="$1"
    # Suppress errors - we handle missing versions gracefully
    local result
    result="$(curl -fsSL "https://api.papermc.io/v2/projects/paper/versions/${version}" 2>/dev/null || true)"
    echo "$result" \
        | sed -n 's/.*"builds":\[\([^]]*\)\].*/\1/p' \
        | tr -d '[] ' \
        | tr ',' '\n' \
        | tail -n 1
}

download_paper() {
    local version="$1"
    local build="$2"
    local url="https://api.papermc.io/v2/projects/paper/versions/${version}/builds/${build}/downloads/paper-${version}-${build}.jar"
    
    # Use progress bar if TTY available, otherwise silent
    if [ "$HAS_TTY" -eq 1 ]; then
        curl -fL --progress-bar -o paperclip.jar "$url" 2>&1
    else
        curl -fsSL -o paperclip.jar "$url"
    fi
}

# Check if version is 1.21.x (compatible with TheDashboard)
is_version_121() {
    local version="$1"
    [[ "$version" =~ ^1\.21(\.[0-9]+)?$ ]]
}

# Download TheDashboard plugin from Modrinth
download_dashboard() {
    t dashboard_download
    mkdir -p plugins
    
    # Fetch all versions from Modrinth API (sorted by version_number descending)
    local api_response
    api_response="$(curl -fsSL -H "User-Agent: quickpaper/1.0" "https://api.modrinth.com/v2/project/thedashboard/version" 2>/dev/null || true)"
    
    if [ -z "$api_response" ]; then
        echo "${YELLOW:-}!${RESET:-} Could not fetch TheDashboard info from Modrinth."
        return 1
    fi
    
    # The API returns versions sorted with newest first
    # Extract the first .jar URL (from the latest version)
    local download_url=""
    
    # Look for the first cdn.modrinth.com URL ending in .jar
    # The response format has "url":"https://cdn.modrinth.com/.../TheDashboard-X.X.jar"
    download_url="$(echo "$api_response" | grep -oE '"url":"https://cdn\.modrinth\.com/[^"]+\.jar"' | head -n 1 | sed 's/"url":"//;s/"$//')"
    
    if [ -z "$download_url" ]; then
        echo "${YELLOW:-}!${RESET:-} Could not find TheDashboard download URL."
        return 1
    fi
    
    # Extract filename from URL
    local filename
    filename="$(basename "$download_url")"
    
    # Download the plugin
    if [ "$HAS_TTY" -eq 1 ]; then
        curl -fL --progress-bar -H "User-Agent: quickpaper/1.0" -o "plugins/${filename}" "$download_url" 2>&1
    else
        curl -fsSL -H "User-Agent: quickpaper/1.0" -o "plugins/${filename}" "$download_url"
    fi
    
    t dashboard_installed
    return 0
}

parse_args() {
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --dir)
                shift
                [ "$#" -gt 0 ] || die "--dir requires a value"
                SERVER_DIR="$1"
                ;;
            --version)
                shift
                [ "$#" -gt 0 ] || die "--version requires a value"
                MC_VERSION="$1"
                ;;
            --min-ram)
                shift
                [ "$#" -gt 0 ] || die "--min-ram requires a value"
                MIN_RAM="$1"
                ;;
            --max-ram)
                shift
                [ "$#" -gt 0 ] || die "--max-ram requires a value"
                MAX_RAM="$1"
                ;;
            --port)
                shift
                [ "$#" -gt 0 ] || die "--port requires a value"
                SERVER_PORT="$1"
                ;;
            --op)
                shift
                [ "$#" -gt 0 ] || die "--op requires a value"
                OP_PLAYER="$1"
                ;;
            --auto-update)
                AUTO_UPDATE=1
                ;;
            --dashboard)
                INSTALL_DASHBOARD=1
                ;;
            --accept-eula)
                ACCEPT_EULA=1
                ;;
            --yes)
                AUTO_YES=1
                ;;
            --non-interactive)
                NON_INTERACTIVE=1
                ;;
            --lang)
                shift
                [ "$#" -gt 0 ] || die "--lang requires a value"
                LANG_OVERRIDE="$1"
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                die "Unknown option: $1 (use --help)"
                ;;
        esac
        shift
    done
}

main() {
    parse_args "$@"
    setup_tty
    setup_colors
    _LANG="$(detect_lang)"

    # If the user didn't explicitly request non-interactive, but we have no TTY,
    # switch to non-interactive so the script doesn't exit due to prompt reads.
    if [ "$NON_INTERACTIVE" -eq 0 ] && [ "$HAS_TTY" -eq 0 ]; then
        NON_INTERACTIVE=1
        t no_tty
    fi

    t header

    ensure_deps

    if [ "$SERVER_DIR" = "$SERVER_DIR_DEFAULT" ] && [ "$NON_INTERACTIVE" -eq 0 ]; then
        prompt SERVER_DIR prompt_dir "$SERVER_DIR_DEFAULT"
    fi

    mkdir -p "$SERVER_DIR"
    cd "$SERVER_DIR" || die "Could not cd into install directory"

    # Fetch available versions upfront
    t fetch_versions
    LATEST_VERSION="$(latest_version)"
    [ -n "$LATEST_VERSION" ] || die "Could not fetch Paper versions from API"

    if [ -z "$MC_VERSION" ]; then
        if [ "$NON_INTERACTIVE" -eq 1 ]; then
            MC_VERSION="$LATEST_VERSION"
        else
            prompt MC_VERSION prompt_version "$LATEST_VERSION"
        fi
    fi

    t fetch_build
    local build
    build="$(latest_build_for_version "$MC_VERSION")"
    
    if [ -z "$build" ]; then
        # Version not found - show helpful error
        AVAILABLE_VERSIONS="$(get_all_versions)"
        t version_not_found
        t available_versions
        die "Please choose a valid Minecraft version."
    fi

    t download
    download_paper "$MC_VERSION" "$build"

    if [ "$NON_INTERACTIVE" -eq 0 ]; then
        prompt MIN_RAM prompt_minram "$MIN_RAM"
        prompt MAX_RAM prompt_maxram "$MAX_RAM"
        prompt SERVER_PORT prompt_port "$SERVER_PORT"
        
        # Ask for OP player if not set via flag
        if [ -z "$OP_PLAYER" ]; then
            prompt OP_PLAYER prompt_op ""
        fi
        
        # Ask about auto-update if not set via flag
        if [ "$AUTO_UPDATE" -eq 0 ]; then
            local autoupdate_answer=""
            prompt_yn prompt_autoupdate "y" autoupdate_answer
            if [[ "$autoupdate_answer" =~ ^y$ ]]; then
                AUTO_UPDATE=1
            fi
        fi
        
        # Ask about TheDashboard for 1.21.x versions
        if [ "$INSTALL_DASHBOARD" -eq 0 ] && is_version_121 "$MC_VERSION"; then
            echo
            t dashboard_info
            local dashboard_answer=""
            prompt_yn prompt_dashboard "y" dashboard_answer
            if [[ "$dashboard_answer" =~ ^y$ ]]; then
                INSTALL_DASHBOARD=1
            fi
        fi
    fi

    # Install TheDashboard if requested and version is compatible
    if [ "$INSTALL_DASHBOARD" -eq 1 ]; then
        if is_version_121 "$MC_VERSION"; then
            download_dashboard || true
        else
            echo "${YELLOW:-}!${RESET:-} TheDashboard requires Minecraft 1.21.x, skipping."
        fi
    fi

    # Create/update server.properties
    if [ -f server.properties ]; then
        if sed --version >/dev/null 2>&1; then
            sed -i "s/^server-port=.*/server-port=${SERVER_PORT}/" server.properties
            sed -i "s/^motd=.*/motd=A Minecraft Server created by Quickpaper/" server.properties
        else
            # BSD sed (macOS)
            sed -i '' "s/^server-port=.*/server-port=${SERVER_PORT}/" server.properties
            sed -i '' "s/^motd=.*/motd=A Minecraft Server created by Quickpaper/" server.properties
        fi
    else
        cat > server.properties <<EOF
server-port=${SERVER_PORT}
motd=A Minecraft Server created by Quickpaper
EOF
    fi

    # Create ops.txt for the OP player (Paper will convert to ops.json on first start)
    if [ -n "$OP_PLAYER" ]; then
        echo "$OP_PLAYER" > ops.txt
        t op_set
    fi

    if [ "$ACCEPT_EULA" -eq 1 ]; then
        echo "eula=true" > eula.txt
    else
        if [ "$NON_INTERACTIVE" -eq 1 ]; then
            t eula_required
            die "Re-run with --accept-eula"
        fi
        local eula_answer=""
        prompt_yn prompt_eula "n" eula_answer
        if [[ "$eula_answer" =~ ^y$ ]]; then
            echo "eula=true" > eula.txt
        else
            t eula_required
            exit 1
        fi
    fi

    # Save current version info for auto-update
    echo "${MC_VERSION}" > .paper-version
    echo "${build}" > .paper-build

    # Generate start.sh with or without auto-update
    if [ "$AUTO_UPDATE" -eq 1 ]; then
        cat > start.sh <<'STARTSCRIPT'
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

SESSION_NAME="minecraft"

# Check if tmux session already exists
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "! tmux session '$SESSION_NAME' is already running."
    echo "  Use 'tmux attach -t $SESSION_NAME' to attach."
    echo "  Or 'tmux kill-session -t $SESSION_NAME' to stop it first."
    exit 1
fi

# Auto-update: Always updates to the LATEST Paper version (major updates!)
check_update() {
    echo "→ Checking for Paper updates..."
    
    local current_version current_build
    current_version="$(cat .paper-version 2>/dev/null || echo "")"
    current_build="$(cat .paper-build 2>/dev/null || echo "")"
    
    # Get LATEST available Paper version (not just builds!)
    local latest_version
    latest_version="$(curl -fsSL "https://api.papermc.io/v2/projects/paper" 2>/dev/null \
        | sed -n 's/.*"versions":\[\([^]]*\)\].*/\1/p' \
        | tr -d '"' \
        | tr ',' '\n' \
        | grep -E '^[0-9]+\.[0-9]+(\.[0-9]+)?$' \
        | tail -n 1 || echo "")"
    
    if [ -z "$latest_version" ]; then
        echo "  Could not check for updates."
        return
    fi
    
    # Get latest build for the latest version
    local latest_build
    latest_build="$(curl -fsSL "https://api.papermc.io/v2/projects/paper/versions/${latest_version}" 2>/dev/null \
        | sed -n 's/.*"builds":\[\([^]]*\)\].*/\1/p' \
        | tr -d '[] ' \
        | tr ',' '\n' \
        | tail -n 1 || echo "")"
    
    if [ -z "$latest_build" ]; then
        echo "  Could not fetch build info."
        return
    fi
    
    # Check if update needed (version OR build changed)
    if [ "$latest_version" != "$current_version" ] || [ "$latest_build" != "$current_build" ]; then
        if [ "$latest_version" != "$current_version" ]; then
            echo "  ✓ New Paper version available: ${current_version} → ${latest_version}"
        else
            echo "  ✓ New build available: ${current_version} build ${current_build} → ${latest_build}"
        fi
        echo "  → Downloading Paper ${latest_version} (build ${latest_build})..."
        
        local url="https://api.papermc.io/v2/projects/paper/versions/${latest_version}/builds/${latest_build}/downloads/paper-${latest_version}-${latest_build}.jar"
        if curl -fL --progress-bar -o paperclip.jar.new "$url" 2>&1; then
            mv paperclip.jar.new paperclip.jar
            echo "${latest_version}" > .paper-version
            echo "${latest_build}" > .paper-build
            echo "  ✓ Update complete!"
        else
            rm -f paperclip.jar.new
            echo "  ✗ Update failed, using existing version."
        fi
    else
        echo "  ✓ Already on latest version (${current_version} build ${current_build})"
    fi
    echo
}

check_update

echo "→ Starting server in tmux session '$SESSION_NAME'..."
echo "  Use 'tmux attach -t $SESSION_NAME' to view console"
echo "  Press Ctrl+B, then D to detach (server keeps running)"
echo
STARTSCRIPT
        # Append the tmux command with actual Java values
        echo "tmux new-session -d -s \"\$SESSION_NAME\" \"java -Xms${MIN_RAM} -Xmx${MAX_RAM} -jar paperclip.jar nogui\"" >> start.sh
        echo "echo \"✓ Server started! Session: \$SESSION_NAME\"" >> start.sh
    else
        cat > start.sh <<EOF
#!/usr/bin/env bash
set -euo pipefail
cd "\$(dirname "\$0")"

SESSION_NAME="minecraft"

# Check if tmux session already exists
if tmux has-session -t "\$SESSION_NAME" 2>/dev/null; then
    echo "! tmux session '\$SESSION_NAME' is already running."
    echo "  Use 'tmux attach -t \$SESSION_NAME' to attach."
    echo "  Or 'tmux kill-session -t \$SESSION_NAME' to stop it first."
    exit 1
fi

echo "→ Starting server in tmux session '\$SESSION_NAME'..."
echo "  Use 'tmux attach -t \$SESSION_NAME' to view console"
echo "  Press Ctrl+B, then D to detach (server keeps running)"
echo

tmux new-session -d -s "\$SESSION_NAME" "java -Xms${MIN_RAM} -Xmx${MAX_RAM} -jar paperclip.jar nogui"
echo "✓ Server started! Session: \$SESSION_NAME"
EOF
    fi
    chmod +x start.sh

    local abs_path
    abs_path="$(pwd -P)"

    # Warn if user selected old version but enabled auto-update
    if [ "$AUTO_UPDATE" -eq 1 ] && [ "$MC_VERSION" != "$LATEST_VERSION" ]; then
        echo
        t autoupdate_version_warning
        t autoupdate_version_warning2
    fi

    echo
    echo "============================================"
    t done
    echo -n "$(t summary_dir) "; echo "${abs_path}"
    echo -n "$(t summary_start) "; echo "cd ${abs_path} && ./start.sh"
    echo -n "$(t summary_port) "; echo "${SERVER_PORT}"
    echo -n "$(t summary_ram) "; echo "${MIN_RAM} - ${MAX_RAM}"
    echo -n "$(t summary_minecraft) "; echo "${MC_VERSION} (build ${build})"
    if [ -n "$OP_PLAYER" ]; then
        echo -n "$(t summary_op) "; echo "${OP_PLAYER}"
    fi
    if [ "$AUTO_UPDATE" -eq 1 ]; then
        t summary_autoupdate
    fi
    if [ "$INSTALL_DASHBOARD" -eq 1 ] && is_version_121 "$MC_VERSION"; then
        t summary_dashboard
    fi
    t summary_tmux
    echo "============================================"
    echo
    t tmux_info
    t tmux_usage
    t tmux_detach
}

main "$@"
