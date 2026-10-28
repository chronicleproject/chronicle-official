# Brevo early-access signup

The static GitHub Pages site sends signups to the separate Render service in `signup-api/`. That service adds each consenting email address to the configured Brevo contact list for future campaigns. It does not send a transactional welcome email.

The signup endpoint adds an email address to one Brevo contact list for future Email campaigns. It does not send a transactional welcome email. After signup, the page confirms enrollment and reminds people to check Spam for Chronicle campaigns and mark them as Not spam if needed.

Configure these server-side environment variables in the local environment and deployment host:

```text
BREVO_API_KEY=your_private_v3_api_key
BREVO_EARLY_ACCESS_LIST_ID=your_numeric_contact_list_id
```

Create a private API key in Brevo under **SMTP & API → API keys** with the Contacts permissions needed for the signup endpoint, and create or select a dedicated **Early access** contact list under **CRM → Contacts → Lists**. The list ID is shown in the list details or returned by Brevo's `GET /v3/contacts/lists` endpoint.

Set these values in Render's service environment, never in a `NEXT_PUBLIC_` variable. Send announcements from the Brevo **Email campaigns** area to the Early access list.

On signup, the API checks whether the address is already in the early-access list and adds it if not. Repeated signups return an already-enrolled message. If Brevo isn't configured, the API returns an unavailable message rather than claiming signup succeeded.

The endpoint uses Brevo's `GET /v3/contacts/{identifier}` operation to check list membership and `POST /v3/contacts` with `updateEnabled: true` to add an existing Brevo contact to the list without creating a duplicate. See the [Brevo get contact API](https://developers.brevo.com/reference/get-contact-info) and [create contact API](https://developers.brevo.com/reference/create-contact).
