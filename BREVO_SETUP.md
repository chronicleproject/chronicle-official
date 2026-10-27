# Brevo early-access signup

The signup endpoint adds an email address to one Brevo contact list for future Email campaigns. It does not send a transactional welcome email. After signup, the page confirms enrollment and reminds people to check Spam for Chronicle campaigns and mark them as Not spam if needed.

Configure these server-side environment variables in the local environment and deployment host:

```text
BREVO_API_KEY=your_private_v3_api_key
BREVO_EARLY_ACCESS_LIST_ID=your_numeric_contact_list_id
```

Create a private API key in Brevo under **SMTP & API → API keys** with the Contacts permissions needed for the signup endpoint, and create or select a dedicated **Early access** contact list under **CRM → Contacts → Lists**. The list ID is shown in the list details or returned by Brevo's `GET /v3/contacts/lists` endpoint.

Keep the API key in server-side environment variables; never use a `NEXT_PUBLIC_` name. Restart the local Next.js server after updating `.env.local`. Send announcements from the Brevo **Email campaigns** area to the Early access list.

On signup, the route checks whether the address is already in the early-access list and adds it if not. Repeated signups return an already-enrolled message. The form can be exercised without Brevo credentials; it will not claim a signup succeeded when contact registration is unavailable.

The endpoint uses Brevo's `GET /v3/contacts/{identifier}` operation to check list membership and `POST /v3/contacts` with `updateEnabled: true` to add an existing Brevo contact to the list without creating a duplicate. See the [Brevo get contact API](https://developers.brevo.com/reference/get-contact-info) and [create contact API](https://developers.brevo.com/reference/create-contact).
