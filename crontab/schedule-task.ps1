# =====================================================
# Nexus — Windows Task Scheduler Setup
# =====================================================
# Run this once to create a daily 3AM backup task:
#   powershell -ExecutionPolicy Bypass -File crontab/schedule-task.ps1
# =====================================================

$TaskName = "NexusDailyBackup"
$ProjectRoot = "C:\Users\varga\Documents\Github\nexus\api"
$ScriptPath = "$ProjectRoot\scripts\backup.js"

# --- Check if task already exists ---
$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "Task '$TaskName' already exists. Removing and recreating..."
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# --- Create the task ---
$Action = New-ScheduledTaskAction `
  -Execute "node" `
  -Argument "scripts\backup.js --no-upload" `
  -WorkingDirectory $ProjectRoot

$Trigger = New-ScheduledTaskTrigger `
  -Daily `
  -At "03:00AM"

$Settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -RunOnlyIfNetworkAvailable:$false

$Principal = New-ScheduledTaskPrincipal `
  -UserId "$env:USERDOMAIN\$env:USERNAME" `
  -RunLevel Limited

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $Action `
  -Trigger $Trigger `
  -Settings $Settings `
  -Principal $Principal `
  -Description "Nexus database backup - runs pg_dump daily at 3 AM"

Write-Host "Task '$TaskName' created successfully."
Write-Host "It will run daily at 3:00 AM as $env:USERNAME."
