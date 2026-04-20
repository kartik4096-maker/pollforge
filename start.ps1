# Start all 3 servers at once
Start-Process powershell -ArgumentList "cd '$PWD\server'; node index.js; pause"
Start-Process powershell -ArgumentList "cd '$PWD\analytics'; py -m uvicorn main:app --reload --port 8000; pause"
Start-Process powershell -ArgumentList "cd '$PWD\client'; npm run dev; pause"
