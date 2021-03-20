@echo off
title Bot made by Echo (yellowycorn6963 on twitch)

echo Installing required packages
echo ----------------------------
cd %~dp0
cmd /c "npm i"
echo .
echo Done!
echo Creating run file
echo ----------------------------
echo @echo off > run.bat
echo title Discord bot > run.bat
echo :START >> run.bat
echo node index.js >> run.bat
echo goto START >> run.bat
echo "run.bat" created
echo -----------------------------
echo Deleting install file
echo -----------------------------
del "%~f0"
echo Starting the bot...
call run.bat
echo closing the installer...
end
