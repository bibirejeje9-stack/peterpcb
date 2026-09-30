# Peter PCB Engineering Assistant — V1

This package adds a working AI project-assistant interface to the PCB landing page.

## Included now
- Hybrid guided/free-text chat
- Peter's Engineering Assistant sales/engineering playbook
- Professional project qualification flow
- Controlled pricing boundaries (no final AI quote)
- Buyer contact capture
- Project file upload endpoint
- Full transcript handoff endpoint
- Email delivery target: pettypeterpcbdesign@gmail.com
- WhatsApp target: +2348135003912
- Telegram integration endpoint
- "Submit Project for Review" conversion handoff

## Before deployment
1. Import this folder/repository into Vercel.
2. Add the environment variables shown in `.env.example`.
3. Create an OpenAI API key and set `OPENAI_API_KEY`.
4. Create Vercel Blob storage and set `BLOB_READ_WRITE_TOKEN`.
5. Configure Resend and verify the sender/domain for production email.
6. Create a Telegram bot. Send the bot a message, obtain the numeric chat ID, and set `TELEGRAM_CHAT_ID`. `@leplentengr` is a username and cannot safely be assumed to be the bot chat ID.
7. Configure Meta WhatsApp Cloud API and set the token and phone-number ID.

## Important V1 limitation
The current package implements the buyer-facing AI and final transcript notifications. A persistent multi-user lead database and live Peter "Take Over / Return to AI" dashboard require the next backend phase (database + realtime session state). Do not treat browser state as a production lead database.

## Security
Never place API keys in `public/index.html` or client-side JavaScript. All secrets belong in Vercel environment variables.
