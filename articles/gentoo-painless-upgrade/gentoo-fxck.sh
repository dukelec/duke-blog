#!/bin/bash
set -o pipefail
set -o errexit

input="$1"
while IFS= read -r line
do
    [ "$line" == "" ] && break
    [[ "$line" =~ ^'[ebuild' ]] || { echo -e "\n Skip: $line\n\n"; continue; }
    line="${line#*] }"
    pname="${line%% *}"
    pname="${pname%%:*}"
    pfile="${pname##*/}.ebuild"
    pname=$(echo "$pname" | sed 's/\(-[0-9]\).*//g')
    echo ""
    echo ""
    echo "$pname | $pfile"
    echo ""
    #continue
    cd /usr/portage/$pname
    ebuild $pfile compile
    ebuild $pfile install
    ebuild $pfile qmerge
    rm -rf /var/tmp/portage/*
    echo ""
    sleep 1
done < "$input"

