#!/bin/bash
cd /home/kavia/workspace/code-generation/resume-matcher-301649-301660/ats_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

