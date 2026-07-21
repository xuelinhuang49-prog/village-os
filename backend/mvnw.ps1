# Apache Maven Wrapper PowerShell script
# Usage: .\mvnw.ps1 spring-boot:run

$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$WrapperJar = Join-Path $ProjectDir ".mvn\wrapper\maven-wrapper.jar"

if (-not (Test-Path $WrapperJar)) {
    Write-Host "[ERROR] $WrapperJar not found" -ForegroundColor Red
    exit 1
}

# === Find Java ===
$JavaExe = $null

# 1) Try JAVA_HOME (validate it's a real JDK)
if ($env:JAVA_HOME) {
    $candidate = Join-Path $env:JAVA_HOME "bin\java.exe"
    if (Test-Path $candidate) {
        $JavaExe = $candidate
        Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Gray
    } else {
        Write-Host "[WARN] JAVA_HOME=$env:JAVA_HOME 无效 (bin\java.exe 不存在)，自动探测..." -ForegroundColor Yellow
    }
}

# 2) Auto-detect from registry
if (-not $JavaExe) {
    $regPaths = @(
        "HKLM:\SOFTWARE\JavaSoft\JDK\19",
        "HKLM:\SOFTWARE\JavaSoft\JDK\17",
        "HKLM:\SOFTWARE\JavaSoft\JDK\21"
    )
    foreach ($rp in $regPaths) {
        $jh = (Get-ItemProperty $rp -Name JavaHome -ErrorAction SilentlyContinue).JavaHome
        if ($jh) {
            $candidate = Join-Path $jh "bin\java.exe"
            if (Test-Path $candidate) {
                $JavaExe = $candidate
                $env:JAVA_HOME = $jh
                Write-Host "JAVA_HOME: $jh (from registry)" -ForegroundColor Gray
                break
            }
        }
    }
}

# 3) Auto-detect from PATH
if (-not $JavaExe) {
    $javaCmd = (Get-Command java -ErrorAction SilentlyContinue).Source
    if ($javaCmd) {
        $JavaExe = $javaCmd
        Write-Host "Java: $javaCmd (from PATH)" -ForegroundColor Gray
    }
}

# 4) Try common paths
if (-not $JavaExe) {
    $commonPaths = @(
        "D:\Program Files",
        "C:\Program Files\Java\jdk-17",
        "C:\Program Files\Java\jdk-19",
        "C:\Program Files\Java\jdk-21",
        "C:\Program Files\Eclipse Adoptium\jdk-17.0.14.7-hotspot"
    )
    foreach ($cp in $commonPaths) {
        $candidate = Join-Path $cp "bin\java.exe"
        if (Test-Path $candidate) {
            $JavaExe = $candidate
            $env:JAVA_HOME = $cp
            Write-Host "JAVA_HOME: $cp (auto-detected)" -ForegroundColor Gray
            break
        }
    }
}

if (-not $JavaExe -or -not (Test-Path $JavaExe)) {
    Write-Host "[ERROR] JDK 17+ not found." -ForegroundColor Red
    Write-Host "  Option 1: set JAVA_HOME to your JDK directory (e.g. D:\Program Files\Java\jdk-17)" -ForegroundColor Yellow
    Write-Host "  Option 2: install JDK 17+ from https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}

# === Run Maven ===
$ArgsList = @(
    "-classpath", $WrapperJar,
    "-Dmaven.multiModuleProjectDirectory=$ProjectDir",
    "org.apache.maven.wrapper.MavenWrapperMain"
) + $args

& $JavaExe $ArgsList
exit $LASTEXITCODE
